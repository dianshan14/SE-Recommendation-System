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
            appendSave(i);
        });
        document.getElementById(`referrer${i}-send`).addEventListener("click",function(){
            appendSend(i);
        });
    }
    document.getElementById(`submit`).addEventListener("click",function(){
        appendSubmit();
    });


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
        let response={
            institute:{
                name:``,
                mail:``,
            },
            referrers:[
                {
                    name:'',
                    title:'',
                    phone:'',
                    mail:'',
                    state:false
                }
            ],
        };
        response.institute.name=prompt(`Add the school that you want to refer`);
        response.institute.mail=prompt(`Add the school's mail`);
        if((response.institute.name!=null&&response.institute.name!=``)&&
            (response.institute.mail!=null&&response.institute.mail!=``)){
            let department=addDepartment(response.institute,response.referrers);
            appendDepartment(department);
        }
        else alert('Name and Mail must not be empty!');
    });
}
function appendDepartment(department){

    let appendDiv=document.createElement("div");
    appendDiv.innerHTML=department.name;
    appendDiv.setAttribute(`id`,department.name);

    appendDiv.addEventListener('click',function(){

        document.getElementById("school-name").innerHTML=department.name;
        document.getElementById("school-mail").innerHTML=department.mail;
        Referee.selected.name=department.name;
        Referee.selected.mail=department.mail;

        fillReferrerField(department);
    });
    document.getElementById("department-bar").appendChild(appendDiv);
    document.getElementById("school-name").innerHTML=department.name;
    document.getElementById("school-mail").innerHTML=department.mail;
}
function appendSave(i){

    if(confirm(`Once you saved, you can not chnage data`)) {
        for(index in Referee.institute){
            if(Referee[`institute`][index][`name`]==Referee.selected.name)
            {
                let x={};
                for(item in Config.category)
                    x[Config[`category`][item]]=$(`#referrer${i}-${[Config[`category`][item]]}`)[0].value;
                console.log(x);

                Referee[`institute`][index][`referrers`][i-1]=x;

                let request={
                    institute_name: Referee[`institute`][index][`name`],
                    institute_mail: Referee[`institute`][index][`mail`],
                    referrers:Referee[`institute`][index][`referrers`],
                }
                console.log(request);

                $.ajax({
                    url: '/referee/save',
                    type: 'POST',
                    data: JSON.stringify(request),
                    error: function(xhr) {
                        alert('Ajax request 發生錯誤');
                    },
                    success: function(response) {
                        alert('Success');
                    }
                });

                fillReferrerField(Referee[`institute`][index]);
            }
        }
    }
}
function appendSend(i){

    let request={
        index:i,
        institute:Referee.selected.name
    };

    $.ajax({
        url: '/referee/send',
        type: 'POST',
        data: JSON.stringify(request),
        error: function(xhr) {
            alert('Ajax request 發生錯誤');
        },
        success: function(response) {
            alert('Success');
        }
    });

}
function appendSubmit(){
    let request={
        institute:Referee.selected.name
    }

    $.ajax({
        url: '/referee/submit',
        type: 'POST',
        data: JSON.stringify(request),
        error: function(xhr) {
            alert('Ajax request 發生錯誤');
        },
        success: function(response) {
            alert('Success');
        }
    });

}
function fillReferrerField(department){
    let editable;
    console.log(department);
    for(let i=1;i<=Config.maxReferrer;i++){
        for(let item in Config.category){

            //item in department
            let data=department[`referrers`][i-1][Config[`category`][item]];
            if(data!=''){
                $(`#referrer${i}-${Config[`category`][item]}`)[0].value=data;
                editable=false;
            }
        }
        if(editable==false){
            for(let item in Config.category){
                $(`#referrer${i}-${Config[`category`][item]}`)[0].disabled=true;
                $(`#referrer${i}-save`)[0].disabled=true;
            }
            if(department[`referrers`][i-1][`state`]==true){
                $(`#referrer${i}-send`)[0].disabled=true;
                $(`#referrer${i}-state`)[0].innerText='Success';
            }
            else{
                $(`#referrer${i}-send`)[0].disabled=false;
                $(`#referrer${i}-state`)[0].innerText='';
            }
        }
        else{
            for(let item in Config.category){
                $(`#referrer${i}-${Config[`category`][item]}`)[0].disabled=false;
                $(`#referrer${i}-save`)[0].disabled=false;
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
    Referee.institute.push(department);
    return department;
}
