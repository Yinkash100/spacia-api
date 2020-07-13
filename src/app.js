

const express = require("express");
require("./db/mongoose");

// //============= FIREBASE STUFF ================//
// const admin = require('firebase-admin');
// const serviceAccount = require('../config/spacialab-28be9-firebase-adminsdk-xk1tq-3db8c8e726');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
//
// const fireDB = admin.firestore();
//
// async function storeFireObject (db){
//     const docRef = db.collection('users').doc('alovelace');
//
//     await docRef.set({
//         first: 'Ada',
//         last: 'Lovelace',
//         born: 1815
//     });
//     console.log("We added an object to firestore");
// }
//
// storeFireObject(fireDB);
//



const userRouter = require("./routers/user");
const designerRouter = require("./routers/designer");
const designRouter = require("./routers/design");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(designerRouter);
app.use(designRouter);

module.exports = app;
