document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("abort").addEventListener("click",function(){
        let result=confirm('Are you sure to abort the referrer?');
        if(result==true) window.location.href = `./index.html`;
    });
    document.getElementById("submit").addEventListener("click",function(){
        
        let request={};
        
        request[`leadership`]=$(`#leadership`)[0].value;
        request[`profession`]=$(`#profession`)[0].value;
        request[`cooperation`]=$(`#cooperation`)[0].value;
        request[`oral_skill`]=$(`#oral_skill`)[0].value;
        request[`writing_skill`]=$(`#writing_skill`)[0].value;
        request[`comment`]=$(`#comment`)[0].value;

        request=JSON.stringify(request);
        
        //Seems like ERROR
        $.ajax({
            url: '/referrer/submit',
            type: 'POST',
            data: request,
            error: function(xhr) {
                alert('Error,Please try again later');
            },
            success: function(response) {
                window.location.href = `./finish.html`;
            }
        });
        
    });
});