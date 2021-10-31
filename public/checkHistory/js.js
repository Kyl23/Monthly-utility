var now_user=""
var array
var total_cash=0
const xhr=new XMLHttpRequest()

window.onload=()=>{
    xhr.open('Get','/checkPay/getHistoryDate')
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.send()
    xhr.onload=()=>{
        let arr=xhr.responseText
        arr=JSON.parse(arr)
        let title=document.getElementById('title')
        for(let i=0;i<arr.length;i++){
            let input=document.createElement('input')
            input.type="button"
            input.value=arr[i]
            input.onclick=()=>{sendDataAndStatus(arr[i])}
            title.appendChild(input)
        }
        console.log(arr)
        
    }
}

function sendDataAndStatus(data){
    let container=document.querySelector('#container')
    container.style.display="block"
    let title=document.createElement('label')
    title.textContent="Key your token for check payment"
    let passwords=document.createElement('input')
    passwords.type="password"
    passwords.autofocus="autofocus"
    let cfm=document.createElement('input')
    cfm.type="button"
    cfm.value="確認"
    passwords.onchange=()=>{
        pw=passwords.value
        cfm.click=SendAndCloseInput(pw,data)
    }
    container.appendChild(title)
    container.appendChild(passwords)
    container.appendChild(cfm)
}
function SendAndCloseInput(pw,data){
    xhr.open('POST','/checkPay/VerifyHistory')
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.send(`token=${pw}&data=${data}`)
    xhr.onload=()=>{
        if(xhr.status===200){
            array=JSON.parse(xhr.responseText)
            now_user=array[0]
            let body=document.querySelector('body')
            body.innerHTML=`<div>歡迎${array[0]}</div>`
            let table=document.createElement('table')
            let u=document.createElement('u')
            u.textContent=`這是${data}此月份的記錄`
            body.appendChild(u)
            table.appendChild(buildList('編號','編輯者','日期','付款人','使用者','名稱','價格','個人所付款項',0))
            for(let i=1;i<array.length;i++){
                let pay_array=0
                let num_person=0
                let pay=0
                let bool=0
                let paid=array[i][8].split(',')
                let user=array[i][3].split(',')
                let ver=-1
                let check_person_need_pay=-1
                for(let j=0;j<user.length;j++){
                    if(user[j]===array[0])
                        check_person_need_pay=1
                }
                for(let j=0;j<paid.length;j++){
                    if(paid[j]===array[i][2]){
                        ver=1
                    }
                    if(paid[j]==='all'){
                        bool=4//all paid
                        break
                    }
                    else if(paid[j]!='all'&&array[i][2]===array[0]){
                        bool=3//payer
                        break
                    }else if(paid[j]===array[0]){
                        bool=0
                        break
                    }
                    else
                        bool=1
                }
                console.log(check_person_need_pay)
                if((bool && ver!=-1)||(bool===4&&check_person_need_pay==1)){
                    pay_array=array[i][5].split(',')
                    num_person=array[i][3].split(',').length
                    for(let j=0;j<pay_array.length;j++)
                        pay+=Number(pay_array[j])
                    pay/=num_person
                    total_cash+=pay
                }
                table.appendChild(buildList(i,array[i][0],array[i][1],array[i][2],array[i][3],array[i][4],array[i][5],pay.toFixed(2),bool))
            }
            body.appendChild(table)
            let label=document.createElement('label')
            label.textContent=`此月份共花費了（個人）$${total_cash.toFixed(2)}`
            body.appendChild(label)
        }else if(xhr.status===404){
            alert('你想幹嘛，密碼不對也想過關？')
            document.location="/"
        }
    }
    let container=document.querySelector("#container")
    container.innerHTML=""
    container.style.display="none"
}

function buildList(p1,p2,p3,p4,p5,p6,p7,p8,bool){
    let tr=document.createElement('tr')
    let td1=document.createElement('td')
    let td2=document.createElement('td')
    let td3=document.createElement('td')
    let td4=document.createElement('td')
    let td5=document.createElement('td')
    let td6=document.createElement('td')
    let td7=document.createElement('td')
    let td8=document.createElement('td')
    td1.textContent=p1
    td2.textContent=p2
    td3.textContent=p3
    td4.textContent=p4
    td5.textContent=p5
    td6.textContent=p6
    td7.textContent=p7
    td8.textContent=p8
    if(bool===1){
        td8.style.background='red'
        td8.id=`t${p1}`
        td8.onclick=()=>{pay(p1)}
    }else if(bool===3){
        td8.style.background='red'
        td8.id=`t${p1}`
        td8.textContent="all pay or check status"
        td8.onclick=()=>{
            if(confirm('Are them paid all? 確定：已全數付款 / 取消:查看狀態')){
                payAll(p1,1)
            }else{
                payAll(p1,0)
            }
        }
    }
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    tr.appendChild(td6)
    tr.appendChild(td7)
    tr.appendChild(td8)
    return tr
}
function payAll(p1,num){
    if(num){
        if(confirm('確認已付款？')){
            array[p1][8]="all"
            array[p1][6]="true"
            const xhr=new XMLHttpRequest()
            xhr.open('POST','/checkPay/renewStatus')
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
            let string=""
            for(let i=0;i<array[p1].length;i++){
                string+=`${array[p1][i]};`
            }
            xhr.send(`data=${string}`)
            xhr.onload=()=>{
                if(xhr.status===200){
                    alert('success')
                    document.getElementById(`t${p1}`).style.background="none"
                    document.getElementById(`t${p1}`).onclick="()={}"
                }else{
                    alert('error try again')
                    document.location('/')
                }
            }
        }
    }else{
        if(array[p1][8]==""){
            alert('還未有人付款')
        }
        else
            alert(`已付款人數：${array[p1][8]}`)
    }
}
function pay(p1){
    if(confirm('確認已付款？')){
        array[p1][8]+=`${now_user},`
        let b=array[p1][8]
        b+=array[p1][2]
        let paid=array[p1][8].split(',')
        let ver=-1
        for(let i=0;i<paid.length;i++){
            if(paid[i]===array[p1][2])
                ver=1
        }
        if(ver===1 && b.split(",").length-1===array[p1][3].split(',').length){
            array[p1][8]='all'
        }else if(ver===-1 && b.split(",").length===array[p1][3].split(',').length){
            array[p1][8]="all"
        }
        array[p1][6]="true"
        const xhr=new XMLHttpRequest()
        xhr.open('POST','/checkPay/renewStatus')
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
        let string=""
        for(let i=0;i<array[p1].length;i++){
            string+=`${array[p1][i]};`
        }
        xhr.send(`data=${string}`)
        xhr.onload=()=>{
            if(xhr.status===200){
                alert('success')
                document.getElementById(`t${p1}`).style.background="none"
                document.getElementById(`t${p1}`).onclick="()={}"
            }else{
                alert('error try again')
                document.location('/')
            }
        }
    }
}