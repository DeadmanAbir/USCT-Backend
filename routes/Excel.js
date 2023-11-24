const express = require("express");
const router = express.Router();
const XLSX = require('xlsx');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    const { teacherName, type, sem } = req.body;
    try {
        console.log(teacherName, type, sem);

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const timestampRow = jsonData.find(row => row['Timestamp']);
        console.log(timestampRow);
        const filteredData = jsonData.filter(row => {
            return row['Your Assigned Mentor'] == teacherName && row['Type of Internship'] == type && row['Semester'] == sem;
        });

        // Store filteredData in MongoDB if needed
        console.log(filteredData)

        res.json(filteredData);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
    }
});

module.exports = router;
