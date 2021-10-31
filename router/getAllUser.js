const express=require('express')
const router=express.Router()
const {book}=require('../user/user.json')

router.get('/',(req,res)=>{
    let tempUser=[]
    for(let i in book){
        tempUser.push(book[i].user)
    }
    res.send(tempUser)
})

module.exports=router