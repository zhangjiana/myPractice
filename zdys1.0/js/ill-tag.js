/**
 * Created by zJ on 2015/12/8.
 */


$(function(){
    if(window.localStorage.illTag){
        createIllTag(window.localStorage.illTag);
    }else {
        getTag();
    }

    $("#care-ill-footer").swipe({
        tap:function(){
            addTag();
        }
    });

});

var tabId = null;
/*一级标签*/
function  getTag(){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Platform/CategoryTagList",
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){
            //console.log(data);

            if( data.code == 0){
                var data = JSON.stringify(data);
                window.localStorage.illTag = data;
                createIllTag(data);
            }

        }
    })
}

/*二级标签*/
function  getChildTag(){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Platform/ChildTagList",
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        data:"tagId="+tabId+"",
        success: function(data){
            if(data.code == 0){
                var data = JSON.stringify(data);

                createThirdTag(data);

            }
        }
    })
}

function createIllTag(data){
    var data = JSON.parse(data);
    $.each(data.data,function(i){

        var $firstLi = $('<li><em>'+data.data[i].name+'</em></li>');

        $("#first-tag").append($firstLi);

        var $secondTag = $('<ul class="second-tag"></ul>');

        for ( var j = 0 ;j < data.data[i].tagList.length; j++){

            var $secondLi = $('<li><em id='+data.data[i].tagList[j].id+'>'+data.data[i].tagList[j].name+'</em><span>列表</span></li>');

            $secondTag.append($secondLi);
        }
        $secondTag.css("display","none");
        $("#second-tag-box").append($secondTag);
        $("#second-tag-box ul").eq(0).css("display","block");
        $("#first-tag li").eq(0).find("em").addClass('active');
    });
    $("#first-tag li").swipe({
        tap: function (){
            $(this).find("em").addClass('active').parent().siblings().find("em").removeClass('active');

            $("#second-tag-box ul").eq($(this).index()).css("display","block").siblings().css("display","none");                    }
    });

    /*使li 内 超过十个字 即换行*/
    var $aLia = $('.ill-box li em'),
        $Lia = null,
        $Liatext = '',
        aLialen = $aLia.size(),
        i = 0;
    for(i = 0;i < aLialen;i++){
        $Lia = $aLia.eq(i);
        $Liatext = $Lia.html();
        if($Liatext.length > 10){
            $Lia.html($Liatext.slice(0,10)+'<br/>'+$Liatext.slice(10,$Liatext.length));
            $Lia.css('line-height','.34rem')
        }
    }

    //点击列表后显示更多标签
    $('.ill-box').swipe({
        tap: function (e,target) {
            if(target.nodeName == 'SPAN'){

                tabId = e.target.previousSibling.getAttribute('id');
                var textTitle = e.target.previousSibling.innerHTML;


                    e.stopPropagation();
                    getChildTag();

                var $thirdTagTitle = $("#third-tag-title");

                $thirdTagTitle.text(textTitle);

                $('#third-tag-box h1').text("列表");

               $("#choose-this-tag").attr('data-id', tabId);

                $('.ill-more-page').css({'-webkit-transform':'translateX(-100%)','transform':'translateX(-100%)'});
                $('.index-head span').addClass('go-ill-box');


            }
        }
    });


    /*第三级页面，点击选择该类*/
    $("#choose-this-tag").swipe({
        tap: function(){
            var illtag = getIllTag();

             var tabId = $(this).attr('data-id');
            if( illtag.indexOf(parseInt(tabId).toString()) == -1){
                var $getIllTagLi = $('<li id=' + tabId + '>' +$("#third-tag-title").text() + '</li>');
                $("#getIllTag").append($getIllTagLi);
            }
            if($("#getIllTag li").length >= 4){
                $(".illness-base-btn").removeClass('add-tag').addClass('illness-label-btn');
            }
            $("#ill-tag,#third-tag-box").css({'-webkit-transform': 'translateX(0)', 'transform': 'translateX(0)'});
        }
    });

    $(".second-tag em").swipe({
        tap: function () {

            $("#ill-tag").css({'-webkit-transform': 'translateX(0)', 'transform': 'translateX(0)'});
            console.log($(this).text());
            console.log("00" + $(this).attr('id'));
            var theTagId = "00" + $(this).attr('id');

            var illtag = getIllTag();

            if( illtag.indexOf(parseInt(theTagId).toString()) == -1){
                var $getIllTagLi = $('<li id=' + theTagId + '>' + $(this).text() + '</li>');
                $("#getIllTag").append($getIllTagLi);
            }
            if($("#getIllTag li").length >= 4){
                $(".illness-base-btn").removeClass('add-tag').addClass('illness-label-btn');
            }

        }
    });

    /*点击添加标签，跳转到疾病标签页*/
    $(".add-tag").swipe({
        tap:function(){
            console.log("跳到疾病标签页");
           // $('#ill-tag').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
            if($("#getIllTag li").length >= 4){
                $(".illness-base-btn").removeClass('add-tag').addClass('illness-label-btn');
                $("#no-add-notice").text("只能添加四个标签哦");
                return false;
            }

            $("#getIllTag li").removeClass('del-btn');
            $('#ill-tag').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
        }
    });



    $("#del-tag").swipe({
        tap:function(){
            if($("#getIllTag li").hasClass("del-btn")){
                $("#getIllTag li").removeClass('del-btn')
            }else {
                $("#getIllTag li").addClass('del-btn')
            }

        }
    });

/*点击删除标签*/
    $("#getIllTag").swipe({
        tap: function(e,t){
            if($(t).hasClass("del-btn")){
                $(t).remove();
            }
        }
    });

    //返回到疾病标签
    $('#ill-tag-back').swipe({
        tap: function (){
            console.log('aaa');
        }
    }).click(function(){
        if ($(this).hasClass('go-ill-box')) {
            $('#ill-tag h1').text('疾病标签');
            $('.ill-more-page').css({'-webkit-transform': 'translateX(0)', 'transform': 'translateX(0)'});
            $(this).removeClass('go-ill-box');
        } else {
            getIllTag();
            $('#ill-tag').css({'-webkit-transform': 'translateX(0)', 'transform': 'translateX(0)'});
        }
    });
}

//创建三级标签
function createThirdTag(data){

    var $thirdTag = $("#third-tag-content");
    $thirdTag.html(' ');
    data = JSON.parse(data);
    $.each(data.data,function(i){

        var $thirdLi = $('<li>'+data.data[i].name+'</li>');

        $thirdTag.append($thirdLi)
    });

}

/*添加标签*/
function addTag(){
    var tags = getIllTag();

    $.ajax({
        type: "POST",
        url: "http://www.zhaoduiyisheng.com/api/Relation/ModifyTags?sessionId="+window.localStorage.sessionId+"&uuid="+the_patientUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(tags),
        success: function (data) {
            if(data.code == 0){
                console.log(data.message);
                window.location = '../index.html';
            }
        }
    })
}



function getIllTag(){
    var illTag = [];
    for ( var j= 0 ;j< $("#getIllTag li").length; j++){
        illTag.push(parseInt($("#getIllTag li")[j].getAttribute('id')).toString());
    }
    return illTag;
}