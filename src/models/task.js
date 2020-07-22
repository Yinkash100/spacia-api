const mongoose = require("mongoose");
const User = require("./user");

const taskSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  brief: {
    type: String,
  },
  details: {
    type: String,
  },
  duration: {
    type: String,
  },
  budget: {
    type: String,
  },
  designTools: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  attachments: [{
    type: Object,
  }]
},
{
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
