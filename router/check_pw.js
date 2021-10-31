const {book}=require('../user/user')
const tempData=require('../tempData')
const express=require('express')
const router=express.Router()

router.use(express.urlencoded({extended:false}))
router.post('/',(req,res)=>{
    let verify=book.find((book)=>req.body.token===book.token)
    if(verify){
        res.status(200)
        res.send('good')
        tempData.whoSend=verify.user
    }else{
        res.status(404)
        res.send('bad')
    }
})

module.exports=router
