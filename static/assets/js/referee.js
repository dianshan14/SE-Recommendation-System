let received_json=[
    {
        schoolName:'ncku_csie',
        schoolMail:'123'
    },
    {
        schoolName:'ncku_ee',
        schoolMail:'123'
    },
];
let department={
    currentSchoolName:'',
    currentSchoolMail:'',
};

let Config={
    maxReferrer:1,
    maxDepartment:3,
    category:[
        'name',
        'title',
        'phone',
        'mail',
    ]
}

let category=[

];

document.addEventListener('DOMContentLoaded',function(){

    appendLogout();
    appendReferral();
    //parse and append each of the department to page
    for(item in received_json){
        addDepartment(department,received_json[item][`schoolName`],received_json[item][`schoolMail`]);
        appendDepartment(received_json[item]);
    }
    department.currentSchoolName=document.getElementById('school-name').innerHTML;
    department.currentSchoolMail=document.getElementById('school-mail').innerHTML;
});

//Append event listener for logout
function appendLogout(){
    document.getElementById("logout").addEventListener("click",function(){
        window.location.href = `./index.html`;
    });
}
//Append event listener for add department
function appendReferral(){
    document.getElementById(`referral`).addEventListener('click',function(){
        let newSchool={schoolName:'',schoolMail:''}
        newSchool.schoolName=prompt(`Add the school that you want to refer`);
        newSchool.schoolMail=prompt(`Add the school's mail`);
        if((newSchool.schoolName!=null&&newSchool.schoolName!=``)&&
            (newSchool.schoolMail!=null&&newSchool.schoolMail!=``)){
            addDepartment(department,newSchool.schoolName,newSchool.schoolMail);
            appendDepartment(newSchool);
        }
        else alert('Name and Mail must not be empty!');
    });
}
function appendDepartment(newSchool){

    let div=document.createElement("div");
    div.innerHTML=`${newSchool.schoolName}`;
    div.setAttribute(`id`,`${newSchool.schoolName}`);

    div.addEventListener('click',function(){

        document.getElementById("school-name").innerHTML=`${newSchool.schoolName}`;
        document.getElementById("school-mail").innerHTML=`${newSchool.schoolMail}`;
        department.currentSchoolName=`${newSchool.schoolName}`;
        department.currentSchoolMail=`${newSchool.schoolMail}`;
        
        setFieldEditable(department,newSchool.schoolName);
    });
    document.getElementById("department-bar").appendChild(div);
    document.getElementById("school-name").innerHTML=newSchool.schoolName;
    document.getElementById("school-mail").innerHTML=newSchool.schoolMail;
}
//Add and render department to page
function addDepartment(department,schoolName,schoolMail){
    //ex: schoolName='123'
    //department[123]={}
    department[`${schoolName}`]={};
    for(let i=1;i<=Config.maxReferrer;i++){
        for(categoryItem in Config.category){
            //department[123][referrer1-mail]=''
            department[`${schoolName}`][`referrer${i}-${Config[`category`][categoryItem]}`]='';
        }
        department[`${schoolName}`][`editable`]=true;
        department[`${schoolName}`][`mail`]=schoolMail;
    }
}
//set referrer field is editable or not
function setFieldEditable(department,schoolName){
    console.log(schoolName);
    console.log(department[schoolName]);
    /*
    for(referrer in department[item]){
        if(department[item][referrer].editable==true){
            console.log(referrer)
            document.getElementById(`${referrer}-name`).disabled=false;
            document.getElementById(`${referrer}-title`).disabled=false;
            document.getElementById(`${referrer}-phone`).disabled=false;
            document.getElementById(`${referrer}-mail`).disabled=false;
            document.getElementById(`${referrer}`).disabled=false;
        }
    }
    */
}

function saveDepartment(department){
}

function saveReferee(department){
}

function confirmSave(button,department){
    let currentSchoolName=document.getElementById("school-name").innerHTML;
    console.log(currentSchoolName,`${button}`)
    if (confirm(`Once you saved, you can not chnage data`)) {
        console.log(department[currentSchoolName][`${button}`])
        if(department[currentSchoolName][`${button}`][`editable`]==true){
            let name=document.getElementById(`${button}-name`).innerHTML;
            let title=document.getElementById(`${button}-title`).innerHTML;
            let phone=document.getElementById(`${button}-phone`).innerHTML;
            let mail=document.getElementById(`${button}-mail`).innerHTML;
            document.getElementById(`${button}-name`).disabled=true;
            document.getElementById(`${button}-title`).disabled=true;
            document.getElementById(`${button}-phone`).disabled=true;
            document.getElementById(`${button}-mail`).disabled=true;
            document.getElementById(`${button}`).disabled=true;
            
            console.log(currentSchoolName);
            department[currentSchoolName][`${button}`][`name`]=name;
            department[currentSchoolName][`${button}`][`title`]=title;
            department[currentSchoolName][`${button}`][`phone`]=phone;
            department[currentSchoolName][`${button}`][`mail`]=mail;
            console.log(department[currentSchoolName][`${button}`])
            department[currentSchoolName][`${button}`][`editable`]=false;
        }
        else {
            alert('already save!')
        }
    } else {
        // Do nothing!
    }
}