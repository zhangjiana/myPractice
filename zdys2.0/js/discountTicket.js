var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";
var scroll = new IScroll('#scroll-ticket', {
    probeType: 3,
    mouseWheel: true
});
var scrollInvalid = new IScroll('#scroll-invalid-box', {
    probeType: 3,
    mouseWheel: true
});
var weixinCan = false;

$(function() {
    var u = window.navigator.userAgent.toLocaleLowerCase();
    if(u.indexOf("micromessenger") > -1){
        weixinCan = true;
    }else {
        weixinCan = false;
    }
    function tabcChange() {
        $("#look-history-ticket").swipe({
            tap: function() {
                $("#page-history-ticket").removeClass("dn");
                $("#look-history-ticket").addClass("dn");
                scrollInvalid.refresh();
            }
        });
        $("#back-ticket-record").bind("click", function() {
            $("#page-history-ticket").addClass("dn");
            $("#look-history-ticket").removeClass("dn");
        });
    }
    //查看优惠券
    function lookTicket() {
        $.ajax({
            type: "GET",
            url: ajaxUrl + "User/VoucherList?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    $("#valid-ticket-box").html("");
                    $("#invalid-ticket-box").html("");
                    if (data.data.dataList.length) {
                        for (var i in data.data.dataList) {
                            createTicket(data.data.dataList[i]);
                        }
                        if (!$("#valid-ticket-box").children().length) {
                            $("#valid-ticket-box").removeClass("be5-t");
                            $("#valid-ticket-box").append('<div class="tc no-ticket">' +
                                '<img class="icon-ticket" src="http://imgcdn.zhaoduiyisheng.com/img/no_ticket.png"/>' +
                                '<div class="f28 c-99">暂无优惠券</div>' +
                                '</div>');
                        } else {
                            $("#valid-ticket-box").addClass("be5-t");
                        }
                        if ($("#invalid-ticket-box").children().length) {
                            $(".look-history-ticket").removeClass("dn");
                        }
                    } else {
                        $("#valid-ticket-box").append('<div class="tc no-ticket">' +
                            '<img class="icon-ticket" src="http://imgcdn.zhaoduiyisheng.com/img/no_ticket.png"/>' +
                            '<div class="f28 c-99">暂无优惠券</div>' +
                            '</div>');
                    }
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "../html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        }).success(function() {
            scroll.refresh();
            getTicketWithCode();
        });
    }

    var $ticket;
    function createTicket(data) {
        var serve = data.usageScope.replace('local_face','名医当面诊').replace('remote_face','名医远程诊').replace('remote_conference','名医预诊');
        var startTime = data.startTime.slice(0, 10);
        var expireTime = data.expireTime.slice(0, 10);
        var voucherCash = data.voucherCash.slice(0, 3);
        var service = '用于找对医生服务';
         if (data.firstServedPostPaid) {
            serve = '用于找对医生服务';
            service = '特权：先看病后付钱';
         }
         $ticket = $('<div data-id='+data.id+' data-price=' + voucherCash + ' class="discount-ticket cbo mrl30 mt30 pr">' +
            '<div class="cbo discount-price bg-blue">' +
            '<img class="discount-logo fl" src="http://imgcdn.zhaoduiyisheng.com/img/discoun-logo.png"/>' +
            '<span class="f34 db fl ml30 mt20 c-white">¥<b class="f80 pl20">' + voucherCash + '</b></span>' +
            '<p class="c-white fl ml30 mt20">' +
            '<span class="f24 db">'+service+'</span>' +
            '<span class="f48 db">元优惠券</span></p></div>' +
            '<div class="discount-info f24"><div class="cbo">' +
            '<span class="mr30">优惠券号:<em class="ml16">' + data.uuid + '</em></span><br>' +
            '<span>使用范围:<em class="ml16">'+serve+'</em></span><br>' +
            '</div>' +
            '<div><span>有效时间:<em class="ml16"><em>' + startTime + '</em> - <em>' + expireTime + '</em></em></span></div>' +
            '</div>' +
            '</div>');


        if (!data.expired && !data.used) {
            $("#valid-ticket-box").append($ticket);
            if(weixinCan && !getCookie('shared'+data.id)){
                createLock(data.id);
            }
        } else {
            $("#invalid-ticket-box").append($ticket);
            $("#invalid-ticket-box .discount-price").removeClass("bg-blue").addClass("bg-gray");
        }
    }

    /*解锁图*/
    function createLock(id){
        var $lock = $('<div class="lock-wrap share'+id+'">' +
            '<div class="lock-box">' +
            '<div class="lock" data-id='+id+'></div>' +
            '<div class="unlock"></div>' +
            '<div class="cover"><div  class="slide-text f34">向右滑动分享解锁</div></div>' +
            '</div>' +
            '</div>');
        $ticket.append($lock);
    }
    setTimeout(function(){
        unlock();
    },300);

    /*解锁动画*/
    function unlock(){
        var $lock = $('.lock');
        var dis = $(".lock-box").width() - $lock.width()-$(".unlock").width();

        $lock.on('touchmove',function(){
            var touch = event.targetTouches[0];
            //lock.style.left = parseInt(touch.pageX-110) + 'px';
            $(this).css({"left":parseInt(touch.pageX-110) + 'px',"top":"0"});

            $(this).removeClass('bounce animated');
            $(this).removeClass('bounceLeft animated');
            $(this).next().next().fadeOut(500);


        });

        $lock.on("touchend",function(){

           $(this).next().next().fadeIn(500);

            if(parseInt($(this).css("left"))<0){
                $(this).css({"left":0});
                $(this).addClass('bounceLeft animated').removeClass('bounce');
            } else if(parseInt($(this).css("left"))<dis||parseInt($(this).css("left"))> parseInt(dis+110)){
                $(this).css({"left":0});
                $(this).addClass('bounce animated').removeClass('bounceLeft');
            }else {
                $(this).css({"left":0});
                $(this).parent().parent().addClass('dn');
                //分享函数；
                share($(this).attr('data-id'));
            }
        });
    }
    var id = '';
    /*分享遮罩*/
    function share(num){
        var $shareBox=$('<div class="per-info-bot-wrap" id="share-list">' +
            '<div class="weixin-share" id="weixin-share" >' +
            '<img src="http://imgcdn.zhaoduiyisheng.com/img/weixin_share.png"/>' +
            '</div>' +
            '</div>');
        $("body").append($shareBox);
        $('#share-list').swipe({
            tap:function(e){
                $(".share"+num).removeClass('dn');
                $(this).remove();
                e.preventDefault();
            }
        });

        id = num;
    }

    if(weixinCan) {
        getSign();
    }
    /*微信分享*/
    function getSign() {
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
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    setCookie('shared'+id,id,366);
                                    $(".share"+id).addClass('dn');
                                    $("#share-list").remove();
                                },
                                cancel: function() {
                                    $(".share"+id).removeClass('dn');
                                    $("#share-list").remove();
                                }
                            });
                            wx.onMenuShareTimeline({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    setCookie('shared'+id,id,366);
                                    $(".share"+id).addClass('dn');
                                    $("#share-list").remove();
                                },
                                cancel: function() {
                                    $(".share"+id).removeClass('dn');
                                    $("#share-list").remove();
                                }
                            });
                            wx.onMenuShareQQ({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    setCookie('shared'+id,id,366);
                                    $(".share"+id).addClass('dn');
                                    $("#share-list").remove();
                                },
                                cancel: function() {
                                    $(".share"+id).removeClass('dn');
                                    $("#share-list").remove();
                                }
                            });
                            wx.onMenuShareWeibo({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    setCookie('shared'+id,id,366);
                                    $(".share"+id).addClass('dn');
                                    $("#share-list").remove();
                                },
                                cancel: function() {
                                    $(".share"+id).removeClass('dn');
                                    $("#share-list").remove();
                                }
                            });
                            wx.onMenuShareQZone({
                                title: '300元健康红包,北上广名医异地也能看', // 分享标题
                                desc: '找对医生给您300元健康红包，名医服务任您优享', // 分享描述
                                link: 'http://www.zhaoduiyisheng.com/activity/html/getTicketPage.html', // 分享链接
                                imgUrl: 'http://www.zhaoduiyisheng.com/img/logo01.png', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    setCookie('shared'+id,id,366);
                                    $(".share"+id).addClass('dn');
                                    $("#share-list").remove();
                                },
                                cancel: function() {
                                    $(".share"+id).removeClass('dn');
                                    $("#share-list").remove();
                                }
                            });
                        });
                    }, 1000);
                }
            }
        });
    }

    //兑换优惠券
    function getTicketWithCode() {
        $("#btn-exchange").swipe({
            tap: function() {
                var reg = /^[0-9]{8}$/;
                if (reg.test($("#ticket-code").val())) {
                    $("#code-notice").text("");
                    $.ajax({
                        type: "POST",
                        url: ajaxUrl + "User/RedeemVoucher?sessionId=" + window.localStorage.sessionId,
                        contentType: "text/plain; charset=UTF-8",
                        dataType: "json",
                        data: $("#ticket-code").val(),
                        success: function(data) {
                            if (data.code == 0) {
                                $("#code-notice").text("兑换成功");
                            } else {
                                $("#code-notice").text(data.message);
                            }
                        },
                        error: function(res) {
                            if (res.status == 401) {
                                myalert.tips({
                                    txt: "会话超时，请重新登录",
                                    fnok: function() {
                                        window.location = "../html/newLogin.html";
                                    },
                                    btn: 1
                                });

                            }
                        }
                    }).success(function() {
                        lookTicket();
                    });
                } else {
                    $("#code-notice").text("兑换码无效");
                }

            }
        });
    }

    tabcChange();
    lookTicket();
});
