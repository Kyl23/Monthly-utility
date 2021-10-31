const express=require('express')
const router=express.Router()
const tempData=require('../tempData')
const fs=require('fs')


router.use(express.urlencoded({extended:false}))
router.post('/',(req,res)=>{
    var {date,pPerson,uPerson,item_num,item_price,item_name}=req.body
    uPerson=uPerson.split(",")
    item_price=item_price.split(",")
    item_name=item_name.split(",")
    let temp1=[],temp2=[]
    item_num=0
    for(let i=0;i<item_price.length;i++){
        if(item_price[i]!=''&&item_name[i]!=''){
            item_num++
            temp1.push(item_price[i])
            temp2.push(item_name[i])
        }
    }
    
    item_price=temp1
    item_name=temp2
    
    if(item_num>0){
        let tdate=date.substring(0,date.length-3)
        let verify=-1
        let rtime=fs.readFileSync('./data/time.json','utf-8')
        let {time}=JSON.parse(rtime)
        console.log(time)
        for(let i=0;i<time.length;i++){
            if(time[i]===tdate){
                verify=1
                break
            }
        }
        console.log(time.length)
        if(verify===-1){
            let ttime=[]
            let ver=0
            let touch=0
           for(let i=0;i<time.length;i++){
                if(time[i]>tdate && ver===0){
                  ttime.push(tdate)
                  ver=1
                  ttime.push(time[i])
                  touch=1
                }else{
                    ttime.push(time[i])
                    touch=1
                }
           }
           if(time.length===0||touch===0)
                ttime.push(tdate)
            console.log(ttime)
            fs.writeFileSync('./data/time.json',`{"time":${JSON.stringify(ttime)}}`)
        }
        
        let output=`${tempData.whoSend}\n${date}\n${pPerson}\n${uPerson}\n`
        for(let i=0;i<item_name.length;i++){
           output+=`${item_name[i]}\n${item_price[i]}\n`
        }
        output+=`false\n${Date.now()}\n`
        output+='\n***\n'
        console.log(output)
        fs.writeFile('./data/'+`${tdate}.txt`,output,{flag:'a'},(err)=>{
        })
    }
})


module.exports=router