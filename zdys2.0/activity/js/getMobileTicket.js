$(function() {
    var scroll = new IScroll('#scroll', {
        probeType: 3,
        mouseWheel: true
    });
    setTimeout(function(){scroll.refresh()},1000);
    submitForm();
    getRegCode();
});
function mobileTicket() {
    var channel = GetQueryString('channel') || 'zdys';
    console.log(channel);
    var config = {
        "mobile": $("#phone").val(),
        "verifyCode": $("#code").val(),
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
