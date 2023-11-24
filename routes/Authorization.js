const express = require("express");
const router = express.Router();
const { SuperAdmin, AuthorizedTeachers } = require("../db/indexDB");

router.post("/superadmin", async (req, res) => {
    const newSuperAdmin = new SuperAdmin();

    const { email } = req.body;
    const value = newSuperAdmin.email;
    if (email == value) {
        res.send(true)
    } else {
        res.send(false)
    }
    console.log(value, email);

});


router.get("/authorization/email=:mail", async (req, res) => {

    const mail = req.params.mail;
    const newTeacher = new AuthorizedTeachers();
    //  console.log(newTeacher);
    console.log(mail, newTeacher.teachers.length);
    for (let i = 0; i < newTeacher.teachers.length; i++) {
        if (newTeacher.teachers[i].email == mail) {
            return res.send({ authorized: true, name: newTeacher.teachers[i].name });
        }
    }
    res.send({ authorized: false, name: null });

})



module.exports = router;