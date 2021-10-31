var now_user=""
var array
window.onload=()=>{
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
        cfm.click=SendAndCloseInput(pw)
    }
    container.appendChild(title)
    container.appendChild(passwords)
    container.appendChild(cfm)
}
function SendAndCloseInput(pw){
    const xhr=new XMLHttpRequest()
    xhr.open('POST','/checkPay/Verify')
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.send("token="+pw)
    xhr.onload=()=>{
        if(xhr.status===200){
            array=JSON.parse(xhr.responseText)
            now_user=array[0]
            let body=document.querySelector('body')
            console.log(array)
            let table=document.createElement('table')
            body.innerHTML=`<div>歡迎${array[0]}</div>`
            table.appendChild(buildList('編號','編輯者','日期','付款人','使用者','名稱','價格','需付款項(點擊將付費)',0))
            for(let i=1;i<array.length;i++){
                let pay_array=0
                let num_person=0
                let pay=0
                let bool=0
                let paid=array[i][8].split(',')
                for(let j=0;j<paid.length;j++){
                    if(paid[j]===array[0]){
                        bool=0
                        break
                    }else if(paid[j]==='all'){
                        bool=4
                        break
                    }else{
                        bool=1
                    }
                }
                if(bool&&array[i][2]!=array[0]){
                    pay_array=array[i][5].split(',')
                    num_person=array[i][3].split(',').length
                    for(let j=0;j<pay_array.length;j++)
                        pay+=Number(pay_array[j])
                    pay/=num_person
                }
                if(array[i][2]==array[0]&&bool!=4){
                    bool=3
                }
                table.appendChild(buildList(i,array[i][0],array[i][1],array[i][2],array[i][3],array[i][4],array[i][5],pay,bool))
            }
            body.appendChild(table)
            
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
    }else if(bool===4){
        td8.innerText=`Total ${td7.innerText}`
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
        if(b.split(",").length-1===array[p1][3].split(',').length){
            array[p1][8]='all'
        }
        console.log(b.length,array[p1][3].length)
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