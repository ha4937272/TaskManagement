const Comment = require('../../models/comment');
const Commsr = require('../../models/commsr');
const Task = require('../../models/task');
const User = require('../../models/user');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment');

function commentController() {
  return {
    async index(req, res) {
      const comments = await Comment.find();
      res.render('commentdisplay', { comments: comments, moment: moment });
    },

    async addcomment(req, res) {
      const users = await User.find();
      const tasksResult = await Task.find();
      const tasks = tasksResult[0].tasks;

      Commsr.findOne({}, (err, commsr1) => {
        if (err) {
          //console.log(err);
          return res.redirect('/comment/add');
        }
        const nextCommentId = commsr1.cid + 1;
        res.render('addcomment', { nextCommentId, users, tasks });
      });
    },

    async addcommentrec(req, res) {
      const { taskid, userid, comment, dt } = req.body;
      const commsr = await Commsr.findOne({});
      commsr.cid += 1;
      await commsr.save();

      const comment1 = new Comment({
        commid: commsr.cid,
        taskid: taskid,
        userid: userid,
        comment: comment,
        dt: dt
      });

      await comment1
        .save()
        .then((result) => {
          return res.redirect('/comment');
        })
        .catch((err) => {
          //console.log(err);
          return res.redirect('/comment/add');
        });
    },

    async editcomment(req, res) {
      const users = await User.find();
      const tasksResult = await Task.find();
      const tasks = tasksResult[0].tasks;
      const commentId = req.params.id;
      const comment = await Comment.findOne({ commid: commentId });

      if (!comment) {
        return res.redirect('/comment');
      }

      res.render('editcomment', { comment, users, tasks ,tasksResult ,moment: moment});
    },

    async editcommentrec(req, res) {
      const commentId = req.params.id;
      const { taskid, userid, comment: updatedComment, dt } = req.body;

      try {
        const comment = await Comment.findOne({ commid: commentId });
        if (!comment) {
          return res.redirect('/comment');
        }

        comment.taskid = taskid;
        comment.userid = userid;
        comment.comment = updatedComment;
        comment.dt = dt;

        await comment.save();

        return res.redirect('/comment');
      } catch (error) {
        //console.log(error);
        return res.redirect('/comment');
      }
    },
    async commentdownload(req,res) {
      try {


        // Fetch data for the Excel file
        const comments = await Comment.find();
    
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Comments');
    
        // Define the column headers
        worksheet.columns = [
          { header: 'Comment Id', key: 'commid' },
          { header: 'Task Id', key: 'taskid' },
          { header: 'User Id', key: 'userid' },
          { header: 'Comment', key: 'comment' },
          { header: 'Date', key: 'dt' },
         
        ];
    
        // Populate the worksheet with data
        comments.forEach((comment) => {
          worksheet.addRow(comment.toObject());
        });
    
        // Set the response headers for downloading the Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=comments.xlsx');
    
        // Stream the Excel file to the response
        await workbook.xlsx.write(res);
        res.end();
      } catch (error) {
        //console.error('Error generating Excel file:', error);
        res.status(500).send('Internal Server Error');
      }
    },
    

    async commentpdf(req,res) {
      try {
        // Fetch data for the PDF
        const comments = await Comment.find();
    
        // Create a new PDF document
        const doc = new PDFDocument();
    
        // Set the response headers for downloading the PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=comments.pdf');
    
        // Stream the PDF content to the response
        doc.pipe(res);
    
        // Add content to the PDF document
        doc.fontSize(18).text('Comments', { align: 'center' });
        doc.moveDown();
    
        comments.forEach((comment) => {
          doc.fontSize(14).text(`Comment Id: ${comment.commid}`);
          doc.fontSize(14).text(`Task Id: ${comment.taskid}`);
          doc.fontSize(14).text(`User Id: ${comment.userid}`);
          doc.fontSize(14).text(`Comment: ${comment.comment}`);
          doc.fontSize(14).text(`Date: ${comment.dt}`);
          doc.moveDown();
        });
    
        // Finalize the PDF document
        doc.end();
      } catch (error) {
        //console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  };
}

module.exports = commentController;
