const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require('../models/task');
const { fileUploader } = require("../uploader");
const { uploadFile, deleteFile } = require("../fireStorePlug");

router.post("/task", auth, fileUploader.array('taskFiles', 10),  async (req, res, next)=>{

  const task = new Task(req.body);

  if(req.files){
    const files = req.files;

    for (let i = 0; i < files.length; i++){
      const file = files[i];
      const attachment = await uploadFile(file, `spacialab/taskFiles/${req.user.username}/${task.id}`)
        .then((storedItem) => {
          // Return the file name and its public URL
//           task.attachment.push(storedItem)
          return storedItem
        })
        .catch((error) => {
          // console.log(error);
          return req.status(400).send('cannot upload files')
        });
      // console.log(attachment)
      task.attachments.push(attachment)

    }


    try{
      await task.save();
      res.status(201).send(task);
    }
    catch(e){
      res.status(400).send('cannot save task')
    }
  }


});

module.exports = router;
