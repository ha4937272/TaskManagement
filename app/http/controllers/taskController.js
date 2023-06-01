const Task = require('../../models/task')
const Project = require('../../models/project')
const User = require('../../models/user')
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment')
function TaskController() {
    return {
        async index(req,res) {
            const taskss = await Task.find()
            res.render('taskdisplay',{taskss:taskss,moment:moment})
        },

        async addtask(req,res) {
            try {
                const projects = await Project.find();
                const users = await User.find();
                res.render('addtask', { projects,users});
              } catch (err) {
                //console.error(err);
                res.status(500).send('Server Error');
              }
        },
       
        async addtaskrec(req, res) {
          try {
            const task1 = new Task({
              projid: req.body.projid,
              tasks: []
            });
        
            const tasks = req.body.tasks || []; // Use empty array as default if tasks array is undefined
            for (let i = 0; i < tasks.length; i++) {
              const task = tasks[i];
              if (task.priority) { // Check if priority is not empty
                task1.tasks.push({
                  taskid: task.taskid,
                  taskname: task.taskname,
                  desc: task.desc,
                  assignedto: task.assignedto,
                  sdate: task.sdate,
                  duedt: task.duedt,
                  compdt: task.compdt,
                  priority: task.priority,
                  status: task.status,
                  reason: task.reason,
                });
              }
            }
        
            if (task1.tasks.length > 0) { // Check if at least one task has non-empty priority
              await task1.save();
            }
            return res.redirect('/task');
          } catch (err) {
            //console.error(err);
            return res.redirect('/task/add');
          }
        },

        
          
        

        async  edittask(req, res) {
          const projectId = req.params.id;
          const projects = await Project.find();
          const users = await User.find();
          const task = await Task.findOne({ projid: projectId });
          const tasksResult = await Task.find();
          const tasks = tasksResult[0].tasks;
        
          if (!task) {
            return res.redirect('/task');
          }
        
          res.render('edittask', { task, tasks, tasksResult, projects, users, moment: moment });
        },
        
        async edittaskrec(req, res) {
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
        
            const task = await Task.findOne({ projid: id });
            if (!task) {
              return res.status(404).send('Task not found');
            }
            else {
            // Update the task properties with the new values
            task.tasks = tasks;

            await task.save()
            return res.redirect('/task');
            }
        
            // Rest of the code
          } catch (err) {
            //console.error(err);
            return res.redirect('/task');
          }
        },

        async taskdownload(req, res) {
          try {
            // Fetch data for the Excel file
            const tasks = await Task.find();
        
            // Create a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Tasks');
        
            // Define the column headers
            worksheet.columns = [
              { header: 'Project Id', key: 'projid' },
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
            res.setHeader('Content-Disposition', 'attachment; filename=task.xlsx');
        
            // Stream the Excel file to the response
            await workbook.xlsx.write(res);
            res.end();
          } catch (error) {
            //console.error('Error generating Excel file:', error);
            res.status(500).send('Internal Server Error');
          }
        }
        
        ,
        
  
        

        async  taskpdf(req, res) {
          try {
            // Fetch data for the PDF
            const tasks = await Task.find();
        
            // Create a new PDF document
            const doc = new PDFDocument();
        
            // Set the response headers for downloading the PDF file
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=task.pdf');
        
            // Stream the PDF content to the response
            doc.pipe(res);
        
            // Add content to the PDF document
            doc.fontSize(18).text('Tasks', { align: 'center' });
            doc.moveDown();
        
            tasks.forEach((task) => {
              task.tasks.forEach((subTask) => {
                doc.fontSize(14).text(`Project Id: ${task.projid}`);
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
module.exports = TaskController