const mongoose = require('mongoose');

const TasktranSchema = new mongoose.Schema({
  projid: {
    type: Number,
    required: true,
   
  },

  period: {
    type: Date,
    required: true,
   
  },
  
  tasks:[
    {
      taskid: {
        type: String,
      },
      taskname: {
        type: String,
      },
      desc: {
        type: String,
        
      },
      assignedto: {
        type: Number,
      
      },
      sdate: {
        type: Date,
        
    },

    duedt: {
      type: Date,
      
  },

  compdt: {
    type: Date,
    
},

priority: {
  type: String, 
},

status: {
  type: String, 
},

reason: {
  type: String,
},

  }
  ]
});

const Tasktran = mongoose.model('Tasktran', TasktranSchema);

module.exports = Tasktran;
