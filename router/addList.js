const express=require('express')
const router=express.Router()

router.use(express.static("./public/addList"))

module.exports=router