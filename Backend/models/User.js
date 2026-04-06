const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: String,
  email: String,
  password: String,
  role: String,

  phone: String,
  city: String,
  budget: String,

  companyName: String,

  developerName: String,
  contactName: String,
  gstNumber: String,
  reraNumber: String,
  documentLink: String

});

module.exports = mongoose.model("User", UserSchema);