let department=[
    'ncku_csie',
    'ncku_ee',
];

document.addEventListener('DOMContentLoaded',function(){

    department=parseData(department);
    addDepartment(department);
    saveReferee(department);
})
function parseData(department){
    let x={};
    for(item in department){
        console.log(department[item]);
        x[department[item]]={};
        x[department[item]].referer1={name:'',title:'',phone:'',mail:'',editable:true};
        x[department[item]].referer2={name:'',title:'',phone:'',mail:'',editable:true};
        x[department[item]].referer3={name:'',title:'',phone:'',mail:'',editable:true};
        x[department[item]].referer4={name:'',title:'',phone:'',mail:'',editable:true};
    }
    delete department;
    return x;
}

function addDepartment(department){

    for(item in department){
        let div=document.createElement("div");
        div.innerHTML=`${item}`;
        div.addEventListener('click',function(){
            document.getElementById("school-name").innerHTML=`${div.innerHTML}`;
            department.currentSchool=`${div.innerHTML}`;
        });
        document.getElementById("department-bar").appendChild(div);
        document.getElementById("school-name").innerHTML=`${div.innerHTML}`;
    }

}
function saveReferee(department){
    for(let i=1;i<=4;i++){
        document.getElementById(`referer${i}`).addEventListener('click',function(){
            confirmSave(`referer${i}`,department);
        });
    }
}
function confirmSave(button,department){
    if (confirm(`Once you saved, you can not chnage data`)) {
        if(editable===true){
            let name=document.getElementById(`${button}-name`).innerHTML;
            let title=document.getElementById(`${button}-title`).innerHTML;
            let phone=document.getElementById(`${button}-phone`).innerHTML;
            let mail=document.getElementById(`${button}-mail`).innerHTML;
            document.getElementById(`${button}-name`).disabled=true;
            document.getElementById(`${button}-title`).disabled=true;
            document.getElementById(`${button}-phone`).disabled=true;
            document.getElementById(`${button}-mail`).disabled=true;
            document.getElementById(`${button}`).disabled=true;
    
            let currentSchool=document.getElementById("school-name").innerHTML;
            console.log(currentSchool);
            department[currentSchool][`${button}`][`name`]=name;
            department[currentSchool][`${button}`][`title`]=title;
            department[currentSchool][`${button}`][`phone`]=phone;
            department[currentSchool][`${button}`][`mail`]=mail;
            department[currentSchool][`${button}`][`editable`]=false;
        }
        else {
            alert('already save!')
        }
    } else {
        // Do nothing!
    }
}