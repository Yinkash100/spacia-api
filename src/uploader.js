const multer = require("multer");

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10000 * 1024 * 1024, // limit file size to 5mb
    },
    // fileFilter(req, file, cb){
    //     if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
    //         return cb(new Error("Please enter a image file"))
    //     }
    //
    //     cb(undefined, true)
    // }
});

module.exports = uploader;
