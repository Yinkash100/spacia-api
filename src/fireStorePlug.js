const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);



const uploadFile =   (file, uploadFolder)=>{
    return new Promise((resolve, reject)=>{
        if(!file){
            reject('No File to upload')
        }

        let newFileName = `${uploadFolder}/${file.originalname}`;
        const blob = bucket.file(newFileName);
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimeType,
            },

        });

        blobWriter.on('error', (err) =>{
            console.log(err);
            reject ("Something is wrong, Unable to upload at the moment", err)
        });
        blobWriter.on('finish', () => {
            // Assembling public URL for accessing the file via HTTP
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
                bucket.name
            }/o/${encodeURI(blob.name)}?alt=media`;
            resolve({name: file.originalname, location: newFileName, url: publicUrl})
        });

        // When there is no more data to be consumed from the stream
        blobWriter.end(file.buffer);

    })
};

// uploadFolder = `spacialab/taskFiles/${req.user.username}/${task.id}`
const uploadFiles =   (files, uploadFolder)=>{
    return new Promise((resolve, reject)=>{
        if(!files){
            reject('No File to upload')
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadFile(file, uploadFolder)
              .then(async (storedItem)=> {
                  // Return the file name and its public URL

                })
        }

    })
};

const deleteFile = async (filename)=> {
    // Deletes the avatar from bucket
    await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL).file(filename).delete();
    // console.log(`gs://${bucket}/${filename} deleted`)
}

const uploadTaskFiles = (files)=>{
    return new Promise ((resolve, reject)=>{

    })
}



module.exports = {
    uploadFile,
    deleteFile
};
