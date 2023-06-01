const mongoose = require('mongoose');

const attsrSchema = new mongoose.Schema({
  aid: { type: Number},
});

const Attsr = mongoose.model('Attsr', attsrSchema);

module.exports = Attsr;
