
var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";

$(function(){
    var url = null;
    var share = GetQueryString('share');
    var from=GetQueryString('from');
    if(window.localStorage.sessionId&&GetQueryString('patientUuid')!=="null"&&GetQueryString('patientUuid')){
        url = "Relation/Article/"+GetQueryString("uuid")+"?sessionId="+window.localStorage.sessionId+"&patientUuid="+GetQueryString('patientUuid');
    }else {
        url = "Platform/Article/"+GetQueryString('uuid');
    }
    getArticle(url);

    $("#back").swipe({
        tap:function(e){
            if(from=="family"){
                window.location.href="../html/newFamily.html";
            }else if(from=="familyInfo"){
                window.location.href="../html/familyInfo.html?patientUuid="+GetQueryString("patientUuid");
            }else{
                window.location.href="../index.html";
            }
            e.preventDefault();
        }
    });
});


function getArticle(url){
    $.ajax({
        type: "GET",
        url: ajaxUrl+url,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            if(data.code == 0){
                $("#topTitle").html(data.data.title);
                $("title").html(data.data.title);
                var $psgTitle=$('<h3 class="f34 mb20" id="artTitle">'+data.data.title+'</h3>');
                var $psgTag=$('<ul class="ill-tag cbo" id="psg-tag"></ul>');
                $("#psg-main").append($psgTitle);
                $("#psg-main").append($psgTag);
                if(data.data.nameSet.length){
                    $("#psg-tag").html("");
                    var $li;
                    for(var i=0;i<data.data.nameSet.length;i++){
                        $li=$('<li class="tag-gray">'+data.data.nameSet[i]+'</li>');
                    }
                    $("#psg-tag").append($li);
                }else{
                    $("#psg-tag").remove();
                }
                var $psgContent=$('<div class="article-content">'+
                '<div id="psg-content" class="f28">'+data.data.content+'</div></div>');
                $("#psg-main").append($psgContent);
                setTimeout(function(){
                    var scroll = new IScroll('#scroll-article', { probeType: 3, mouseWheel: true });
                },500);
            }

        },
        error:function(res){
            if(res.status == 401){
                myalert.tips({
                    txt:"会话超时，请重新登录",
                    fnok:function(){
                        window.location = "../html/newLogin.html";
                    },
                    btn:1
                });

            }
        }
    }).success(function(){
        $("html").append('<script src="../js/share.js"></script>');
    })
}
