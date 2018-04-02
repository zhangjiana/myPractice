

$(function(){

    var u = window.navigator.userAgent.toLocaleLowerCase();
    //alert(u);
    if(u.indexOf("micromessenger") > -1){
        //是在微信中打开的
        //alert("weixin");
        $("#nativeShare").remove();
        $('html').append('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
        $('html').append('<script src="../js/weixin-share.js"></script>');
        clickShare("#btn-share","#btn-cancel-share","#share-list");
        sendMsg("#share-send-msg","我们是找对医生:http://www.zhaoduiyisheng.com/");

    }else if(u.indexOf('ucbrowser') > -1||u.indexOf('mqqbrowser') > -1){
        //alert("uc qq");
        $("#weixin-share").remove();
        $('html').append('<script src="../js/nativeShare.js"></script>');
        $('html').append('<script src="../js/native-share.js"></script>');
    }
    else{
        //alert("未知浏览器");
    }
});
//发送短信
function sendMsg(id,shareText) {
    var $sendMsg = $(id);
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        //安卓手机
        $sendMsg.find("a").attr("href", "sms:?body=" + shareText);

    } else if (u.indexOf('iPhone') > -1) {
        //苹果手机
        $sendMsg.find("a").attr("href", "sms:&body=" + shareText);
    } else if (u.indexOf('Windows Phone') > -1) {
        //winphone手机
        $sendMsg.find("a").attr("href", "sms:?body=" + shareText);
    }
}


//点击分享弹出底部菜单
//function clickShare(showBtn,hideBtn,page) {
//    $(showBtn).swipe({
//        tap: function (event) {
//            event.stopPropagation();
//            $(page).removeClass("dn");
//        }
//    });
//    $(hideBtn).swipe({
//        tap: function (event) {
//            event.stopPropagation();
//            $(page).addClass("dn");
//        }
//    });
//}

