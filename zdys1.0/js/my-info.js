/**
 * Created by yxf on 2015/12/9.
 */



$(function () {
    clickShare();//点击分享弹出底部菜单
    showMyListPrice();//价格
    pageChangeList();//页面切换动画
    changePwd();//修改密码
    manageList();//管理订单tab切换
    personalCenterAjax();//统一调用个人中心所有方法
});
//点击分享弹出底部菜单
function clickShare() {
    $("#btn-share").swipe({
        tap: function (event) {
            event.stopPropagation();
            $("#share-list").removeClass("dn");
        }
    });
    $("#btn-cancel-share").swipe({
        tap: function (event) {
            event.stopPropagation();
            $("#share-list").addClass("dn");
        }
    });
}
//显示价格
function showMyListPrice() {
    var $price = $(".service-price");
    for (var i = 0; i < $price.length; i++) {
        $price.eq(i).text(formatPrice($price.eq(i).text()));
    }
}
//价格格式化
function formatPrice(s) {
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = s.replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return "￥" + s.replace(/^\./, "0.")
}
//页面切换动画
function pageChangeAni(btnShow,page,btnHide) {
    $(btnShow).swipe({
        tap:function(){
            $(page).css({'-webkit-transform': 'translate3d(-100%,0,0)',
                'transform': 'translate3d(-100%,0,0)'});
        }
    });
    $(btnHide).swipe({
        tap:function(){
            $(page).css({'-webkit-transform':'translate3d(0,0,0)',
                'transform':'translate3d(0,0,0)'});
        }
    })
}
function pageChangeList(){
    pageChangeAni("#btn-my-head","#page-personal-info","#back-personal-info");
    pageChangeAni("#btn-my-list","#page-my-list","#back-my-list");
    pageChangeAni("#btn-about-us","#page-about-us","#back-about-us");
    pageChangeAni("#btn-use-info","#page-use-info","#back-use-info");
    pageChangeAni("#btn-service-item","#page-service-item","#back-service-item");
    pageChangeAni("#btn-feedback","#page-feedback","#back-feedback");
    pageChangeAni("#btn-change-pwd","#page-change-pwd","#back-change-pwd");
}
//管理订单tab切换
function manageList(){
    $("#my-order-nav li").swipe({
        tap:function(){
            $(this).addClass("selected").siblings().removeClass("selected");
        }
    });
}
/*********个人中心ajax***************/
function personalCenterAjax(){

    getCityInfoAjax();
    quitLogin();
    getPersonalInfo();
    changePersonalInfo();
    regPwd("#old-pwd","#change-pwd-notice");
    regPwd("#new-pwd01","#change-pwd-notice");
    regPwd("#new-pwd02","#change-pwd-notice");
    changePwdSubmit();
}
//获取城市列表
function getCityInfoAjax(){
    if(window.localStorage.province){
        createProvince(window.localStorage.province);
    }else {
        getProvince();
    }
}
//用户退出登录
function quitLogin(){
    var $btnQuit=$("#btn-quit-login");
    $btnQuit.swipe({
        tap:function(){
        $.ajax({
            type:"POST",
            url:"http://www.zhaoduiyisheng.com/api/User/Logout?sessionId="+window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType:"json",
            data:"{}",
            success: function(data){
                console.log("quit success");
                if (data.code == 0){
                    console.log(data.message);
                    window.location.href="../login.html";
                }else{
                    console.log(data.message);
                }
            },
            error:function(status){
                if(status.code == 401){
                    alert("会话超时，请重新登录");
                    window.location = "../login.html";
                }

            }
        });
        }
    });
}
//获取个人信息
function getPersonalInfo(){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/User/Profile?sessionId="+window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType:"json",
        success: function(data){
            if (data.code == 0){
                console.log(data.data.mobile);
                if(data.data.name){
                    $("#my-name01").text(data.data.name);
                    $("#my-name02").val(data.data.name);
                }
                else{
                    $("#my-name01").text(data.data.mobile);
                    $("#my-name02").val(data.data.mobile);
                }
                //手机号
                if(data.data.mobile){
                    $("#my-tel-num").text(data.data.mobile);
                }else{
                    $("#btn-bind-phone").swipe({
                        tap:function(){
                            window.location.href="bind-phone.html";
                        }
                    });
                }
                //出生日期
                if(data.data.birthDate){
                    var birthDate=data.data.birthDate;
                    var year=birthDate.slice(0,4);
                    $("#bron-year").val(year);
                }
                //性别
                if(data.data.gender){
                    $("#my-sex").val(data.data.gender);
                }
                //所在城市
                $("#province").val(data.data.province);
                getCity(data.data.province,data.data.city);

            }
        },
        error:function(status){
            if(status.code == 401){
                alert("会话超时，请重新登录");
                window.location = "../login.html";
            }

        }
    });
}
//修改个人信息并提交
function changePersonalInfo(){
    $("#btn-submit-my-info").swipe({
        tap:function(){
            var config={
                name:$("#my-name02").val(),
                gender:$("#my-sex").val(),
                birthDate:$("#bron-year").val()+"-01-01",
                province:$("#province").val(),
                city:$("#city").val()
            };
            $.ajax({
                type:"POST",
                url:"http://www.zhaoduiyisheng.com/api/User/ModifyProfile?sessionId="+window.localStorage.sessionId,
                contentType: "text/plain; charset=UTF-8",
                dataType:"json",
                data:JSON.stringify(config),
                success: function(data){
                    if (data.code == 0){
                        console.log(config);
                        window.location.href="../html/myInfo.html";
                    }else{
                        console.log("修改信息失败")
                    }
                },
                error:function(status){
                    if(status.code == 401){
                        alert("会话超时，请重新登录");
                        window.location = "../login.html";
                    }

                }
            });
        }
    })
}
//修改密码并提交
function changePwdSubmit(){

    $("#btn-submit-pwd").swipe({
        tap:function(){
            var $newPwd01=$("#new-pwd01");
            var $newPwd02=$("#new-pwd02");
            var $changePwdNotice=$("#change-pwd-notice");
            if(!($newPwd01.val()==$newPwd02.val())){
                $changePwdNotice.text("两次密码不一致");
                return false;
            }
            else{
                $changePwdNotice.text("");
                var config={
                    oldPassword:$("#old-pwd").val(),
                    newPassword:$("#new-pwd01").val()
                };
                $.ajax({
                    type:"POST",
                    url:"http://www.zhaoduiyisheng.com/api/User/ModifyPassword?sessionId="+window.localStorage.sessionId,
                    contentType: "text/plain; charset=UTF-8",
                    dataType:"json",
                    data:JSON.stringify(config),
                    success: function(data){
                        if (data.code == 0){
                            $("#change-pwd-notice").text("修改密码成功");
                        }
                        else{
                            $("#change-pwd-notice").text(data.message);
                        }
                    },
                    error:function(status){
                        if(status.code == 401){
                            alert("会话超时，请重新登录");
                            window.location = "../login.html";
                        }

                    }
                });
            }
        }
    })
}
//验证密码格式
function regPwd(regPwd,regNotice){
    var $regPwd=$(regPwd);
    var $regNotice=$(regNotice);
    $regPwd.on("blur",function(){
        var reg=/^\w{6,20}$/;
        if(reg.test($regPwd.val())){
            $regNotice.text("");
            return true;
        }
        else{
            $regNotice.text("密码长度应为6~20个字符（数字、字母、下划线）");
            $regPwd.val("");
            return false;
        }
    });
}
//修改密码判断是否一致
function changePwd(){
    var $newPwd01=$("#new-pwd01");
    var $newPwd02=$("#new-pwd02");
    var $changePwdNotice=$("#change-pwd-notice");
    if(!($newPwd01.val()==$newPwd02.val())){
        $changePwdNotice.text("两次密码不一致");
        return false;
    }
    else{
        $changePwdNotice.text("");
        return true;
    }
}

/*反馈提交*/
$("#feedback-confirm").swipe({
    tap: function(){
         myalert.run("感谢您的宝贵意见，反馈已提交！",function(){
             window.location = '../index.html';
         },function(){
             window.location = '../index.html';
         });
        setTimeout(function(){
            window.location = '../index.html';
        },1000);
    }
});