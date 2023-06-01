const Commsr = require('../../models/commsr')
function commsrController() {
return {
    async index(req,res) {
        const commsrs = await Commsr.find()
        res.render('commsrdisplay',{commsrs:commsrs})
    },


    
     addcommsr(req,res) {
        res.render('addcommsr')
    },


    
    async addcommsrrec(req,res) {
        const {cid} = req.body
        
        const commsr1 = new Commsr({
            cid:cid,
        })
        await commsr1.save().then(result => {
             //req.flash('success','Vendor added successfully')
             return res.redirect('/commsr')
        }).catch(err => {
            //req.flash('error','Something went wrong')
            //console.log(err)
            return res.redirect('/commsr/add')
        })
        
    },
    
}
}
module.exports = commsrController