const express = require("express");
const router = express.Router();
const { Student } = require("../db/indexDB");

router.get("/students/:type/:semester/:creator", async (req, res) => {
    const type = req.params.type;
    const sem = req.params.semester;
    const creator = req.params.creator;

    console.log(type, sem, creator);
    const data = await Student.find({ type: type, semester: parseInt(sem), creator: creator });
    res.json(data);
    //console.log(data);
})


router.post("/create/students/:type", async (req, res) => {
    const { name, company, year, creator, semester, enrollment, url } = req.body;
    const type = req.params.type;
    const objs = {
        name: name,
        company: company,
        year: year,
        creator: creator,
        type: type,
        semester: semester,
        enrollment: enrollment,
        url: url
    }
    const newData = new Student(objs);
    newData.save();
    res.json({ message: "Student data successfully" });
})



module.exports = router;

