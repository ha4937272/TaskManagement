const Pserial = require('../../models/pserial')
function pserialController() {
return {
    async index(req,res) {
        const pserials = await Pserial.find()
        res.render('pserialdisplay',{pserials:pserials})
    },


    
     addpserial(req,res) {
        res.render('addpserial')
    },


    
    async addpserialrec(req,res) {
        const {pid} = req.body
        
        const pserial1 = new Pserial({
            pid:pid,
        })
        await pserial1.save().then(result => {
             //req.flash('success','Vendor added successfully')
             return res.redirect('/pserial')
        }).catch(err => {
            //req.flash('error','Something went wrong')
            //console.log(err)
            return res.redirect('/pserial/add')
        })
        
    },
    
}
}
module.exports = pserialController