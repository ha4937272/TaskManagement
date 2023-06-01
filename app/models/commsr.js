const mongoose = require('mongoose');

const commsrSchema = new mongoose.Schema({
  cid: { type: Number, default:4000},
});

const Commsr = mongoose.model('Commsr', commsrSchema);

module.exports = Commsr;
