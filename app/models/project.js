const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projid: { type: Number, required: true,unique:true },
  projname: { type: String },
  desc: { type: String },
  sdate: { type: Date },
  enddate: { type: Date },
  status: { type: String },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
