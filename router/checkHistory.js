const express=require('express')
const router=express.Router()

router.use(express.static("./public/checkHistory"))

module.exports=router