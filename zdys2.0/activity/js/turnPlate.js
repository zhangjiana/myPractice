/**
 * Created by zJ on 2016/4/21.
 */
var scroll = new IScroll('#main', {probeType: 3, mouseWheel: true,bounce:false});
setTimeout(function(){
    scroll.refresh();
},1000);

$(function() {
    var $hand = $("#handle"),
        $start = $("#start");
    $hand.css("-webkit-transform", "rotate(0deg)");
    $hand.css("transform", "rotate(0deg)");
    var ange = 0,
      score = 0;
    $start.bind("click", function () {
        goGet('GET');
    });

    function anmiAction(ange) {
        var angleAll = 360,
            perangle = angleAll * 3,//转3圈
            angle = perangle + parseInt((ange-1) * (angleAll / 8)) + Math.random()*25+10;
        $hand.css("-webkit-transform", "rotate(" + angle + "deg)");
        $hand.css("transform", "rotate(" + angle + "deg)");
    }

    weixinLogin();
    shareWeixin("积分兑现金，找对医生健康转盘天天转不停","100%中奖，每天一次机会，你还不来吗","http://www-test.zhaoduiyisheng.com/activity/html/turnPlate.html","http://imgcdn.zhaoduiyisheng.com/activity/img/turnPlate/face.jpg");
    function goGet(method){
        $.ajax({
            type: method,
            url: ajaxUrl + "Promotion/Turntable?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if(data.code == 0){
                    if ('GET' === method) {
                        score = data.data;
                        if(data.data == 200){
                            ange = 3;
                        }else if(data.data == 10){
                            ange = 5;
                        }else if(data.data == 30){
                            ange = 8;
                        }else if(data.data == 100){
                            ange = 2;
                        }
                        anmiAction(ange);
                        $hand.off("webkitTransitionEnd").on("webkitTransitionEnd", function () {
                            if(getCookie('user')&&getCookie('user').length == 11){
                                goGet('POST');
                            }else {
                                popDialog(1);
                            }
                        });
                    }else{
                            if (200===score) {
                                popDialog(3);
                            }else{
                                popDialog(2,data.data);
                            }
                    }
                }else if(data.code == 921){
                    popDialog(4);
                }else if(data.code == 914){
                    if(data.message.indexOf('微信')!= -1){
                        myalert.tips({
                            txt:"请微信登录后再来",
                            btn:1
                        });
                    }
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "/html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        });
    }

    bindPhone();
    function bindPhone() {
        var $getRegCode = $("#getRegNum");
        var $regPhone = $('#regPhone');
        var $regNum = $('#regNum');
        $getRegCode.swipe({
            tap: function() {
                if ($('#regPhone').triggerHandler('blur')) {
                    if (!$getRegCode.hasClass('disable')) {
                        getRegCodeAjax();
                    }
                } else {
                    $("#notice").text("请先输入手机号");
                }
            }
        });
        $("#btnSubmit").swipe({
            tap: function() {
                if ($regPhone.triggerHandler('blur') && $regNum.val()) {
                    sendMobile();
                } else if (!$regNum.val()) {
                    $("#notice").text("请输入验证码");
                } else {
                    $("#notice").text("请先输入手机号");
                }
            }
        });
    }
    /*绑定手机号*/
    function sendMobile() {
        var data = {
            "mobile": $('#regPhone').val(),
            "verifyCode": $("#regNum").val(),
            "eventName":"HEALTH_TURNTABLE"
        };
        $.ajax({
            type: "POST",
            url: ajaxUrl + "User/EasyBindMobile?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            success: function(data) {
                if (data.code == 0) {
                    $('#notice').text('绑定成功');
                    setCookie('user',$('#regPhone').val(),30);
                    goGet('POST');
                    return true;
                } else {
                    $('#notice').text(data.message);
                    return false;
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "/html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        });
    }
    /*验证手机号码*/
    regPhoneNum("#regPhone", "#notice");

    //获取注册验证码
    function getRegCodeAjax() {
        $.ajax({
            type: "GET",
            url: ajaxUrl + "User/VerifyCode",
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: "mobile=" + $("#regPhone").val() + "&type=bind_mobile",
            success: function(data) {
                if (data.code == 0) {
                    getCodeActive($("#getRegNum"));
                    return true;
                } else {
                    $('#notice').text(data.message);
                    return false;
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "/html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        });
    }
    /*验证码倒计时*/
    function getCodeActive(obj) {
        console.log("已发送验证码");
        var $getRegCode = obj;
        if (!$getRegCode.hasClass('disable')) {
            $getRegCode.addClass('disable');
            var iSecond = 60;
            var timer;
            $getRegCode.text(iSecond + "s");
            iSecond--;
            timer = setInterval(function() {
                if (iSecond < 0) {
                    $getRegCode.text("重新获取");
                    clearInterval(timer);
                    $getRegCode.removeClass('disable');
                } else {
                    $getRegCode.text(iSecond + "s");
                    iSecond--;
                }
            }, 1000);
        }
    }
});
function popDialog(obj,point) {
    $("#pop-window").removeClass('dn');
    switch (obj) {
        case 1:
            $("#bindPhone").removeClass('dn').siblings().not("span").addClass('dn');
            break;
        case 2:
            $("#getPoint").removeClass('dn').siblings().not("span").addClass('dn');
            if(point){
                $("#point").text(point)
            }else {
                $("#point").addClass('dn')
            }
            break;
        case 3:
            $("#getTicket").removeClass('dn').siblings().not("span").addClass('dn');
            break;
        case 4:
            $("#outChance").removeClass('dn').siblings().not("span").addClass('dn');
            break;
        default:
            $("#pop-window").addClass('dn');
            break;
    }
    $("#closeDialog").swipe({
        tap: function() {
            $("#pop-window").addClass('dn');
            $(".diaContent").addClass('dn');
        }
    });
}
