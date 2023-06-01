const mongoose = require('mongoose');

const suserSchema = new mongoose.Schema({
  suid: { type: Number},
});

const Suser = mongoose.model('Suser', suserSchema);

module.exports = Suser;
