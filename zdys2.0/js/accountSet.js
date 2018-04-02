var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";

    var loginFlag = false; 
$(function() {

    pageChangeList();
    getPersonalInfo();
    changePersonalInfo();
    savaPersonalName();
    getChangePwdCode();
    changePwd();
    clearInput();
    showPwd();
   
    $("#submit").swipe({
        tap: function() {
            if ($("#feedback").val()) {
                setTimeout(function() {
                    myalert.tips({
                        txt: "您的反馈已成功提交",
                        btn: 1,
                        fnok: function() {
                            $("#feedback").val("");
                            myalert.remove();
                            $("#page-feedback").css("transform", "translate3d(0,0,0)");
                            $("#page-feedback").css("-webkit-transform", "translate3d(0,0,0)");
                        }
                    });
                }, 1000);
            } else {
                myalert.tips({
                    txt: "请填写反馈内容",
                    btn: 1
                });
            }
        }
    });
    loginOut();
       $('#login ').on('touchstart click', function(e) {
        if (!loginFlag) {
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
    $("#ticket").swipe({
        tap: function() {
            if (!loginFlag) {
                myalert.tips({
                    txt: "您还未登录，请先登录",
                    fnok: function() {
                        window.location.href = '/html/newLogin.html';
                        e.preventDefault();
                    },
                    notxt: "逛一逛",
                    oktxt: "去登录"
                });
            } else {
                window.location.href = '../html/discountTicket.html';
            }
        }
    });
    $("#btn-list-manage").swipe({
        tap: function() {
            if (!loginFlag) {
                myalert.tips({
                    txt: "您未登录，请先登录",
                    fnok: function() {
                        window.location.href = '/html/newLogin.html';
                    },
                    notxt: "逛一逛",
                    oktxt: "去登录"
                });
            } else {
                window.location.href = '../html/myOrder.html';
            }
        }
    });
    $("#my-head-pic").swipe({
        tap: function() {
            if (!loginFlag) {
                window.location.href = '/html/newLogin.html';
            } else {
                window.location.href = '../html/accountSet.html?from=my';
            }
        }
    });

});

//页面切换动画
function pageChangeAni(btnShow, page, btnHide,fn) {
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
            if(fn){
                fn();
            }
        }
    });
}

function pageChangeList() {
    pageChangeAni("#btn-default-person", "#page-default-person", "#back-default-person");
    pageChangeAni("#btn-change-pwd", "#page-change-pwd", "#back-change-pwd");
    pageChangeAni("#btn-about-us", "#page-about-us", "#back-about-us");
    pageChangeAni("#btn-feedback", "#page-feedback", "#back-feedback");
    pageChangeAni("#btn-service-item", "#page-service-item", "#back-service-item",function(){
        setTimeout(function(){
            $("#scroll-service").addClass('clamp3');
            $("#icon-more").removeClass('dn');
            scrollSer.refresh();
        },300);
    });
    /*使用帮助*/
    $("#btn-use-info").swipe({
        tap: function(e) {
            window.location.href = "../html/useHelp.html?from=accountSet";
            e.preventDefault();
        }
    });
}
//获取个人信息
function getPersonalInfo() {
    
        $.ajax({
            type: "GET",
            url: ajaxUrl + "User/Profile?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    loginFlag = true;
                    if (data.data.name) {
                        $("#default-person-name01").text(data.data.name);
                        $("#default-person-name02").val(data.data.name);
                        $("#my-name").text(data.data.name);
                    } else {
                        $("#default-person-name01").text("点击填写");
                        $("#my-name").text("未知");
                    }
                    if (data.data.avatar) {
                        if(data.data.avatar.indexOf('http')>-1){
                            $("#my-head-pic span").html('<img src="'+ data.data.avatar + '"/>');
                        }else{
                            $("#my-head-pic span").html('<img src="http://imgcdn.zhaoduiyisheng.com/img/head/' + data.data.avatar + '"/>');
                        }
                    } else {
                        $("#my-head-pic span").html('<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png"/>');
                    }
                    //手机号
                    if (data.data.mobile) {
                        $("#phone-num").text(data.data.mobile);
                        $("#my-tel").text(data.data.mobile);
                        $("#my-tel").parent().removeClass('my-tel-no').addClass('my-tel');
                    } else {
                        $("#phone-num").text("绑定");
                        $("#btn-bind-phone").swipe({
                            tap: function(e) {
                                window.location.href = "../html/bindPhone.html";
                                e.preventDefault();
                            }
                        });
                        $("#my-tel").text("未绑定");
                        $("#my-tel").parent().removeClass('my-tel').addClass('my-tel-no');
                    }
                } else if (data.code == 909) {
                    noLogin();
                }

            },
            error: function(res) {
                if (res.status == 401) {
                    //myalert.tips({
                    //    txt:"会话超时，请重新登录",
                    //    fnok:function(){
                    //        window.location = "../html/newLogin.html";
                    //    },
                    //    btn:1
    
                    noLogin();
                }

            }
        });
    
}

