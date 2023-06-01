const Attsr = require('../../models/attsr')
function attsrController() {
return {
    async index(req,res) {
        const attsrs = await Attsr.find()
        res.render('attsrdisplay',{attsrs:attsrs})
    },


    
     addattsr(req,res) {
        res.render('addattsr')
    },


    
    async addattsrrec(req,res) {
        const {aid} = req.body
        
        const attsr1 = new Attsr({
            aid:aid,
        })
        await attsr1.save().then(result => {
             //req.flash('success','Vendor added successfully')
             return res.redirect('/attsr')
        }).catch(err => {
            //req.flash('error','Something went wrong')
            //console.log(err)
            return res.redirect('/attsr/add')
        })
        
    },
    
}
}
module.exports = attsrController