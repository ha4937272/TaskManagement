const mongoose = require('mongoose');

const pserialSchema = new mongoose.Schema({
  pid: { type: Number},
});

const Pserial = mongoose.model('Pserial', pserialSchema);

module.exports = Pserial;
