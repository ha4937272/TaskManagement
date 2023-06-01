const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: { type: Number, required: true,unique:true },
  fname: { type: String },
  lname: { type: String },
  email: { type: String },
  password: { type: String },
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
