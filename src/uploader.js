const multer = require("multer");

const imageUploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5000 * 1024 * 1024, // limit file size to 5mb
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)){
            return cb(new Error("Please enter a image file"))
        }
        cb(undefined, true)
    },
});

const fileUploader = multer({

    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1000 * 1024 * 1024, // limit file size to 10mb
    }
});

module.exports = {
    imageUploader,
    fileUploader,
};
