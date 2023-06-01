const User = require('../../models/user')
const Suser = require('../../models/suser')
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
function userController() {
return {
    async index(req,res) {
        const users = await User.find()
        res.render('userdisplay',{users:users})
    },


    
    adduser(req, res) {
        Suser.findOne({}, (err, suser) => {
          if (err) {
            //console.log(err);
            return res.redirect('/user/add');
          }
          const nextUserId = suser.suid + 1;
          res.render('adduser', { nextUserId });
        });
      },
      

      async adduserrec(req, res) {
        const { fname, lname, email, password } = req.body;
      
        // Update the suid in the suser collection
        const suser = await Suser.findOne({});
        suser.suid += 1;
        await suser.save();
      
        const user1 = new User({
          userid: suser.suid,
          fname: fname,
          lname: lname,
          email: email,
          password: password,
        });
      
        await user1
          .save()
          .then((result) => {
            return res.redirect('/user');
          })
          .catch((err) => {
            //console.log(err);
            return res.redirect('/user/add');
          });
      },
      
      async edituser(req, res) {
        const userId = req.params.id;
        const user = await User.findOne({ userid: userId });
      
        if (!user) {
          return res.redirect('/user');
        }
      
        res.render('edituser', { user });
      },

      
      async edituserrec(req, res) {
        const userId = req.params.id;
        const { fname, lname, email, password } = req.body;
      
        try {
          const user = await User.findOne({ userid: userId });
          if (!user) {
            return res.redirect('/user');
          }
      
          user.fname = fname;
          user.lname = lname;
          user.email = email;
          user.password = password;
      
          await user.save();
      
          return res.redirect('/user');
        } catch (error) {
          //console.log(error);
          return res.redirect('/user');
        }
      },
      
      async userdownload(req,res) {
        try {


          // Fetch data for the Excel file
          const users = await User.find();
      
          // Create a new workbook and worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Users');
      
          // Define the column headers
          worksheet.columns = [
            { header: 'User Id', key: 'userid' },
            { header: 'First Name', key: 'fname' },
            { header: 'Last Name', key: 'lname' },
            { header: 'Start Date', key: 'sdate' },
            { header: 'Email', key: 'email' },
            { header: 'Password', key: 'password' },
          ];
      
          // Populate the worksheet with data
          users.forEach((user) => {
            worksheet.addRow(user.toObject());
          });
      
          // Set the response headers for downloading the Excel file
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
      
          // Stream the Excel file to the response
          await workbook.xlsx.write(res);
          res.end();
        } catch (error) {
          //console.error('Error generating Excel file:', error);
          res.status(500).send('Internal Server Error');
        }
      },
      

      async userpdf(req,res) {
        try {
          // Fetch data for the PDF
          const users = await User.find();
      
          // Create a new PDF document
          const doc = new PDFDocument();
      
          // Set the response headers for downloading the PDF file
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
      
          // Stream the PDF content to the response
          doc.pipe(res);
      
          // Add content to the PDF document
          doc.fontSize(18).text('Users', { align: 'center' });
          doc.moveDown();
      
          users.forEach((user) => {
            doc.fontSize(14).text(`User Id: ${user.userid}`);
            doc.fontSize(14).text(`First Name: ${user.fname}`);
            doc.fontSize(14).text(`Last Name: ${user.lname}`);
            doc.fontSize(14).text(`Email: ${user.email}`);
            doc.fontSize(14).text(`Password: ${user.password}`);
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
module.exports = userController