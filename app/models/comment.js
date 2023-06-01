const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commid:    { type: Number, required: true,unique:true },
  taskid:    { type: Number },
  userid:    { type: Number },
  comment:   { type: String },
  dt:        { type: Date },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
