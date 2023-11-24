const mongoose = require('mongoose');
const authorizedTeachersArray=require("../Teachers.json");
require('dotenv').config()

const studentSchema = new mongoose.Schema({
    name: String,
    company: String,
    year: Number,
    creator: String,
    type: String,
    semester: Number,
    enrollment: String,
    url: String
  });
  
  const superAdminSchema = new mongoose.Schema({
    email: {
      type: String,
      default: 'officeusct@gmail.com' // Set your hardcoded email here
    }
  });
  
  const authorizedTeachersSchema = new mongoose.Schema({
    teachers: {
      type: [
        {
          name: String,
          email: String,
        },
      ],
      default:authorizedTeachersArray,
    },
  });
  
  const AuthorizedTeachers = mongoose.model('AuthorizedTeachers', authorizedTeachersSchema);
  const Student = mongoose.model('Student', studentSchema);
  const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
  
  module.exports={
    AuthorizedTeachers,
    Student,
    SuperAdmin
  }
  
  
  
  