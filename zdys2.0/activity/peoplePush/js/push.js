/**
 * Created by zJ on 2016/4/12.
 */
$(function() {

    var con = new IScroll('#main', {
        probeType: 3,
        mouseWheel: true
    });
    for (var i = 0; i < 10; i++) {
        setTimeout(function() {
            con.refresh();
        }, i * 1000);
    }

    function getPeople() {
        $.ajax({
            type: "GET",
            url: ajaxUrl + "Promotion/ZeroLottery/UserCount?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    refreshBar(data.data.userCount, data.data.nextCount);
                    // refreshBar(1999,2000);
                } else if (909 === data.code) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "/html/newLogin.html";
                        },
                        btn: 1
                    });
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

    function refreshBar(now, sum) {
        var num = now>sum?0:sum - now;
        $('#peopleNum').text(num);
        $('#nextNum').text(sum);
        var plateLeft = $('#rotat').offset().left + $('#rotat').width(),
            barLeft = $('#bar').offset().left,
            lockLeft = $('#lock').offset().left,
            totalWidth = lockLeft - plateLeft,
            initWidth = plateLeft - barLeft,
            nowWidth = (now / sum) * totalWidth + initWidth;
        $('#barbg').width(nowWidth);
    }
    weixinLogin(getPeople);
    if (getCookie('user')&&11===getCookie('user').length&&!window.localStorage.openid) {
        getPeople();
    }
    setInterval(function() {
        getPeople();
    }, 1e4);
    $("#actDet").swipe({
        tap: function(e) {
            $("#rulesDet").slideToggle(function() {
                con.refresh();
                con.scrollToElement('#actDet');
            });
            $(this).find("span").toggleClass('active');
            e.preventDefault();
        }
    });
    $("#actRul").swipe({
        tap: function(e) {
            $("#rulesRul").slideToggle(function() {
                con.refresh();
                console.log(con.maxScrollY);
                con.scrollTo(0, con.maxScrollY, 500);
            });
            $(this).find("span").toggleClass('active');
            e.preventDefault();
        }
    });
    var theDate = new Date(),
      today = parseInt(''+theDate.getFullYear()+theDate.getMonth()+theDate.getDate());
    $("#btnPush").swipe({
        tap: function(e) {
            if (2016321>today) {
                joinAct();
            }else{
                myalert.tips({
                    txt:"活动已结束",
                    btn: 1
                });
            }
            e.preventDefault();
        }
    });
    $("#btnGo").swipe({
        tap: function(e) {
            if (2016321>today) {
                getBag();
            }else{
                myalert.tips({
                    txt:"活动已结束",
                    btn: 1
                });
            }
            e.preventDefault();
        }
    });
    /*验证手机号码*/
    regPhoneNum("#regPhone", "#notice");
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

    function joinAct() {
        $.ajax({
            type: "POST",
            url: ajaxUrl + "Promotion/ZeroLottery?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    popDialog(4);
                } else if (914 === data.code) {
                    popDialog(5);
                } else if (902 === data.code) {
                    popDialog(3);
                } else if (921 === data.code) {
                    popDialog(8);
                } else if (909 === data.code) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "/html/newLogin.html";
                        },
                        btn: 1
                    });
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

    function getBag() {
        $.ajax({
            type: "POST",
            url: ajaxUrl + "Promotion/ZeroLottery/CashCoupon?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    popDialog(1);
                } else if (914 === data.code) {
                    popDialog(5);
                } else if (918 === data.code) {
                    popDialog(2);
                }  else if (998 === data.code) {
                    popDialog(2);
                } else if (919 === data.code) {
                    popDialog(6);
                } else if (920 === data.code) {
                    popDialog(7);
                } else if (909 === data.code) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "/html/newLogin.html";
                        },
                        btn: 1
                    });
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
    shareWeixin('我刚参加了0元抽奖，快来一起冲关抢红包', '找对医生和你一起为健康出力', 'http://www.zhaoduiyisheng.com/activity/peoplePush/html/push.html', '../peoplePush/img/face.jpg');


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
    /*绑定手机号*/
    function sendMobile() {
        var data = {
            "mobile": $('#regPhone').val(),
            "verifyCode": $("#regNum").val()
        };
        $.ajax({
            type: "POST",
            url: ajaxUrl + "User/EasyBindMobile?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(data),
            success: function(data) {
                if (data.code == 0) {
                    //手机号绑定成功后..
                    joinAct();
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
    /*弹窗*/
    function popDialog(obj) {
        $("#pop-window").removeClass('dn');
        switch (obj) {
            case 1:
                $("#gotten").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 2:
                $("#empty").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 3:
                $("#registed").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 4:
                $("#joined").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 5:
                $("#RegTel").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 6:
                $("#process").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 7:
                $("#notOpen").removeClass('dn').siblings().not("span").addClass('dn');
                break;
            case 8:
                $("#already").removeClass('dn').siblings().not("span").addClass('dn');
                break;
        }
        $("#closeThis").swipe({
            tap: function() {
                $("#pop-window").addClass('dn');
                $(".dialog").addClass('dn');
            }
        });
    }
});
