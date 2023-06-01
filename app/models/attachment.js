const mongoose = require('mongoose');

const attachSchema = new mongoose.Schema({
  attachid: { type: Number, required: true,unique:true },
  taskid: { type: String },
  filename: { type: String },
  fileloc: { type: String },
});

const Attachment = mongoose.model('Attachment', attachSchema);

module.exports = Attachment;
