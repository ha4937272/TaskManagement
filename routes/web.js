const homeController = require('../app/http/controllers/homeController');
const userController = require('../app/http/controllers/userController');
const taskController = require('../app/http/controllers/taskController');
const tasktranController = require('../app/http/controllers/tasktranController');
const projectController = require('../app/http/controllers/projectController');
const commentController = require('../app/http/controllers/commentController');
const attachmentController = require('../app/http/controllers/attachmentController');
const suserController = require('../app/http/controllers/suserController');
const pserialController = require('../app/http/controllers/pserialController');
const commsrController = require('../app/http/controllers/commsrController');
const attsrController = require('../app/http/controllers/attsrController');


//const authController = require('../app/http/controllers/authController');


//middlewares
//const staffguest = require('../app/http/middlewares/staffguest');
function initRoutes(app)
{

  //Home Page
    app.get('/',homeController().index)
    //staff login and register

    //app.get('/login',authController().login)
    //app.post('/login',staffController().postStaffLogin)
    //app.get('/register',authController().register) 
    //app.post('/staffregister',staffController().postStaffRegister) 
    //app.post('/stafflogout',staffController().stafflogout)
    

    //User Controller
    app.get('/user',userController().index) 
    app.get('/user/add',userController().adduser)
    app.post('/user/add',userController().adduserrec)
    app.get('/user/edit/:id', userController().edituser)
    app.post('/user/edit/:id', userController().edituserrec);
    app.get('/user/download', userController().userdownload);//Downloading user table as excel
    app.get('/user/pdf',      userController().userpdf);//Downloading user table as excel
    

    
    //Project Controller
    app.get('/project',projectController().index) 
    app.get('/project/add',projectController().addproject)
    app.post('/project/add',projectController().addprojectrec)
    app.get('/project/edit/:id', projectController().editproject)
    app.post('/project/edit/:id', projectController().editprojectrec);
    app.get('/project/download', projectController().projectdownload);//Downloading project table as excel
    app.get('/project/pdf', projectController().projectpdf);//Downloading project table as excel

    //Task Controller
    app.get('/task',taskController().index) 
    app.get('/task/add',taskController().addtask)
    app.post('/task/add',taskController().addtaskrec)
    app.get('/task/edit/:id', taskController().edittask)
    app.post('/task/edit/:id', taskController().edittaskrec);
    app.get('/task/download', taskController().taskdownload);//Downloading project table as excel
    app.get('/task/pdf',      taskController().taskpdf);//Downloading project table as excel


     //Task Transaction Controller
     app.get('/tasktran',tasktranController().index) 
     app.get('/tasktran/add',tasktranController().addtasktran)
     app.post('/tasktran/add',tasktranController().addtasktranrec)
     app.get('/tasktran/edit/:id', tasktranController().edittasktran)
     app.post('/tasktran/edit/:id', tasktranController().edittasktranrec);
     app.get('/tasktran/download', tasktranController().tasktrandownload);//Downloading tasktran table as excel
     app.get('/tasktran/pdf',      tasktranController().tasktranpdf);//Downloading tasktran table as excel

    //Comment Controller
    app.get('/comment',commentController().index) 
    app.get('/comment/add',commentController().addcomment)
    app.post('/comment/add',commentController().addcommentrec)
    app.get('/comment/edit/:id', commentController().editcomment)
    app.post('/comment/edit/:id', commentController().editcommentrec);
    app.get('/comment/download', commentController().commentdownload);//Downloading comment table as excel
    app.get('/comment/pdf',      commentController().commentpdf);//Downloading comment table as excel

    //Attachment Controller
    app.get('/attachment',attachmentController().index) 
    app.get('/attachment/add',attachmentController().addattachment)
    app.post('/attachment/add',attachmentController().addattachmentrec)
    app.get('/attachment/edit/:id', attachmentController().editattachment)
    app.post('/attachment/edit/:id', attachmentController().editattachmentrec);
    app.get('/attachment/download', attachmentController().attachmentdownload);//Downloading attachment table as excel
    app.get('/attachment/pdf',      attachmentController().attachmentpdf);//Downloading attachment table as excel


    //Suser Controller
    app.get('/suser',suserController().index) 
    app.get('/suser/add',suserController().addsuser)
    app.post('/suser/add',suserController().addsuserrec)
    
    //Pserial Controller
    app.get('/pserial',pserialController().index) 
    app.get('/pserial/add',pserialController().addpserial)
    app.post('/pserial/add',pserialController().addpserialrec)

    //Commsr Controller
    app.get('/commsr',commsrController().index) 
    app.get('/commsr/add',commsrController().addcommsr)
    app.post('/commsr/add',commsrController().addcommsrrec)

    //Attsr Controller
    app.get('/attsr',attsrController().index) 
    app.get('/attsr/add',attsrController().addattsr)
    app.post('/attsr/add',attsrController().addattsrrec)


    //Kpi Master Controller
    //app.get('/kpimaster',kpimasterController().index) 
    //app.get('/kpimaster/add',kpimasterController().addkpimaster)
    //app.post('/kpimaster/add',kpimasterController().addkpimasterrec)

    
 

    

}

module.exports = initRoutes