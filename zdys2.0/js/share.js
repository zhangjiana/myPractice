

$(function() {
    if(GetQueryString("arr")){
        var score=(arr.length-1)*10;
    }
    var $shareBox = $('<div id="share-window" class="dn alert-wrap share-window tc">' +
    '<img class="love-num" src="http://imgcdn.zhaoduiyisheng.com/img/love_num.png"/><br>' +
    '<a id="btn-share-msg" href="../html/msgShare.html?testScore='+score+'&sugg='+$("#text").text()+'&test='+GetQueryString("test")+'&title=' + GetQueryString("title") + '&uuid=' + GetQueryString("uuid") + '&patientUuid=' + GetQueryString("patientUuid") + '&from=article01&from2='+GetQueryString("from")+'">' +

    '<img class="btn-share-msg" src="http://imgcdn.zhaoduiyisheng.com/img/btn_send_msg.png"/>' +
    '</a>' +
    '<div class="my-info-bot-wrap">' +
    '<div id="nativeShare"></div>' +
    '</div>' +
    '</div>');

    $("body").append($shareBox);
    if(GetQueryString("banner")){
        $("title").text($("header h1").text());
        $("#btn-share-msg").attr("href",'../html/msgShare.html?title='+$("header h1").text()+'&bannerAdd='+window.location);
    }
    if(GetQueryString("arr")){
        $(".btn-share-msg").remove();
    }


    if (GetQueryString('share')) {
        $("#share-window").removeClass("dn");
    }
    $("#psg-detail-share").swipe({
        tap: function () {
            $("#share-window").removeClass("dn");
        }
    });
    $("#testResult-share").swipe({
        tap: function () {
            $("#share-window").removeClass("dn");
        }
    });
    $("#banner-share").swipe({
        tap: function () {
            $("#share-window").removeClass("dn");
        }
    });
    var u = window.navigator.userAgent.toLocaleLowerCase();
    if (u.indexOf("micromessenger") > -1) {
        //是在微信中打开的
        $("#nativeShare").remove();
        $("#btn-cancel-share").remove();
        $("#share-window").prepend('<img class="weixin-share-arrow" src="http://imgcdn.zhaoduiyisheng.com/img/weixin_share.png"/><br>');
    } else if (u.indexOf('ucbrowser') > -1 || u.indexOf('mqqbrowser') > -1) {
        $(".weixin-share-arrow").addClass("vh");
        $("#nativeShare").after('<div class="f34 tc bg-white btn-cancel-share" id="btn-cancel-share">取消</div>');
        $('html').append('<script src="../js/nativeShare.js"></script>');
        $('html').append('<script src="../js/native-share.js"></script>');
    }

    $("#share-window").swipe({
        tap: function () {
            $(this).addClass("dn");
        }

    });
});






