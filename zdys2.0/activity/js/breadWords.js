/**
 * Created by zJ on 2016/3/31.
 */
$(function(){
    var scroll = new IScroll('#main', {probeType: 3, mouseWheel: true});
    setTimeout(function(){
        scroll.refresh();
    },1000);
    $(document).one("touchstart",function(){
        scroll.refresh();
    });
    scroll.on('scroll',function(){
        if (this.y<=this.maxScrollY) {
            $('.bot-arow').addClass('dn');
        }else{
            $('.bot-arow').removeClass('dn');
        }
    });
    var sessionId = null;
    weixinLogin();

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
                                title: '抢红包过愚人节，找对医生不骗人', // 分享标题
                                desc: '哪条健康常识是假的？答对红包到手', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/breakWords.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/activity/img/pig.jpg' // 分享图标
                            });
                            wx.onMenuShareTimeline({
                                title: '抢红包过愚人节，找对医生不骗人', // 分享标题
                                desc: '哪条健康常识是假的？答对红包到手', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/breakWords.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/activity/img/pig.jpg' // 分享图标
                            });
                            wx.onMenuShareQQ({
                                title: '抢红包过愚人节，找对医生不骗人', // 分享标题
                                desc: '哪条健康常识是假的？答对红包到手', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/breakWords.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/activity/img/pig.jpg' // 分享图标
                            });
                            wx.onMenuShareWeibo({
                                title: '抢红包过愚人节，找对医生不骗人', // 分享标题
                                desc: '哪条健康常识是假的？答对红包到手', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/breakWords.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/activity/img/pig.jpg' // 分享图标
                            });
                            wx.onMenuShareQZone({
                                title: '抢红包过愚人节，找对医生不骗人', // 分享标题
                                desc: '哪条健康常识是假的？答对红包到手', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/breakWords.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/activity/img/pig.jpg' // 分享图标
                            });
                        });
                    }, 1000);
                }
            }
        });
    }
    /*对与错的选择*/
    $('.choose').swipe({
        tap: function(e){
            $(this).addClass('right').siblings().removeClass('right');
            $(this).parent().attr('data-result',$(this).attr('data-attr'));
            e.preventDefault();
        }
    });
    /*活动规则说明*/
    $("#rulesArrow").swipe({
        tap: function(e){
            $("#rules").slideToggle(function(){
                scroll.refresh();
            });
            $(this).find("span").toggleClass('active');
            e.preventDefault();
        }
    });
    $("#slideUp").swipe({
        tap: function(e){
            $("#rules").slideToggle(function(){
                scroll.refresh();
            });
            $("#rulesArrow").toggleClass('active');
            scroll.refresh();
            e.preventDefault();
        }
    });
    /*提交答案*/
    $("#topicSubmit").swipe({
        tap: function(){
            var firRes = $("#first").attr('data-result'),
                secRes = $("#second").attr('data-result'),
                trdRes = $("#third").attr('data-result'),
                answer = firRes + secRes + trdRes;
            if(answer.length == 3){
                getAnswer(answer);
            }else {
                myalert.tips({
                    txt:"题目还未答完哦",
                    btn: 1
                });
            }

        }
    });
    /*关闭弹窗*/
    $("#closeThis").swipe({
        tap: function(){
            $("#alert-card").addClass('dn').removeClass('share');
        }
    });

    function weixinLogin(){
        //微信登录
        var hrefCode = GetQueryString('code');
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
                url: "http://www.zhaoduiyisheng.com/api/Weixin/OauthAccessToken?code=" + hrefCode,
                contentType: "text/plain; charset=UTF-8",
                dataType: "json",
                success: function(data) {
                    if (data.code == 0) {
                        if (data.data.openid == null) {
                            weixinUserReg(window.localStorage.openid);
                        } else {
                            window.localStorage.openid = data.data.openid;
                            var openid = data.data.openid;
                            var access_token = data.data.access_token;
                            weixinUserReg(openid, access_token);
                        }
                    }
                },
                error: function() {
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
                url: "http://www.zhaoduiyisheng.com/api/User/WeixinLogin",
                contentType: "text/plain;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(data),
                success: function(data) {
                    if (data.code == 0) {
                        sessionId = data.data.sessionId;
                        setCookie('user', data.data.mobile, 30);
                    }
                },
                error: function() {
                    scroll.refresh();
                }
            });
        }
    }

    /*答题后请求*/
    function getAnswer(obj){
        $.ajax({
            type: 'POST',
            url: 'http://www.zhaoduiyisheng.com/api/Promotion/AnswerQuestion?sessionId=' +sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data:obj,
            success: function(data) {
                console.log(data);
                if(data.code == 0){
                    $("#alert-card").removeClass('dn');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/right.jpg");

                    setTimeout(function(){
                        getMoney();
                    },5000);

                }else if( data.code == 917){
                    $("#alert-card").removeClass('dn');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/wrong.jpg");
                }else if(data.code == 918){
                    $("#alert-card").removeClass('dn').addClass('share');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/already.jpg");
                }else {
                    $("#alert-card").removeClass('dn');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/late.jpg");
                }
            }
        })
    }

    function getMoney(){
        $.ajax({
            type: 'POST',
            url: 'http://www.zhaoduiyisheng.com/api/Promotion/CashCoupon?sessionId=' + sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    console.log('getMoney');
                }else if( data.code == 917){
                    $("#alert-card").removeClass('dn');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/wrong.jpg");
                }else if(data.code == 918){
                    $("#alert-card").removeClass('dn').addClass('share');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/already.jpg");
                }else {
                    $("#alert-card").removeClass('dn');
                    $("#alert-card img").attr('src',"http://imgcdn.zhaoduiyisheng.com/activity/img/breakWords/late.jpg");
                }
            }
        })
    }

});
