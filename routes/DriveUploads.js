const express = require("express");
const router = express.Router();
const {Student}=require("../db/indexDB.js");
const fs = require("fs");

const {
  findYearFolder,
  generatePublicUrl,
  uploadFile,
  findOrCreateFolder,
  drive
} = require('../Controllers/DriveFunctions.js');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });


router.post('/file/upload', upload.single('file'), async (req, res) => {
  try {
    const response = await uploadFile(req.file.originalname, req.file.path);
    fs.unlinkSync(req.file.path);
    res.send(response);
  } catch (error) {
    console.error('Error uploading to Google Drive:', error.message);
    res.status(500).send('Error uploading file.');
  }
});

router.delete("/superadmin/delete/:year", async (req, res) => {
  try {
    const year = req.params.year;


    const yearFolder = await findYearFolder(year);


    if (!yearFolder) {
      console.log(`No matching folder for year ${year}`);
      return res.status(404).send(`No matching folder for year ${year}`);
    }

    const filesInFolder = await drive.files.list({
      q: `'${yearFolder.id}' in parents`,
    });

    for (const file of filesInFolder.data.files) {
      await drive.files.delete({ fileId: file.id });
    }

    // Delete the folder itself
    await drive.files.delete({ fileId: yearFolder.id });

    console.log(`Folder and files for year ${year} deleted`);
    res.status(200).send(`Folder and files for year ${year} deleted`);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
})


router.put("/upload/pdf",upload.single('file'), async(req, res)=>{
  
  const {courseId}=req.body;
  try {
    const response=await uploadFile(req.file.originalname, req.file.path);
    fs.unlinkSync(req.file.path);
    console.log("Data :",response.webContentLink);
    const url=response.webContentLink;
    try{
      const update= await Student.findByIdAndUpdate(courseId, {url: url}, {new: true});
    }catch(e){
      console.log(e);
    }

    
    } catch (error) {
      console.error('Error uploading to Google Drive:', error.message);
      res.status(500).send('Error uploading file.');
    }
})

module.exports = router;
