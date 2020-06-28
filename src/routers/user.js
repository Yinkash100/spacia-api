const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
// const { sendWelcomeEmail } = require("../email/account");
// const { sendWelcomeEmail, sendCancelEmail } = require("../")

router.post("/user", async (req, res) => {
  const user = new User(req.body);

  try {
    // sendWelcomeEmail(user.email, user.name);
    await user.save();

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
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
    await User.remove({ _id: req.user._id });
    // sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  }catch(e){
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error("Please enter a image file"))
    }

    cb(undefined, true)
  }
});


// upload profile avatar
router.post(
    "/users/me/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
      console.log("looking for buffer");
      const buffer = await sharp(req.file.buffer)
          .png()
          .resize({ width: 250, height: 250 })
          .toBuffer();
      console.log("suscessfully recieved buffer");
      req.user.avatar = buffer;

      await req.user.save();
      res.send();
    },
    (error, req, res, next) => {
      res.status(400).send({ error: error.message });
    }
);

// delete profile avatar
router.delete("/users/me/avatar", auth, async (req, res)=>{
  req.user.avatar = undefined;
  await req.user.save();

  res.send();
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
