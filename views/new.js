var mongoose = require("mongoose");

var newemploye = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    age: Number,
    skills: String,
    edu: String,
    photo: String,
    description: String
 });
 module.exports = mongoose.model("addnew", newemploye);