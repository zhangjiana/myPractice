$(function() {
    var scroll = new IScroll('#scroll', {
        probeType: 3,
        mouseWheel: true
    });
    setTimeout(function(){scroll.refresh()},1000);
    weixinUser();
    getRegCode();
    submitForm();
    var u = window.navigator.userAgent.toLocaleLowerCase();
    if (u.indexOf("micromessenger") > -1) {
        $.ajax({
            type: 'GET',
            url: "http://www.zhaoduiyisheng.com/api/Weixin/Signature?url=" + encodeURIComponent(window.location.href),
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    var dataB = data.data,
                        config = {
                            appId: dataB.appId,
                            timestamp: dataB.timestamp,
                            nonceStr: dataB.nonceStr,
                            signature: dataB.signature,
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                        };
                    setTimeout(function() {
                        wx.config(config);
                        wx.ready(function() {
                            wx.onMenuShareAppMessage({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png' // 分享图标
                            });
                            wx.onMenuShareTimeline({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png' // 分享图标
                            });
                            wx.onMenuShareQQ({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png' // 分享图标
                            });
                            wx.onMenuShareWeibo({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png' // 分享图标
                            });
                            wx.onMenuShareQZone({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png' // 分享图标
                            });
                        });
                    }, 1000);
                }
            }
        });
    }
});
var openid = null;

function weixinUser() {
    var appId = "wx14da7f3cb2e1b8ff";
    var redirect_uri = encodeURI("http://www-test.zhaoduiyisheng.com/html/activity/getTicketPage.html");
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + redirect_uri +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    console.log(url);
    var hrefCode = GetQueryString('code');

    //微信登录
    if (window.localStorage.openid) {
        openid = window.localStorage.openid;
        weixinUserReg(openid);
    } else if (hrefCode) {
        returnCode(hrefCode);
    }
    /*传过去code*/
    function returnCode(hrefCode) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Weixin/OauthAccessToken?code=" + hrefCode,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    if (data.data.openid == null) {
                        openid = null;
                    } else {
                        openid = data.data.openid;
                        window.localStorage.openid = openid;
                        var access_token = data.data.access_token;
                        weixinUserReg(openid, access_token);
                    }
                }
            }
        });
    }
    //微信用户登录
    function weixinUserReg(openid, access_token) {
        var data;
        if (access_token) {
            data = {
                "openid": openid,
                "accessToken": access_token
            };
        } else {
            data = {
                "openid": openid
            };
        }
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/User/WeixinLogin",
            contentType: "text/plain;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function(data) {
                if (data.code == 0) {
                    window.localStorage.sessionId = data.data.sessionId;
                    window.localStorage.selfUuid = data.data.uuid;
                    $.ajax({
                        type: "GET",
                        url: "http://www-test.zhaoduiyisheng.com/api/User/Profile?sessionId=" + window.localStorage.sessionId,
                        contentType: "text/plain; charset=UTF-8",
                        dataType: "json",
                        success: function(data) {
                            if (data.code == 0) {
                                if (data.data.name) {
                                    $('#username').text(data.data.name);
                                    $('#userHead').css({'background-size':'cover','background-repeat':'no-repeat','background-position':'center center'});
                                    if(data.data.avatar){

                                        if(data.data.avatar.indexOf('http')>-1){
                                            $('#userHead').css('background-image','url('+data.data.avatar+')');
                                        }else{
                                            $('#userHead').css('background-image','url(http://imgcdn.zhaoduiyisheng.com/img/head/'+data.data.avatar+')');
                                        }
                                    }else{
                                        $('#userHead').css('background-image','url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png)');
                                    }
                                }
                            }
                        }
                    });
                }
            },
            error: function(s, t) {
                console.log('微信登录失败');
                console.log(s);
                console.log(t);
            }
        });
    }
}

function mobileTicket() {
    var channel = GetQueryString('channel') || 'zdys';
    console.log(channel);
    var config = {
        "mobile": $("#phone").val(),
        "verifyCode": $("#code").val(),
        "openid": openid,
        "channel": channel,
        "eventUuid": ["5c2930eb-bcc2-49b1-8ac2-3b0eaadc0bae", "451f93a9-d0ab-4534-9af4-a2ca8cd4608b"]
    };

    $.ajax({
        type: "POST",
        url: "http://www-test.zhaoduiyisheng.com/api/User/MobileRedeem",
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(config),
        success: function(data) {
            if (data.code == 0) {
                window.location.href = "discountDetail.html?tel=" + $("#phone").val();
            } else {
                $('#form-notice').text(data.message);
            }
        },
        error: function(res) {
            if (res.status == 401) {
                myalert.tips({
                    txt: "会话超时，请重新登录",
                    fnok: function() {
                        window.location = "../../html/login.html";
                    },
                    btn: 1
                });
            }
        }
    });
}

function submitForm() {
    $("#btn-submit").swipe({
        tap: function() {
            if ($('#phone').triggerHandler('blur') && $('#code').triggerHandler('blur')) {
                mobileTicket();
            }
        }
    });
    // 判断是否领取过
    $("#phone").on('input propertychange', function() {
        if (11 === $(this).val().length) {
            $.ajax({
                type: "GET",
                url: "http://www-test.zhaoduiyisheng.com/api/User/MobileRedeem?mobile=" + $(this).val(),
                contentType: "text/plain; charset=UTF-8",
                dataType: "json",
                success: function(data) {
                    if (data.code == 0) {
                        //console.log('未领取');
                    } else {
                        window.location = '../html/discountDetail.html?tel=' + $("#phone").val() + '&out=true';
                    }
                },
                error: function(res) {
                    if (res.status == 401) {
                        myalert.tips({
                            txt: "会话超时，请重新登录",
                            fnok: function() {
                                window.location = "../../html/login.html";
                            },
                            btn: 1
                        });
                    }
                }
            });
        }
    });
}
//获取验证码
function getRegCode() {
    regPhoneNum("#phone", "#form-notice");
    regCode("#code", "#form-notice");
    var $getRegCode = $("#btn-get-code");
    $getRegCode.swipe({
        tap: function() {
            if ($('#phone').triggerHandler('blur')) {
                if (!$("#btn-get-code").hasClass("disable")) {
                    getCode();
                }
            }
        }
    });
}
/*获取手机验证码 ajax*/
function getCode() {
    console.log("getCode");
    getCodeActive($("#btn-get-code"));
    $.ajax({
        type: "GET",
        url: ajaxUrl + "User/VerifyCode",
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: "mobile=" + $("#phone").val() + "&type=redeem",
        success: function(data) {
            if (data.code == 0) {
                getCodeActive($("#btn-get-code"));
                return true;
            } else {
                $('#form-notice').text(data.message);
                return false;
            }
        },
        error: function(res) {
            if (res.status == 401) {
                myalert.tips({
                    txt: "会话超时，请重新登录",
                    fnok: function() {
                        window.location = "../../html/login.html";
                    },
                    btn: 1
                });

            }
        }
    });
}
