const Attachment = require('../../models/attachment')
const Task = require('../../models/task')
const Attsr = require('../../models/attsr')
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
function attachmentController() {
return {
    async index(req,res) {
        const attachments = await Attachment.find()
        res.render('attachmentdisplay',{attachments:attachments})
    },


    
    async addattachment(req, res) {
        const tasksResult = await Task.find();
        const tasks = tasksResult[0].tasks; // Access the tasks array
        Attsr.findOne({}, (err, attsr1) => {
          if (err) {
            //console.log(err);
            return res.redirect('/attachment/add');
          }
          const nextAttachmentId =  attsr1.aid + 1;
          res.render('addattachment', { nextAttachmentId,tasks });
        });
      },
      

      async addattachmentrec(req, res) {
        const { taskid, filename, fileloc } = req.body;
      
        // Update the suid in the suser collection
        const attsr = await Attsr.findOne({});
        attsr.aid += 1;
        await attsr.save();
      
        const attach1 = new Attachment({
          attachid: attsr.aid,
          taskid:taskid,
          filename: filename,
          fileloc: fileloc,
        });
      
        await attach1
          .save()
          .then((result) => {
            return res.redirect('/attachment');
          })
          .catch((err) => {
            //console.log(err);
            return res.redirect('/attachment/add');
          });
      },

      async editattachment(req, res) {
        const attachmentId = req.params.id;
        const attachment = await Attachment.findOne({ attachid: attachmentId });
        const tasksResult = await Task.find();
        const tasks = tasksResult[0].tasks;
      
        if (!attachment) {
          return res.redirect('/attachment');
        }
      
        res.render('editattachment', { attachment,tasks,tasksResult });
      },

      
      async editattachmentrec(req, res) {
        const attachmentId = req.params.id;
        const {  taskid, filename, fileloc } = req.body;
      
        try {
          const attachment = await Attachment.findOne({ attachid: attachmentId });
          if (!attachment) {
            return res.redirect('/attachment');
          }
      
          attachment.taskid = taskid;
          attachment.filename = filename;
          attachment.fileloc = fileloc;
          
          
      
          await attachment.save();
      
          return res.redirect('/attachment');
        } catch (error) {
          //console.log(error);
          return res.redirect('/attachment');
        }
      },

      async attachmentdownload(req,res) {
        try {

          // Fetch data for the Excel file
          const attachments = await Attachment.find();
      
          // Create a new workbook and worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Attachments');
      
          // Define the column headers
          worksheet.columns = [
            { header: 'Attachment Id', key: 'attachid' },
            { header: 'Task Id', key: 'taskid' },
            { header: 'File Name', key: 'filename' },
            { header: 'File Location', key: 'fileloc' },
           
          ];
      
          // Populate the worksheet with data
          attachments.forEach((attachment) => {
            worksheet.addRow(attachment.toObject());
          });
      
          // Set the response headers for downloading the Excel file
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=attachments.xlsx');
      
          // Stream the Excel file to the response
          await workbook.xlsx.write(res);
          res.end();
        } catch (error) {
          //console.error('Error generating Excel file:', error);
          res.status(500).send('Internal Server Error');
        }
      },
      

      async attachmentpdf(req,res) {
        try {
          // Fetch data for the PDF
          const attachments = await Attachment.find();
      
          // Create a new PDF document
          const doc = new PDFDocument();
      
          // Set the response headers for downloading the PDF file
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=attachments.pdf');
      
          // Stream the PDF content to the response
          doc.pipe(res);
      
          // Add content to the PDF document
          doc.fontSize(18).text('Attachments', { align: 'center' });
          doc.moveDown();
      
          attachments.forEach((attachment) => {
            doc.fontSize(14).text(`Attachment Id: ${attachment.attachid}`);
            doc.fontSize(14).text(`Task Id: ${attachment.taskid}`);
            doc.fontSize(14).text(`File Name: ${attachment.filename}`);
            doc.fontSize(14).text(`File Location: ${attachment.fileloc}`);
            
            doc.moveDown();
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
module.exports = attachmentController