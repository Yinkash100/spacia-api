const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Design = require("../models/design");
const multer = require("multer");
const sharp = require("sharp");

// upload a design
router.post(
    "/user/design/",
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




// view design
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


// delete design

// change design privacy

// search for designs

// share design

// download designs



module.exports = router;
