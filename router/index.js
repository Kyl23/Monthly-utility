const express=require('express')
const router=express.Router()

router.use(express.static('./public/index'))

module.exports=router