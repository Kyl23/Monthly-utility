const express=require('express')
const app=express()
const index=require('./router/index')
const server_upload=require('./router/check_pw')
const addList=require('./router/addList')
const getUserName=require('./router/getAllUser')
const sendOrder=require('./router/sendOrder')
const checkPay=require('./router/checkPay')
const history=require('./router/checkHistory')

app.use('/',index)
app.use('/upload',server_upload)
app.use('/addList',addList)
app.use('/getAllUser',getUserName)
app.use('/sendOrder',sendOrder)
app.use('/checkPay',checkPay)
app.use('/History',history)
app.listen('3000',(req,res)=>{
    console.log('listening on port 3000')
})