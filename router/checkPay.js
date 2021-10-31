const express=require('express')
const router=express.Router()
const {book}=require('../user/user')
const readline=require('readline')
const fs=require('fs')
const sd=require('silly-datetime')
var ttime=sd.format(new Date(),'YYYY-MM')


router.use(express.urlencoded({extended:false}))
router.use(express.static("./public/checkPay"))

router.post('/Verify',(req,res)=>{
    let verify=book.find((book)=>req.body.token===book.token)
    fs.writeFileSync(`./data/${ttime}.txt`,"",{flag:'a'})
    if(verify){
        res.status(200)
        let tTotal=[]
        let temp=[]
        const fileStream = fs.createReadStream(`./data/${ttime}.txt`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        rl.on('line',(line)=>{
            if(line!='***'){
                temp.push(line)
            }else{
                tTotal.push(temp)
                temp=[]
            }
        })
        rl.on('close',()=>{
            let temp1=[]
            temp1.push(verify.user)
            for(let i=0;i<tTotal.length;i++){
                if(tTotal[i][2]===verify.user){
                    temp1.push(tTotal[i])
                }else {
                    let tem=tTotal[i][3].split(',')
                    for(let j=0;j<tem.length;j++)
                        if(tem[j]===verify.user)
                            temp1.push(tTotal[i])
                }
            }
            res.send(temp1)
        })
    }else{
        res.status(404)
        res.send()
    }
})

router.post('/renewStatus',(req,res)=>{
    let arr=req.body.data.split(';')
    arr.pop()
    let tTotal=[]
    let temp=[]
    let file=arr[1]
    file=file.substring(0,file.length-3)
    const fileStream = fs.createReadStream(`./data/${file}.txt`);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    rl.on('line',(line)=>{
        if(line!='***'){
            temp.push(line)
        }else{
            tTotal.push(temp)
            temp=[]
        }
    })
    rl.on('close',()=>{
        for(let i=0;i<tTotal.length;i++){
            if(tTotal[i][7]===arr[7]){
                tTotal[i]=arr
                break
            }
        }
        let string=""
        for(let i=0;i<tTotal.length;i++){
            let spl=tTotal[i]
            for(let j=0;j<spl.length;j++){
                string+=`${spl[j]}\n`
            }
            string+='***\n'
        }
        fs.writeFileSync(`./data/${file}.txt`,string)
        res.status(200)
        res.send()
    })
})
router.get('/getHistoryDate',(req,res)=>{
    let rtime=fs.readFileSync('./data/time.json','utf-8')
    let {time}=JSON.parse(rtime)
    let temp=[]
    for(let i=0;i<time.length;i++){
        //if(time[i]!=ttime)
            temp.push(time[i])
    }
    res.send(temp)
})
router.post('/VerifyHistory',(req,res)=>{
    let verify=book.find((book)=>req.body.token===book.token)
    if(verify){
        res.status(200)
        let tTotal=[]
        let temp=[]
        const fileStream = fs.createReadStream(`./data/${req.body.data}.txt`);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        rl.on('line',(line)=>{
            if(line!='***'){
                temp.push(line)
            }else{
                tTotal.push(temp)
                temp=[]
            }
        })
        rl.on('close',()=>{
            let temp1=[]
            temp1.push(verify.user)
            for(let i=0;i<tTotal.length;i++){
                if(tTotal[i][2]===verify.user){
                    temp1.push(tTotal[i])
                }else {
                    let tem=tTotal[i][3].split(',')
                    for(let j=0;j<tem.length;j++)
                        if(tem[j]===verify.user)
                            temp1.push(tTotal[i])
                }
            }
            res.send(temp1)
        })
    }else{
        res.status(404)
        res.send()
    }
})

module.exports=router
