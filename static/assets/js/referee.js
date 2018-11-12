let request=`
[
	{ 
		"institute":{
            		"name": "ncku",
            		"mail": "ncku@ncku.mail.com"    
                },    
		"referrers": [
			{
				"name": "hello",
				"title": "pro",
				"phone": "123456",
				"mail": "123@mail",
				"state": true
			}
		]
    }
]
`

let Referee={
    institute:[],
    selected:{
        name:'',
        mail:''
    }
};

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

const Config={
    maxReferrer:1,
    maxDepartment:3,
    category:[
        'name',
        'title',
        'phone',
        'mail',
    ]
};

document.addEventListener('DOMContentLoaded',function(){

    request=JSON.parse(request);
    //Add requested item to Referee(object collection)
    for(index in request){
        console.log(request[index]);
        addDepartment(request[index][`institute`],request[index][`referrers`]);
    }
    appendLogout();
    appendReferral();

    //parse and append each of the department to page
    for(index in Referee.institute){
        appendDepartment(Referee.institute[index]);
    }

    for(let i=1;i<=Config.maxReferrer;i++){
        document.getElementById(`referrer${i}-save`).addEventListener("click",function(){
            appendSave();
        });
        document.getElementById(`referrer${i}-send`).addEventListener("click",function(){
            appendSend();
        });
    }
    appendSubmit();

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
function appendDepartment(department){

    console.log(department);
    let appendDiv=document.createElement("div");
    appendDiv.innerHTML=department.name;
    appendDiv.setAttribute(`id`,department.name);

    appendDiv.addEventListener('click',function(){

        document.getElementById("school-name").innerHTML=department.name;
        document.getElementById("school-mail").innerHTML=department.mail;
        Referee.selected.name=department.name;
        Referee.selected.mail=department.mail;
        
        fillReferrerField(department);
        //setFieldEditable(department,newSchool.schoolName);
    });
    document.getElementById("department-bar").appendChild(appendDiv);
    document.getElementById("school-name").innerHTML=department.name;
    document.getElementById("school-mail").innerHTML=department.mail;
}
function appendSave(button,department){
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
function appendSend(){

}
function appendSubmit(){

}
function fillReferrerField(department){
    let editable=true;
    console.log(department);
    for(let i=1;i<=Config.maxReferrer;i++){
        for(let item in Config.category){
            $(`referrer${i}-${Config[`category`][item]}`)[0];

            //item in department
            let data=department[`referrers`][i-1][Config[`category`][item]];
            console.log(data);
            if(data!=''){
                $(`#referrer${i}-${Config[`category`][item]}`)[0].value=data;
                editable=false;
            }
        }
    }

}
//Add and render department to page
function addDepartment(institute,referrers){

    let department={
        name:institute.name,
        mail:institute.mail,
        referrers:referrers
    }
    console.log(department);
    Referee.institute.push(department);
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
    $.ajax({
        url: 'id_validate.php',
        type: 'GET',
        data: {
            user_name: $('#user_name').val()
        },
        error: function(xhr) {
            alert('Ajax request 發生錯誤');
        },
        success: function(response) {
        }
    });
}