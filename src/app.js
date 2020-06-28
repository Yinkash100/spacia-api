const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const designerRouter = require("./routers/designer");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(designerRouter);

module.exports = app;
