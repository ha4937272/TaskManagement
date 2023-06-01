const Project = require('../../models/project')
const Pserial = require('../../models/pserial')
const moment = require('moment');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
function projectController() {
return {
    async index(req,res) {
        const projects = await Project.find()
        res.render('projectdisplay',{projects:projects,moment:moment})
    },


    
    addproject(req, res) {
        Pserial.findOne({}, (err, pserial1) => {
          if (err) {
            //console.log(err);
            return res.redirect('/project/add');
          }
          const nextProjectId = pserial1.pid + 1;
          res.render('addproject', { nextProjectId });
        });
      },
      

      async addprojectrec(req, res) {
        const { projname, desc, sdate, enddate,status } = req.body;
      
        // Update the suid in the suser collection
        const pserial = await Pserial.findOne({});
        pserial.pid += 1;
        await pserial.save();
      
        const project1 = new Project({
          projid: pserial.pid,
          projname: projname,
          desc: desc,
          sdate: sdate,
          enddate: enddate,
          status:status
        });
      
        await project1
          .save()
          .then((result) => {
            return res.redirect('/project');
          })
          .catch((err) => {
            //console.log(err);
            return res.redirect('/project/add');
          });
      },

      async editproject(req, res) {
        const projectId = req.params.id;
        const project = await Project.findOne({ projid: projectId });
      
        if (!project) {
          return res.redirect('/project');
        }
      
        res.render('editproject', { project });
      },

      
      async editprojectrec(req, res) {
        const projectId = req.params.id;
        const { projname, desc, sdate, enddate,status } = req.body;
      
        try {
          const project = await Project.findOne({ projid: projectId });
          if (!project) {
            return res.redirect('/project');
          }
      
          project.projname = projname;
          project.desc = desc;
          project.sdate = sdate;
          project.enddate = enddate;
          project.status = status;
      
          await project.save();
      
          return res.redirect('/project');
        } catch (error) {
          //console.log(error);
          return res.redirect('/project');
        }
      },

      async projectdownload(req,res) {
        try {


          // Fetch data for the Excel file
          const projects = await Project.find();
      
          // Create a new workbook and worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Projects');
      
          // Define the column headers
          worksheet.columns = [
            { header: 'Project Id', key: 'projid' },
            { header: 'Project Name', key: 'projname' },
            { header: 'Description', key: 'desc' },
            { header: 'Start Date', key: 'sdate' },
            { header: 'End Date', key: 'enddate' },
            { header: 'Status', key: 'status' },
          ];
      
          // Populate the worksheet with data
          projects.forEach((project) => {
            worksheet.addRow(project.toObject());
          });
      
          // Set the response headers for downloading the Excel file
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=projects.xlsx');
      
          // Stream the Excel file to the response
          await workbook.xlsx.write(res);
          res.end();
        } catch (error) {
          //console.error('Error generating Excel file:', error);
          res.status(500).send('Internal Server Error');
        }
      },
      

      async projectpdf(req,res) {
        try {
          // Fetch data for the PDF
          const projects = await Project.find();
      
          // Create a new PDF document
          const doc = new PDFDocument();
      
          // Set the response headers for downloading the PDF file
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=projects.pdf');
      
          // Stream the PDF content to the response
          doc.pipe(res);
      
          // Add content to the PDF document
          doc.fontSize(18).text('Projects', { align: 'center' });
          doc.moveDown();
      
          projects.forEach((project) => {
            doc.fontSize(14).text(`Project Id: ${project.projid}`);
            doc.fontSize(14).text(`Project Name: ${project.projname}`);
            doc.fontSize(14).text(`Description: ${project.desc}`);
            doc.fontSize(14).text(`Start Date: ${project.sdate}`);
            doc.fontSize(14).text(`End Date: ${project.enddate}`);
            doc.fontSize(14).text(`Status: ${project.status}`);
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
module.exports = projectController