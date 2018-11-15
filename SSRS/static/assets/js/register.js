document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("abort").addEventListener("click",function(){
        let result=confirm('Are you sure to abort the referrer?');
        if(result==true) window.location.href = `/auth/login`;
    })
});
