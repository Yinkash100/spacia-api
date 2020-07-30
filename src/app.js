const express = require("express");
const cors = require("cors");
require("./db/mongoose");


const userRouter = require("./routers/user");
const designerRouter = require("./routers/designer");
const designRouter = require("./routers/design");
const taskRouter = require("./routers/task");

const app = express();



app.use(express.json());

app.use(cors({origin: true, credentials: true}));

app.use(userRouter);
app.use(designerRouter);
app.use(designRouter);
app.use(taskRouter);

module.exports = app;
