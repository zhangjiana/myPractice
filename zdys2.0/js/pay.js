$(function() {
    var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";
    $('body').append('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != "micromessenger") {
        $('#weixin').remove();
        $('#zhifubao .icon_gou').addClass('active');
    } else {
        getSign();
    }
    var patientUuid = GetQueryString('patientUuid'),
        caseUuid = GetQueryString('caseUuid'),
        serviceType = GetQueryString('serviceType'),
        clinicService = GetQueryString('clinicService'),
        orderId = GetQueryString('orderId'),
        name = null,
        tel = null,
        payMoney = 0;
    var the_Flag = true;
    var scroll = new IScroll('#scroll-pay', {
        probeType: 3,
        mouseWheel: true
    });
    $("#sub-price02").text("0");
    window.sessionStorage.removeItem('wxorder');
    selectPayWay();
    getHomeMemberDAta(patientUuid);
    pageChangeAni("#use-ticket", "#page-ticket", "#back-pay");
    lookTicket();
    $("#back").swipe({
        tap: function(e) {
            window.location.href = "../html/selectService.html?patientUuid=" + patientUuid + "&caseUuid=" + caseUuid + "&clinicService=" + serviceType + "&orderId=" + orderId;
            e.preventDefault();
        }
    });
    $("#check").swipe({
        tap: function(e) {
            this.toggleClass('checked');
            $("#pay").toggleClass('unable');
            e.preventDefault();
        }
    });
    $("#orderId").text(orderId);

    function getSign() {
        $.ajax({
            type: 'GET',
            url: "http://www-test.zhaoduiyisheng.com/api/Weixin/Signature?url=" + encodeURIComponent(window.location.href),
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
                            jsApiList: ['chooseWXPay']
                        };
                    wx.config(config);
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
        });
    }
    $.ajax({
        type: 'GET',
        url: "http://www-test.zhaoduiyisheng.com/api/Order/TradeStatus?sessionId=" + window.localStorage.sessionId + "&orderId=" + orderId,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        success: function(data) {
            if (data.code == 0) {
                payMoney = parseInt(data.data.currentPriceStr) + parseInt(data.data.vipPriceStr);
                $("#service-way").text(data.data.subject);
                $("#service-price").text(payMoney);
                $("#final-price").text(parseInt(data.data.totalAmountStr));
                $("#service-CaseName").text(data.data.patientCaseName);
                if ('0.00' != data.data.voucherPriceStr) {
                    $("#sub-price").html('<span class="pr40">减<em class="service-price">' + data.data.voucherPriceStr + '</em>元</span>');
                    $("#sub-price02").text(data.data.voucherPriceStr);
                }
                if (data.data.voucherUuid) {
                    $('#sub-price').data('id', data.data.voucherUuid);
                }
                if (parseInt(data.data.vipPriceStr)) {
                    $("#service-way").append('+VIP服务');
                    $("#service-price").after('<em class="c-99 f24">(包含VIP服务费' + data.data.vipPriceStr + '元)</em>');
                }
                showPrice();
                serviceType = data.data.clinicService;
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
    });

    function selectPayWay() {
        $("#weixin").swipe({
            tap: function() {
                $(this).find(".icon_gou").addClass('active');
                $("#zhifubao>.icon_gou").removeClass('active');
                the_Flag = true;
            }
        });
        $("#zhifubao").swipe({
            tap: function() {
                $(this).find(".icon_gou").addClass('active');
                $("#weixin>.icon_gou").removeClass('active');
                the_Flag = true;
            }
        });

        $("#pay").swipe({
            tap: function() {
                if (!$(this).hasClass('unable')) {
                    if ($('#weixin .icon_gou').hasClass('active')) {
                        if (window.sessionStorage.wxorder) {
                            WXapy(JSON.parse(window.sessionStorage.wxorder));
                        } else {
                            orderCreate(patientUuid, 'weixin', 'JSAPI');
                        }
                    } else {
                        orderCreate(patientUuid, 'alipay', 'WAP');
                    }
                } else {
                    $("body").append('<div class="f28 c-white centerX alert-free-check" id="reg-tip">请勾选找对医生服务协议</div>');
                    setTimeout(function() {
                        var $regTip = $('#reg-tip');
                        $regTip.fadeOut(500);
                        $regTip.remove();
                    }, 1500);
                }
            }
        });
    }
    /*查询家庭成员资料*/
    function getHomeMemberDAta(objUuid) {
        $.ajax({
            type: 'GET',
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + objUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    /*判断姓名*/
                    if (data.data.name) {
                        name = data.data.name;
                    } else {
                        name = null;
                    }
                    if (data.data.phone) {
                        tel = data.data.phone;
                    } else {
                        tel = null;
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
        });
    }

    /*创建订单*/
    function orderCreate(objUuid, method, type) {

        var userPhone = $("#reg-phone-num").val() || getCookie('user');
        if (userPhone) {
            var config = {
                "orderId": orderId,
                // "contactPhone": tel,
                // "contactName": name,
                "paymentMethod": method,
                "tradeType": type
            };
            if ($('#sub-price').data('id')) {
                config.voucherNumber = $('#sub-price').data('id');
            }
            // if(true){
            //     config.voucherNumber='';
            // }
            if (the_Flag) {
                the_Flag = false;
                $.ajax({
                    type: "POST",
                    url: "http://www-test.zhaoduiyisheng.com/api/Order/PayOrder?sessionId=" + window.localStorage.sessionId,
                    contentType: "text/plain;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(config),
                    success: function(data) {
                        if (data.code == 0) {
                            var dataB = data.data;
                            window.localStorage[patientUuid + 'canorder'] = 0;
                            if ('weixin' === config.paymentMethod) {
                                window.sessionStorage.wxorder = JSON.stringify(dataB);
                                WXapy(dataB);
                            }
                            if ('alipay' === config.paymentMethod) {
                                // $("body").append(dataB);
                                // window.location = dataB;
                                $('#paypage').attr('src', dataB).removeClass('dn');


                            }
                            $("#back").remove();
                            the_Flag = true;
                        } else {
                            myalert.tips({
                                txt: data.message,
                                btn: 1
                            });
                        }
                        the_Flag = true;
                    },
                    error: function(res) {
                        the_Flag = true;
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
                });
            } else {

            }

        } else {
            myalert.tips({
                txt: "您没有绑定手机号，请输入联系电话。"
            });
        }
    }

    function WXapy(dataB) {
        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": dataB.appId,
                    "timeStamp": dataB.timeStamp,
                    "nonceStr": dataB.nonceStr,
                    "package": dataB.package,
                    "signType": dataB.signType,
                    "paySign": dataB.paySign
                },
                function(res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        window.location = '../html/payFinish.html?patientUuid=' + GetQueryString('patientUuid');
                    } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                }
            );
        }
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }

    function pageChangeAni(btnShow, page, btnHide) {
        $(btnShow).swipe({
            tap: function() {
                $(page).css({
                    '-webkit-transform': 'translate3d(-100%,0,0)',
                    'transform': 'translate3d(-100%,0,0)'
                });
            }
        });
        $(btnHide).swipe({
            tap: function() {
                $(page).css({
                    '-webkit-transform': 'translate3d(0,0,0)',
                    'transform': 'translate3d(0,0,0)'
                });
            }
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

                    } else {
                        $("#valid-ticket-box").append('<div class="tc no-ticket">' +
                            '<img class="icon-ticket" src="http://imgcdn.zhaoduiyisheng.com/img/no_ticket.png"/>' +
                            '<div class="f28 c-99">暂无优惠券</div>' +
                            '</div>');

                    }
                    scroll.refresh();
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
            getTicketWithCode();
            useTicket();
        });
    }

    function createTicket(data) {

        var startTime = data.startTime.slice(0, 10);
        var expireTime = data.expireTime.slice(0, 10);
        var voucherCash = data.voucherCash.slice(0, 3);
        var flag = data.usageScope.indexOf(serviceType) === -1?false:true;
        var serve = data.usageScope.replace('local_face','名医当面诊').replace('remote_face','名医远程诊').replace('remote_conference','名医预诊');
        var service = '用于找对医生服务';
         if (data.firstServedPostPaid) {
            serve = '用于找对医生服务';
            service = '特权：先看病后付钱';
         }
        var $ticket = $('<div data-id="' + data.uuid + '" data-price=' + voucherCash + ' class="discount-ticket cbo mrl30 mt30">' +
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
        console.log(flag);
        if (!data.expired && !data.used && flag) {
            $("#valid-ticket-box").append($ticket);
        }

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
        })
    }
    //点击使用优惠券
    function useTicket() {
        var len = $("#valid-ticket-box>div").length;
        if (len) {
            $("#valid-ticket-box>div").swipe({
                tap: function() {
                    var subPrice = $(this).attr("data-price");
                    $("#sub-price").html('<span class="pr40">减<em class="service-price">' + subPrice + '</em>元</span>');
                    $("#sub-price02").text(subPrice);
                    $("#final-price").text(payMoney - parseInt(subPrice));
                    $("#page-ticket").css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        'transform': 'translate3d(0,0,0)'
                    });
                    $('#sub-price').data('id', $(this).attr('data-id'));
                    showPrice();
                }
            });
        }

    }

});
