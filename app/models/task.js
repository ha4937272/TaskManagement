const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  projid: {
    type: Number,
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

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
