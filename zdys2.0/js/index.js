/**
 * Created by zJ on 2016/1/6.
 */
window.localStorage.theRelationship = '{"father":"爸爸","mother":"妈妈","me":"我"}';
var relation = JSON.parse(window.localStorage.theRelationship);

$(function() {
    if (GetQueryString('from') == 'wxFace') {
        myalert.tips({
            tit: "找对医生",
            txt: "我们建议您先进行远程预诊，帮您出行前决定是否需要去北上广面诊！",
            oktxt: "我要名医先预诊",
            notxt: "我要直奔名医",
            fnno: function() {
                window.location.href = "html/faceDiagnose.html?clinicService=local_face";
            },
            fnok: function() {
                window.location.href = "html/telePreDiag.html?clinicService=remote_conference";
            }
        });
    }
    if (!window.localStorage.teachUse) {
        $('#teach-use').removeClass('dn');
        con.refresh();
    }
    var hrefCode = GetQueryString('code');
    if (!localStorage.openid && !hrefCode) {
        indexClick();
    }
    //微信登录
    if (window.localStorage.openid) {
        removeCookie('pwd');
        weixinUserReg(window.localStorage.openid);
    } else if (hrefCode) {
        removeCookie('pwd');
        returnCode(hrefCode);
    } else if (window.localStorage.sessionId) {
        //getHomeMember();
        /*获取用户基本资料 关爱家人次数*/
    }
    //判断是否为新用户刚注册进来的
    if (window.localStorage.bootstrap == 'true') {
        $("body").append('<div class="f28 c-white centerX alert-free-check" id="reg-tip">恭喜您注册成功，获得10积分！</div>');
        setTimeout(function() {
            var $regTip = $('#reg-tip');
            $regTip.fadeOut(500);
            $regTip.remove();
        }, 1500);
        window.localStorage.bootstrap = '';
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
                        weixinUserReg(window.localStorage.openid);
                    } else {
                        window.localStorage.openid = data.data.openid;
                        var openid = data.data.openid;
                        var access_token = data.data.access_token;
                        weixinUserReg(openid, access_token);
                    }
                }
            },
            error: function() {}
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
                    if (data.data.bootstrap) {
                        $("body").append('<div class="f28 c-white centerX alert-free-check" id="reg-tip">恭喜您注册成功，获得10积分！</div>');
                        setTimeout(function() {
                            var $regTip = $('#reg-tip');
                            $regTip.fadeOut(500);
                            $regTip.remove();
                        }, 1500);
                    }
                    window.localStorage.sessionId = data.data.sessionId;
                    window.localStorage.selfUuid = data.data.uuid;
                    setCookie('user', data.data.mobile, 30);
                    //window.localStorage.bootstrap = data.data.bootstrap;
                    //getHomeMember();
                    indexClick();
                }
                con.refresh();

            },
            error: function(s, t) {
                con.refresh();
                // alert(JSON.stringify(a).replace(/<[^>]*>/g, '').replace(/^{".+k.web.s/g, ''));
                //alert('go2');
                //window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx14da7f3cb2e1b8ff&redirect_uri="+encodeURI("http://www-test.zhaoduiyisheng.com/index.html")+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            }
        });
    }
    con.refresh();
    setTimeout(function() {
        con.refresh();
    }, 2000);
    //getHomeMember(window.localStorage.sessionId);
    function indexClick() {

        // $(".free-check").swipe({
        //     tap: function() {
        //         $("body").append('<div class="f28 c-white centerX alert-free-check" id="alert-free-check">正在筹建，敬请期待...</div>');
        //         setTimeout(function() {
        //             var $free = $('#alert-free-check');
        //             $free.fadeOut(500);
        //             $free.remove();
        //         }, 1500);
        //     }
        // });
        $("#no-more").swipe({
            tap: function(e) {
                $("#teach-use").slideUp(300);
                e.preventDefault();
                window.localStorage.teachUse = 'no';
                setTimeout(function() {
                    con.scrollTo(0, 0, 300);
                    con.refresh();
                }, 300);
            }
        });
        $("#faceDia").on('click', function() {
            myalert.tips({
                tit: "找对医生",
                txt: "我们建议您先进行远程预诊，帮您出行前决定是否需要去北上广面诊！",
                oktxt: "我要名医先预诊",
                notxt: "我要直奔名医",
                fnno: function() {
                    window.location.href = "html/faceDiagnose.html?clinicService=local_face";
                },
                fnok: function() {
                    window.location.href = "html/telePreDiag.html?clinicService=remote_conference";
                }
            });
        });
        commonLink();
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Promotion/League/Recommend",
            contentType: "text/plain;charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.data.link) {
                    var title = data.data.title,
                        des = data.data.description;
                    if (title.length > 10) {
                        title = title.slice(0, 10) + '...';
                    }
                    if (des.length > 10) {
                        des = des.slice(0, 10) + '...';
                    }
                    $('.swiper-wrapper').append('<div class="swiper-slide"><a href="' + data.data.link + '"><img class="yklmimg fl" src="http://imgcdn.zhaoduiyisheng.com/img/find_yklm.jpg"><span class="f30 bold pa" style="color:#ef024a;left:25px;top:20px;">' + title + '</span><span class="f24 pa c-33" style="left:25px;top:48px;">' + des + '</span><span class="f20 bold pa" style="left:25px;top:70px;padding:2px 5px;border:1px solid #ef024a;border-radius: 10px;color:#ef024a;">查看详情</span></a></div>');
                }
                var swiper = new Swiper('.banner', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    centeredSlides: true,
                    loop: true,
                    autoplay: 3000,
                    speed: 500,
                    'transition-timing-function': 'ease-in-out',
                    autoplayDisableOnInteraction: false
                });
                $('.swiper-pagination').removeClass('dn');
            }
        });
    }
});
