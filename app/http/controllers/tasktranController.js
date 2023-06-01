const Tasktran = require('../../models/tasktran')
const Task = require('../../models/task')
const Project = require('../../models/project')
const User = require('../../models/user')
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment')
function TasktranController() {
    return {
        async index(req,res) {
            const tasktrans = await Tasktran.find()
            res.render('tasktrandisplay',{tasktrans:tasktrans,moment:moment})
        },

        async addtasktran(req, res) {
          try {
            const projects = await Project.find();
            const users = await User.find();
            let tasktrans = []; // Initialize tasktrans as an empty array
            const projid = req.query.projid || '';
            const period = req.query.period || '';
        
            if (projid && period) {
              tasktrans = await Tasktran.find({ projid, period });
              if (!tasktrans || tasktrans.length === 0) {
                // Fetch tasks from the 'task' collection when no tasktrans is found
                const projectTasks = await Task.findOne({ projid }).select('tasks');
                if (projectTasks) {
                  tasktrans = projectTasks.tasks;
                }
              }
            }
        
            res.render('addtasktran', { projects, users, tasktrans });
          } catch (err) {
            //console.error(err);
            res.status(500).send('Server Error');
          }
        },

        
        
    
        async addtasktranrec(req, res) {
          try {
            const projid = req.body.projid;
            const period = req.body.period;
        
            // Check if the period already exists in tasktran for the selected project
            const existingTasktran = await Tasktran.findOne({ projid, period });
        
            if (existingTasktran) {
              // Period already exists, redirect to tasktran page
              return res.redirect('/tasktran');
            }
        // Fetch all tasks from the task collection that match the projid
const taskDocument = await Task.findOne({ projid });

// Get the tasks array from the taskDocument
const tasks = taskDocument.tasks;

// Create an array of task objects
const taskObjects = tasks.map((task) => {
  return {
    taskid: task.taskid,
    taskname: task.taskname,
    desc: task.desc,
    assignedto: task.assignedto,
    sdate: task.sdate,
    duedt: task.duedt ,
    compdt: task.compdt,
    priority: task.priority,
    status: task.status,
    reason: task.reason,
  };
});

//console.log(taskObjects);

        
            // Create a new tasktran document
            const tasktran = new Tasktran({
              projid,
              period,
              tasks: taskObjects,
            });
        
            await tasktran.save();
            // Fetch the newly created tasktran document to pass to the render function
            const selectedTasktran = await Tasktran.findById(tasktran._id);

           // return res.render('addtasktran', {selectedTasktran });
        
            return res.redirect('/tasktran');
          } catch (err) {
            //console.error(err);
            return res.redirect('/tasktran/add');
          }
        },

        async  edittasktran(req, res) {
          const projectId = req.params.id;
          const projects = await Project.find();
          const users = await User.find();
          const tasktran = await Tasktran.findOne({ projid: projectId });
          const tasksResult = await Tasktran.find();
          const tasks = tasksResult[0].tasks;
        
          if (!tasktran) {
            return res.redirect('/tasktran');
          }
        
          res.render('edittasktran', { tasktran, tasks, tasksResult, projects, users, moment: moment });
        },


        async edittasktranrec(req, res) {
          try {
            const { id } = req.params;
            const { projid, tasks } = req.body; // Destructure the projid and tasks from req.body
        
            //console.log(projid, tasks); // Log the projid and tasks objects to verify the data
        
            // Validate that the projid is a valid number
            const projidNumber = Number(projid);
            //console.log(projidNumber); // Log the parsed numeric value
        
            // Check if the parsed value is a valid number
            if (isNaN(projidNumber) || !Number.isInteger(projidNumber)) {
              return res.status(400).send('Invalid numeric value for projid');
            }
        
            const tasktran = await Tasktran.findOne({ projid: id });
            if (!tasktran) {
              return res.status(404).send('Task not found');
            }
            else {
            // Update the task properties with the new values
            tasktran.tasks = tasks;

            await tasktran.save()
            return res.redirect('/tasktran');
            }
        
            // Rest of the code
          } catch (err) {
            //console.error(err);
            return res.redirect('/tasktran');
          }
        },
        
        async tasktrandownload(req, res) {
          try {
            // Fetch data for the Excel file
            const tasks = await Tasktran.find();
        
            // Create a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Tasks');
        
            // Define the column headers
            worksheet.columns = [
              { header: 'Project Id', key: 'projid' },
              { header: 'Period', key: 'period' },
              { header: 'Task ID', key: 'taskid' },
              { header: 'Task Name', key: 'taskname' },
              { header: 'Description', key: 'desc' },
              { header: 'Assignedto', key: 'assignedto' },
              { header: 'Sdate', key: 'sdate' },
              { header: 'Due Date', key: 'duedt' },
              { header: 'Completed Date', key: 'compdt' },
              { header: 'Priority', key: 'priority' },
              { header: 'Status', key: 'status' },
              { header: 'Reason', key: 'reason' },
            ];
        
            // Populate the worksheet with data
            tasks.forEach((task) => {
              task.tasks.forEach((subTask) => {
                const row = {
                  projid: task.projid,
                  period: task.period,
                  taskid: subTask.taskid,
                  taskname: subTask.taskname,
                  desc: subTask.desc,
                  assignedto: subTask.assignedto,
                  sdate: subTask.sdate ? subTask.sdate.toISOString().slice(0, 10) : '',
                  duedt: subTask.duedt ? subTask.duedt.toISOString().slice(0, 10) : '',
                  compdt: subTask.compdt ? subTask.compdt.toISOString().slice(0, 10) : '',
                  priority: subTask.priority,
                  status: subTask.status,
                  reason: subTask.reason,
                };
                worksheet.addRow(row);
              });
            });
        
            // Set the response headers for downloading the Excel file
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=tasktran.xlsx');
        
            // Stream the Excel file to the response
            await workbook.xlsx.write(res);
            res.end();
          } catch (error) {
            //console.error('Error generating Excel file:', error);
            res.status(500).send('Internal Server Error');
          }
        }
        
        ,
        
  
        

        async  tasktranpdf(req, res) {
          try {
            // Fetch data for the PDF
            const tasks = await Tasktran.find();
        
            // Create a new PDF document
            const doc = new PDFDocument();
        
            // Set the response headers for downloading the PDF file
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=tasktran.pdf');
        
            // Stream the PDF content to the response
            doc.pipe(res);
        
            // Add content to the PDF document
            doc.fontSize(18).text('Tasks', { align: 'center' });
            doc.moveDown();
        
            tasks.forEach((task) => {
              task.tasks.forEach((subTask) => {
                doc.fontSize(14).text(`Project Id: ${task.projid}`);
                doc.fontSize(14).text(`Period: ${task.period}`);
                doc.fontSize(14).text(`Task Id: ${subTask.taskid}`);
                doc.fontSize(14).text(`Task Name: ${subTask.taskname}`);
                doc.fontSize(14).text(`Description: ${subTask.desc}`);
                doc.fontSize(14).text(`Assigned To: ${subTask.assignedto}`);
                doc.fontSize(14).text(`Start Date: ${subTask.sdate ? subTask.sdate.toISOString().slice(0, 10) : ''}`);
                doc.fontSize(14).text(`Due Date: ${subTask.duedt ? subTask.duedt.toISOString().slice(0, 10) : ''}`);
                doc.fontSize(14).text(`Completed Date: ${subTask.compdt ? subTask.compdt.toISOString().slice(0, 10) : ''}`);
                doc.fontSize(14).text(`Priority: ${subTask.priority}`);
                doc.fontSize(14).text(`Status: ${subTask.status}`);
                doc.fontSize(14).text(`Reason: ${subTask.reason}`);
                doc.moveDown();
              });
            });
        
            // Finalize the PDF document
            doc.end();
          } catch (error) {
            //console.error('Error generating PDF:', error);
            res.status(500).send('Internal Server Error');
          }
        }
        
        
        
        
        
        
        
    }
}    
module.exports = TasktranController