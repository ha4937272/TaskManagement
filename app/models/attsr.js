const mongoose = require('mongoose');

const attsrSchema = new mongoose.Schema({
  aid: { type: Number, default:5000},
});

const Attsr = mongoose.model('Attsr', attsrSchema);

module.exports = Attsr;
