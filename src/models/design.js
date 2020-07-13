const mongoose = require("mongoose");
// const validator = require("validator");

const designSchema = new mongoose.Schema({
    design: {
        type: Object,  // an object that stores the name and url of the design in the firestore storage.
    },
    views: {
        type: Number, // number of views on the design have
    },
    downloads: {
        type: Number,
    },
    tags: {
        type: Array,
    },
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Designer"
    }
},{
    timestamps: true,
    }
);

const Design = mongoose.model("Design", designSchema);
module.exports = Design;