//修改默认联系人
function changePersonalInfo() {
    $("#default-person-name02").bind("keyup blur", function() {
        var reg = /^[\u4E00-\u9FFF]{2,5}$/;
        if (reg.test($("#default-person-name02").val())) {
            $("#change-name-notice").text("");
            return true;
        } else {
            $("#change-name-notice").text("请正确输入中文名称(2-5个字)");
            return false;
        }

    });
}
//保存默认联系人名字
function savaPersonalName() {
    $("#btn-save-name").swipe({
        tap: function() {
            $("#default-person-name02").triggerHandler("blur");
            var config = {
                name: $("#default-person-name02").val()
            };
            $.ajax({
                type: "POST",
                url: ajaxUrl + "User/ModifyProfile?sessionId=" + window.localStorage.sessionId,
                contentType: "text/plain; charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function(data) {
                    if (data.code == 0) {
                        myalert.tips({
                            txt: "保存成功，点击确定返回上一页",
                            fnok: function() {
                                myalert.remove();
                                $("#page-default-person").css("-webkit-transform", "translate3d(0,0,0)").css("transform", "translate3d(0,0,0)");
                            }
                        });
                        // $("#change-name-notice").text("保存成功");
                        $("#default-person-name01").text($("#default-person-name02").val());
                    } else if (data.code == 909) {
                        noLogin();
                    } else {
                        $("#change-name-notice").text("保存失败");
                        console.log("修改信息失败");
                    }
                },
                error: function(res) {
                    if (res.status == 401) {
                        //myalert.tips({
                        //    txt:"会话超时，请重新登录",
                        //    fnok:function(){
                        //        window.location = "../html/newLogin.html";
                        //    },
                        //    btn:1
                        //});
                        noLogin();
                    }
                }
            });
        }
    });
}
//退出登录
function loginOut() {
    $("#btn-login-out").swipe({
        tap: function() {
            $.ajax({
                type: "POST",
                url: ajaxUrl + "User/Logout?sessionId=" + window.localStorage.sessionId,
                contentType: "text/plain; charset=UTF-8",
                dataType: "json",
                data: "{}",
                success: function(data) {
                    if (data.code == 0) {
                        localStorage.clear();
                        removeCookie("user");
                        window.location = "../html/newLogin.html";

                    } else if (data.code == 909) {
                        noLogin();
                    }
                },
                error: function(res) {
                    if (res.status == 401) {
                        //myalert.tips({
                        //    txt:"会话超时，请重新登录",
                        //    fnok:function(){
                        //        window.location = "../html/newLogin.html";
                        //    },
                        //    btn:1
                        //});
                        noLogin();
                    }
                }
            });
        }
    });
}
function noLogin(){
  
        $(".my-login").html('<a class="db f34 c-white" href="../html/newLogin.html">登录/注册</a>');
        $("#total-code").text('0');
        $("#ticket-num").text('0');
        $("#my-head-pic span").html('<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png"/>');
   
}