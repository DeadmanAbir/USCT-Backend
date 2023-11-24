const mongoose = require('mongoose');
const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config()

const authorizationRouter=require("./routes/Authorization");
const driveRouter=require("./routes/DriveUploads");
const studentRouter=require("./routes/Student");
const excelRouter=require("./routes/Excel");
app.use(cors());
app.use(express.json());

app.use("/check", authorizationRouter);
app.use("/drive", driveRouter);
app.use("", studentRouter);
app.use("/excel", excelRouter);
const PORT= process.env.PORT || 2000;



mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });