const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Designer = require("../models/designer");
const User = require("../models/user");
// const multer = require("multer");
// const sharp = require("sharp");


// Create a designer profile
router.post("/designer", auth, async (req, res)=>{
    const designer = new Designer({ ...req.body, user:req.user._id});

    try {
        await designer.save();
        res.status(201).send(designer)
    }catch(e){
        res.status(400).send(e)
    }
});

// get a designers profile
router.get("/designer/:username", async (req, res)=>{
    try{
        const user = await User.findOne({ username: req.params.username });
        const designer = await Designer.findOne({ user: user._id }).populate('user');

        if(!designer){
            return res.status(404).send();
        }

        res.send({designer, user: designer.populated('user')});
    }catch(e){
        res.status(500).send(e);
    }
});


// edit designer profile
router.patch("/designer/me", auth, async (req, res) => {
    // const user = await User.findOne({ _id. req.body._id });
    const designer = await Designer.findOne({ user: req.user._id, username: req.params.username });

    if(!designer){
        return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ["location", "profileIntro", "exponentsOfDesign", "designation", "avgDeliveryTime"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({error: "cannot update these fields"});
    }

    try {
        updates.forEach((update) => (designer[update] = req.body[update]));
        await designer.save();
        res.send(designer);
    } catch (e) {
        res.status(500).send(e);
    }
});

// like designer
router.post("/designer/:username/like", auth, (req, res)=> {
   const Designer = route.params
});

// follow designer


// Rate a designer


module.exports = router;
