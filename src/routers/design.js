const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Designer = require("../models/designer");
const Design = require("../models/design");
const uploader = require("../uploader");
const { uploadFile, deleteFile } = require("../fireStorePlug");

// upload a design
router.post(
    "/design",
    auth,
    uploader.single("design"),
    (req, res) => {
        if(!req.file){
            res.status(400).send('No design file uploaded');
            return
        }


        const file = req.file;
        uploadFile(file, 'Designs').then(async (storedItem)=>{
            // storedItem returns the file name and its public URL

            const designer = await Designer.findOne({ user: req.user._id });
            const design = new Design({ ...req.body, design: storedItem, designer });

            await design.save();
            res.status(200).send(storedItem);

        }).catch((error)=>{
            console.error(error)
        });

    },

);




// view design
router.get("/design", auth, async (req, res)=> {
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
router.delete("/user/me", auth, async (req, res)=>{
    try {
        await User.remove({ _id: req.user._id });
        // sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    }catch(e){
        res.status(500).send();
    }
});


// change design privacy

// search for designs

// share design

// download designs



module.exports = router;
