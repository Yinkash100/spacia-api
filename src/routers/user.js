const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const { imageUploader } = require("../uploader");

const { uploadFile, deleteFile } = require("../fireStorePlug");

// const { sendWelcomeEmail } = require("../email/account");
const { sendWelcomeEmail, sendCancelEmail, sendActivationEmail } = require("../email/sendgridMailer");

router.post("/user", async (req, res) => {
  const user = new User(req.body);

  // make sure people dont update some system fields through the api
  const fields = Object.keys(req.body);
  req.body.activated = false;
  const notAllowedUpdates = ['lastLogin', 'online', 'activated'];
  const isInvalidOperation = fields.some(r=> notAllowedUpdates.indexOf(r) >= 0);


  try {
    if(isInvalidOperation){
      res.status(400).send('you cannnot edit those fields')
    }


    await user.save();
    const activationToken = await user.generateActivationToken();
    const activationLink = `${process.env.FRONT_END_URL}/account_activate/${activationToken}`;
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name, activationToken);
    sendActivationEmail(user.email, user.name, activationLink)
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/user/activate/:activationCode", async(req, res)=>{
  try{

    const user = await User.findOne({
      activationToken: req.params.activationCode,
      activationExpires: {$gte: new Date(Date.now())}
    });

    if(!user) {
      return res.status(400).send('Invalid or expired Activation Code');
    }

    console.log('user found');

    user.activated = true;
    user.activationToken = undefined;
    user.activationExpires = undefined;
    await user.save();
    res.status(200).send("Account successfully activated");
  }
   catch(e){
    console.log(e);
    res.status(404).send(e)
   }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    // generate token for current session
    const token = await user.generateAuthToken();

    // saves the login date and time
    user.lastLogin = new Date();
    user.online = true;
    await user.save();

    res.send({ user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token !== req.token;
    });
    req.user.online = false;
    await req.user.save();

    res.send();
  } catch (e) {
    req.status(500).send();
  }
});

router.post("/user/logoutAll", auth, async(req, res) => {
  try{
    req.user.tokens = [];
    await req.user.save();

    res.send();
  }catch (e) {
    req.status(500).send()
  }
});

router.get("/user/me", auth, async(req, res)=> {
  res.send(req.user);
});

router.patch("/user/me", auth, async(req, res)=>{
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "phoneNumber"];
  const isValidOperation = updates.every((update)=>
    allowedUpdates.includes(update)
  );

  if(!isValidOperation){
    return res.status(400).send({error: "invalid updates"});
  }

  try {
    updates.forEach((update)=> (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  }catch (e) {
    res.status(500).send(e)
  }
});

router.delete("/user/me", auth, async (req, res)=>{
  try {

    // delete user avatar from storage
    if(req.user.avatar){
      deleteFile(req.user.avatar.name).catch(console.error);
    }

    // send cancel email
    sendCancelEmail(req.user.email. req.user.name).catch((err)=>{console.log(err)});

    // delete all user designs

    // delete designer profile

    await User.remove({ _id: req.user._id });
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  }catch(e){
    res.status(500).send();
  }
});



// upload profile avatar
router.post(
    "/users/me/avatar",
    auth,
    imageUploader.single("avatar"),
    (req, res, next) => {
        if(!req.file){
          res.status(400).send('No file uploaded');
          return
        }

        // delete previous user avatars
        if(req.user.avatar){
          deleteFile(req.user.avatar.name).catch(console.error);
          console.log('Scuussfully deleted previous avatar');
        }

        const file = req.file;
        console.log('avatarFile =>', file)
        uploadFile(file, `spacialab/users/${req.user.username}/avatar`)
          .then(async (storedItem)=>{
          // Returns the file name and its public URL
          req.user.avatar = storedItem;
          await req.user.save();
          res.send(storedItem);

        }).catch((error)=>{
          console.error(error)
        });


    }
);



// delete profile avatar
router.delete("/users/me/avatar", auth, async (req, res)=>{
  if(!req.user.avatar){
    return res.status(404).send('Avatar not found');
  }
  const avatar = req.user.avatar;

  deleteFile(avatar.name).catch((error)=>{
    console.log('Hole up, An error occured, cannot delete avatar', error)
    return res.status(400).send('Cannot delete avatar')
  });

  req.user.avatar = undefined;
  await req.user.save();

  res.status(200).send();
});

// view user avatar
router.get("users/:id/avatar", auth, async (req, res)=> {
  try{
    const user = await User.findById(req.params.id);

    if(!user) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  }catch(e) {
    res.status(404)
  }
});

module.exports = router;
