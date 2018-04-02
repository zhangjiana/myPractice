var scroll = new IScroll('#main', {
    probeType: 3,
    mouseWheel: true
});

if (GetQueryString('tel')) {
    $("#tel").text(GetQueryString('tel'));
}
if ('true' === GetQueryString('out')) {
    $("body").append('<div class="f28 c-white centerX alert-free-check" id="out-ed">该优惠券已抢过哦~</div>');
    setTimeout(function() {
        var $regTip = $('#out-ed');
        $regTip.fadeOut(500);
        $regTip.remove();
    }, 1500);
}
$('#modify').swipe({
    tap: function() {
        myalert.changePhone(function() {
            var config = {
                "mobile": $('#tel').text(),
                "newMobile": $('#inp-tel').val(),
                "verifyCode": $('#inp-code').val()
            };
            $.ajax({
                type: 'POST',
                url: 'http://www-test.zhaoduiyisheng.com/api/User/MobileRedeem/ModifyMobile',
                contentType: "text/plain; charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(config),
                success: function(data) {
                    if (data.code == 0) {
                        $('#tel').text($('#inp-tel').val());
                        var file = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
                        window.history.replaceState({}, '', file + '?tel=' + $('#tel').text());
                        myalert.remove();
                    }
                }
            });
        });
    }
});
setTimeout(function() {
    scroll.refresh();
}, 1000);
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
