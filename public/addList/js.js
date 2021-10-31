var item_num=1
var choosen_person=[]

const xhr=new XMLHttpRequest()
xhr.open('Get','/getAllUser')
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
xhr.send()
xhr.onload=()=>{
    let container3=document.getElementById('container3')
    let container4=document.getElementById('container4')
    let user=document.getElementById('user')
    let temp=xhr.responseText
    temp=temp.substring(2,temp.length-2)
    temp=temp.split("\",\"")
    let option=document.createElement('option')
    option.text='Select One Person'
    option.disabled=true
    option.selected=true
    user.appendChild(option)
    for(let i=0;i<temp.length;i++){
        option=document.createElement('option')
        option.value=temp[i]
        option.text=temp[i]
        user.appendChild(option)
        
        let input=document.createElement('input')            
        input.value=temp[i]
        input.type="button"
        input.className="member"
        input.onclick=()=>push(temp[i])
        container4.appendChild(input)
    
    }
}

window.onload=()=>{
    let now=new Date();
    let date=document.getElementById('date');
    date.value=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
}
function clsContainer2(){
    let ctn2=document.getElementById('container2')
    choosen_person=[]
    ctn2.innerHTML=""
}

function push(user){
    let container2=document.getElementById('container2')
    let verify=-1
    for(let i=0;i<choosen_person.length;i++){
        if(choosen_person[i]===user){
            verify=1
            break
        }
    }
    if(verify!==1){
        container2.innerHTML+=`${user},`
        choosen_person.push(user)
    }
}
function addItems(){
    let container=document.getElementById('container1')
    
    item_num++
    let label1=document.createElement('label')
    let label2=document.createElement('label')
    label1.textContent=`商品${item_num}`
    label2.textContent=`價錢${item_num}`
    let input1=document.createElement('input')
    let input2=document.createElement('input')
    input1.type='text'
    input2.type='text'
    input1.id=`name${item_num}`
    input2.id=`price${item_num}`
    input1.autocomplete="off"
    input2.autocomplete="off"
    input1.placeholder="買了什麼東西"
    input2.placeholder="多少錢"
    input2.type="number"
    container.appendChild(label1)
    container.appendChild(input1)
    container.appendChild(label2)    
    container.appendChild(input2)
}

function sendOrder(){
    const xhr=new XMLHttpRequest()
    xhr.open('Post','/sendOrder')
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    let date=document.getElementById('date')
    let pPerson=document.getElementById('user')
    let array_name=[]
    let array_price=[]
    for(let i=0;i<item_num;i++){
        array_name[i]=document.getElementById(`name${i+1}`).value
        array_price[i]=document.getElementById(`price${i+1}`).value
    }
    xhr.send(`date=${date.value}&pPerson=${pPerson.value}&uPerson=${choosen_person}&item_num=${item_num}&item_price=${array_price}&item_name=${array_name}`)
    xhr.onload=()=>{
        alert(xhr.responseText)
    }
}
function checkUser(){
    let date=document.getElementById('date')
    let user=document.getElementById('user')
    let ctn2=document.getElementById('container2')
    if(date.value!=''&&user.value!='Select One Person'&&ctn2.innerText!=''){
        let tp=confirm('點擊確定後就無法回頭輸入錯密碼將回到首頁')
        if(tp===true){
            let container=document.querySelector('#container')
            container.style.display="block"
            let title=document.createElement('label')
            title.textContent="Key your token"
            let passwords=document.createElement('input')
            passwords.type="password"
            let confirm=document.createElement('input')
            confirm.type="button"
            confirm.value="關閉"
            passwords.onchange=()=>{
                pw=passwords.value
                confirm.click=SendAndCloseInput(pw)
            }
            container.appendChild(title)
            container.appendChild(passwords)
            container.appendChild(confirm)
        }
    }else{
        alert('請至少填寫日期，購買者，以及共用者')
    }
}
function SendAndCloseInput(pw){
    const xhr=new XMLHttpRequest()
    xhr.open('POST','/upload')
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.send("token="+pw)
    xhr.onload=()=>{
        if(xhr.status===200){
            sendOrder()
            alert('success')
            document.location="/"
        }else if(xhr.status===404){
            alert('你想幹嘛，密碼不對也想過關？')
            document.location="/"
        }
    }
    let container=document.querySelector("#container")
    container.innerHTML=""
    container.style.display="none"
}