const SUser = require('../../models/suser')
function suserController() {
return {
    async index(req,res) {
        const susers = await SUser.find()
        res.render('suserdisplay',{susers:susers})
    },


    
     addsuser(req,res) {
        res.render('addsuser')
    },


    
    async addsuserrec(req,res) {
        const {suid} = req.body
        
        const suser1 = new SUser({
            suid:suid,
        })
        await suser1.save().then(result => {
             //req.flash('success','Vendor added successfully')
             return res.redirect('/suser')
        }).catch(err => {
            //req.flash('error','Something went wrong')
            //console.log(err)
            return res.redirect('/suser/add')
        })
        
    },
    
}
}
module.exports = suserController