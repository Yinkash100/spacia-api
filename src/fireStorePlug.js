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

        let newFileName = `${Date.now()}_${file.originalname}`;
        const blob = bucket.file(newFileName);
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimeType,
            },

        });

        blobWriter.on('error', (err) =>{
            console.err(err);
            reject ("Something is wrong, Unable to upload at the moment", err)
        });
        blobWriter.on('finish', () => {
            // Assembling public URL for accessing the file via HTTP
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
                bucket.name
            }/o/${uploadFolder}/${encodeURI(blob.name)}?alt=media`;
            resolve({name: newFileName, url: publicUrl})
        });

        // When there is no more data to be consumed from the stream
        blobWriter.end(file.buffer);

    })
};

const deleteFile = async (filename)=> {
    // Deletes the avatar from bucket
    await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL).file(filename).delete();
    console.log(`gs://${bucket}/${filename} deleted`)
}




module.exports = {
    uploadFile,
    deleteFile
};
