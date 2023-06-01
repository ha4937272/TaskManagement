const User = require('../../models/user')
const Project = require('../../models/project')
const Task = require('../../models/task')
const Tasktran = require('../../models/tasktran')
const Comment = require('../../models/comment')
const Attachment = require('../../models/attachment')
function homeController() {
    //Factory Function
    return {
      async index(req, res) {
        try {
          const userCount = await User.countDocuments();
          //console.log('Number of users:', userCount);

          const projectCount = await Project.countDocuments();
          //console.log('Number of projects:', projectCount);

          const taskCount = await Task.countDocuments();
          //console.log('Number of tasks:', taskCount);

          const tasktranCount = await Tasktran.countDocuments();
          //console.log('Number of tasks:', tasktranCount);

          const commentCount = await Comment.countDocuments();
          //console.log('Number of comments:', commentCount);

          const attachmentCount = await Attachment.countDocuments();
          //console.log('Number of attachments:', attachmentCount);

          const completedTaskCount = await Task.countDocuments({ 'tasks.status': 'Completed' });
          //console.log('Completed Task Count:', completedTaskCount);

          const pendingTaskCount = await Task.countDocuments({ 'tasks.status': 'In Progress' });
          //console.log('Pending Task Count:', pendingTaskCount);

          // Prepare data for the chart
             const taskCountByStatus = {
            Completed: completedTaskCount.length,
            InProgress:pendingTaskCount.length , 
           };

      
          return res.render('index', { userCount, projectCount,taskCount,commentCount,attachmentCount,tasktranCount
            ,completedTaskCount,pendingTaskCount,taskCountByStatus
          }); // Pass userCount as a variable to the view
        } catch (error) {
          //console.error('Error counting users:', error);
          return res.render('index', { userCount: 0, projectCount: 0,taskCount: 0,commentCount:0,attachmentCount:0,tasktranCount:0,completedTaskCount:0,pendingTaskCount:0}); // Handle error and pass a default value
        }
      },
      

    }
}

module.exports = homeController