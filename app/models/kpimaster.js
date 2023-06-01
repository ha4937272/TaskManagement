const mongoose = require('mongoose');

const KpiMasterSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  items:[
    {
      itemno: {
        type: String,
        required: true
      },
      item: {
        type: String,
        required: true
      },
      low: {
        type: Number,
        default:0
      },
      avg: {
        type: Number,
        default:0
      },
      high: {
        type: Number,
        default:0
      }
    }
  ]
});

const KpiMaster = mongoose.model('KpiMaster', KpiMasterSchema);

module.exports = KpiMaster;
