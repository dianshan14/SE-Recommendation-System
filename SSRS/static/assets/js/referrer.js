document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("abort").addEventListener("click",function(){
        let result=confirm('Are you sure to abort the referrer?');
        if(result==true) window.location.href = `/`;
    });
    document.getElementById("submit").addEventListener("click",function(){

        let request={};

        request[`leadership`]=$(`#leadership:checked`)[0].value;
        request[`profession`]=$(`#profession:checked`)[0].value;
        request[`cooperation`]=$(`#cooperation:checked`)[0].value;
        request[`oral_skill`]=$(`#oral_skill:checked`)[0].value;
        request[`writing_skill`]=$(`#writing_skill:checked`)[0].value;
        request[`comment`]=$(`#comment`)[0].value;

        request=JSON.stringify(request);

		let split=window.location.href.split('/');


        //Seems like ERROR
        $.ajax({
            url: `/referrer/submit/${split[split.length-1]}`,
            type: 'POST',
			contentType: 'application/json',
            data: request,
            error: function(xhr) {
                alert('Error,Please try again later');
            },
            success: function(response) {
				alert('success')
				console.log('finish')
				window.location.href = `/referrer/finish`
            }
        });

    });
});
