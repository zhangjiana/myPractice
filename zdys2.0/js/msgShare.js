

$(function(){
    if(GetQueryString("uuid")!="null"){
        var uuid=GetQueryString("uuid"),
            from=GetQueryString("from");
        var add=window.location.host+"/html/article01.html?uuid="+uuid;
        $(".msg-share-text").html('我看到一篇文章很合适您：<span id="share-psg-title">'+GetQueryString("title")+'</span>'+
        '<span id="share-psg-address">'+add+'</span>');
        $("#back").swipe({
            tap:function(e){
                if(from=="family"){
                    window.location.href="../html/newFamily.html";
                }else if(from=="familyInfo"){
                    window.location.href="../html/familyInfo.html?patientUuid="+GetQueryString("patientUuid");
                }else if(from=="article01"){
                    window.location.href="../html/article01.html?title=" + GetQueryString("title") + '&uuid=' + GetQueryString("uuid") + '&patientUuid=' + GetQueryString("patientUuid")+'&from=' + GetQueryString("from2");
                }else{
                    window.location.href="../index.html";
                }
                e.preventDefault();
            }
        });
    }else if(GetQueryString("test")){
        var score=GetQueryString("testScore");
        $(".msg-share-text").html('健康自测TA得了'+score+'分,'+GetQueryString("sugg"));
        $("#back").swipe({
            tap:function(){
                history.go(-1);
            }
        })

    }else if(GetQueryString("bannerAdd")){
        $(".msg-share-text").html(GetQueryString("title")+','+GetQueryString("bannerAdd"));
        $("#back").swipe({
            tap:function(){
                history.go(-1);
            }
        })
    }

});
