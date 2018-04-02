var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";

$(function() {
    $('#login ').on('touchstart', function(e) {
        if (!localStorage.openid && (!getCookie('user') || '00' === getCookie('user'))) {
            myalert.tips({
                txt: "您未登录，请先登录",
                fnok: function() {
                    window.location.href = '/html/newLogin.html';
                },
                notxt: "逛一逛",
                oktxt: "去登录"
            });
            e.preventDefault();
        }
    });
    if (localStorage.openid || (getCookie('user') && '00' !== getCookie('user'))) {
        getMyScore();
        getVoucherList();
    }
    $("#ticket").swipe({
        tap: function() {
        if (!localStorage.openid && (!getCookie('user') || '00' === getCookie('user'))) {
                myalert.tips({
                    txt: "您还未登录，请先登录",
                    fnok: function() {
                        window.location.href = '/html/newLogin.html';
                        e.preventDefault();
                    }
                });
            } else {
                window.location.href = '../html/discountTicket.html';
            }
        }
    });
});
//获取积分
function getMyScore() {
    $.ajax({
        type: "GET",
        url: ajaxUrl + "User/Profile?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function(data) {
            if (data.code == 0) {
                if (data.data.totalPoints >= 0) {
                    $("#total-code").text(data.data.totalPoints);
                }
            } else if (data.code == 909) {
                loginTimeOut();
            }
        },
        error: function(res) {
            if (res.status == 401) {
                //myalert.tips({
                //    txt: "会话超时，请重新登录",
                //    fnok: function() {
                //        window.location = "../html/newLogin.html";
                //    },
                //    btn: 1
                //});
                loginTimeOut();
            }
        }
    });
}
//获取优惠券
function getVoucherList() {
    $.ajax({
        type: "GET",
        url: ajaxUrl + "User/VoucherList?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function(res) {
            if (res.code == 0) {
                $("#valid-ticket-box").html("");
                $("#invalid-ticket-box").html("");
                if (res.data.dataList.length >= 0) {
                    var ticketArr = res.data.dataList;
                    var ticketNum = 0;
                    for (var i in ticketArr) {
                        if (!ticketArr[i].expired && !ticketArr[i].used) {
                            ticketNum++;
                        }
                    }
                    $("#ticket-num").text(ticketNum);
                } else {
                    $("#ticket-num").text(0);
                }

            } else if (res.code == 909) {
                loginTimeOut();
            }
        },
        error: function(res) {
            if (res.status == 401) {
                //myalert.tips({
                //    txt: "会话超时，请重新登录",
                //    fnok: function() {
                //        window.location = "../html/newLogin.html";
                //    },
                //    btn: 1
                //});
                loginTimeOut();
            }
        }
    });
}
function noLogin(){
    $(".my-login").html('<a class="db f34 c-white" href="../html/newLogin.html">登录/注册</a>');
        $("#total-code").text('0');
        $("#ticket-num").text('0');
        $("#my-head-pic span").html('<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png"/>');
}