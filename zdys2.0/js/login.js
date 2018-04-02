

var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";
$(function(){
    $("#btn-m-login").swipe({
        tap:function(){
            window.location='login.html';
        }
    });
    localStorage.clear();
    sessionStorage.clear();
    removeCookie('user');
    //login and reg 交互效果
    for(var i in login){
        login[i]();
    }
    //表单验证
    for(var j in formValidate){
        formValidate[j]();
    }
    $("#login-phone-num").on('input', valiLoginForm);
    $("#login-phone-num").on('propertychange', valiLoginForm);
    $("#login-pwd").on('input', valiLoginForm);
    $("#login-pwd").on('propertychange', valiLoginForm);

    $("#reg-phone-num").on('input', valiRegForm);
    $("#reg-phone-num").on('propertychange', valiRegForm);
    $("#reg-pwd").on('input', valiRegForm);
    $("#reg-pwd").on('propertychange', valiRegForm);
    $("#reg-code").on('input', valiRegForm);
    $("#reg-code").on('propertychange', valiRegForm);

    function valiLoginForm(){
        if($("#login-phone-num").val()&&$("#login-pwd").val()){
            $("#btn-login").removeClass("opacity78");
        }else{
            $("#btn-login").addClass("opacity78");
        }
    }
    function valiRegForm(){
        if($("#reg-phone-num").val()&&$("#reg-pwd").val()&&$("#reg-code").val()){
            $("#btn-reg").removeClass("opacity78");
        }else{
            $("#btn-reg").addClass("opacity78");
        }
    }
});
//login and reg 交互效果
var login= {
    tabChange: function () {
        $("#btn-tab span").swipe({
            tap: function () {
                var $index = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                $("#page-box>div").eq($index).removeClass("dn").siblings().addClass("dn");
            }
        });
    },
    loginStyle:function(){
        $("#btn-login-msg").swipe({
            tap:function(){
                if($("#input-code").hasClass("dn")){
                    $(this).text("用密码登录");
                    $("#input-code").removeClass("dn").prev().addClass("dn");
                }else{
                    $(this).text("用短信验证码登录(免密码)");
                    $("#input-code").addClass("dn").prev().removeClass("dn");
                }
            }
        })
    },
    clearInput:function(){
        var clearObj={
            clearFun:function(id){
                $(id).on('focus',function(){
                    $(this).next().removeClass('dn');
                });
                $(id).on('blur',function(){
                    $(this).next().addClass('dn');
                })
            }
        };
        clearObj.clearFun("#login-phone-num");
        clearObj.clearFun("#login-pwd");
        clearObj.clearFun("#reg-phone-num");
        $(".clear-input").swipe({
            tap: function(){
                $(this).prev().val('');
            }
        })
    },
    //点击眼睛显示密码
    showPwd:function(){
        $("#reg-eye").swipe({
            tap:function(){
                $(this).toggleClass("eye-on");
                if($("#reg-pwd").attr("type")=="password"){
                    $("#reg-pwd").attr("type","text");
                }else{
                    $("#reg-pwd").attr("type","password");
                }
            }
        });
    }
};
//表单验证
var formValidate={
    dateFormat:function(){
        //login表单验证
        regPhoneNum("#login-phone-num","#login-notice");
        regPwd("#login-pwd","#login-notice");
        regCode("#login-code","#login-notice");
        //reg表单验证
        regPhoneNum("#reg-phone-num","#reg-notice");
        regPwd("#reg-pwd","#reg-notice");
        regCode("#reg-code","#reg-notice");
        //验证手机号格式
        function regPhoneNum(regPhoneNum,regNotice){
            var $regPhoneNum=$(regPhoneNum);
            var $regNotice=$(regNotice);
            $regPhoneNum.on("blur",function(){
                var reg=/^1[3|4|5|7|8][0-9]{9}$/;
                if(reg.test($regPhoneNum.val())){
                    $regNotice.text("");
                    return true;
                }
                else{
                    $regNotice.text("您输入的手机号无效");
                    return false;
                }
            });
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
                    return false;
                }
            });
        }
        //判断验证码为6位数
        function regCode(regCode,regNotice){
            var $regCode=$(regCode);
            var $regNotice=$(regNotice);
            $regCode.on("blur",function(){
                if($regCode.val().length == 6){
                    return true;
                }
                else {
                    $regNotice.text("请输入正确的验证码");
                    return false;
                }
            });
        }
    },
    getCode:function(){
        var $getRegCode = $("#get-reg-code");
        var $getLoginCode = $("#get-login-code");
        $getRegCode.swipe({
            tap:function(){
                if($('#reg-phone-num').triggerHandler('blur')) {
                    if (!$("#get-reg-code").hasClass('disable')) {
                        getRegCodeAjax();
                    }
                }
            }
        });
        $getLoginCode.swipe({
            tap:function(){
                //console.log("tap");
                if($('#login-phone-num').triggerHandler('blur')){
                    console.log("手机号格式正确");
                    if(!$("#get-login-code").hasClass('disable')){
                        //console.log("可以发送验证码");
                        getLoginCodeAjax();
                    }
                }
            }
        });
        //获取注册验证码
        function  getRegCodeAjax(){
            $.ajax({
                type:"GET",
                url:ajaxUrl+"User/VerifyCode",
                contentType: "text/plain; charset=UTF-8",
                dataType:'json',
                data:"mobile="+$("#reg-phone-num").val()+"&type=register",
                success: function(data){
                    if(data.code == 0){
                        getCodeActive($("#get-reg-code"));
                        return true;
                    }else {
                        $('#reg-notice').text(data.message);
                        return false;
                    }
                },
                error:function(res){
                    if(res.status == 401){
                        myalert.tips({
                            txt:"会话超时，请重新登录",
                            fnok:function(){
                                window.location = "../html/newLogin.html";
                            },
                            btn:1
                        });

                    }
                }
            })
        }
        //获取登录验证码
        function  getLoginCodeAjax(){
            $.ajax({
                type:"GET",
                url:ajaxUrl+"User/VerifyCode",
                contentType: "text/plain; charset=UTF-8",
                dataType:'json',
                data:"mobile="+$("#login-phone-num").val()+"&type=login",
                success: function(data){
                    if(data.code == 0){
                        getCodeActive($("#get-login-code"));
                        return true;
                    }else {
                        $('#login-notice').text(data.message);
                        return false;
                    }
                },
                error:function(res){
                    if(res.status == 401){
                        myalert.tips({
                            txt:"会话超时，请重新登录",
                            fnok:function(){
                                window.location = "../html/newLogin.html";
                            },
                            btn:1
                        });

                    }
                }
            })
        }
        /*点击获取验证码 ，验证码开始倒计时*/
        function getCodeActive(obj){
            console.log("已发送验证码");
            var $getRegCode = obj;
            if (!$getRegCode.hasClass('disable')) {
                $getRegCode.addClass('disable');
                var iSecond = 60;
                var timer;
                $getRegCode.text(iSecond + "s");
                iSecond--;
                timer = setInterval(function () {
                    if (iSecond < 0) {
                        $getRegCode.text("重新获取");
                        clearInterval(timer);
                        $getRegCode.removeClass('disable');
                    } else {
                        $getRegCode.text(iSecond + "s");
                        iSecond--;
                    }
                }, 1000);
            }
        }
    },
    clickLogin:function(){
        var $btnLogin=$("#btn-login");
        $btnLogin.swipe({
            tap:function(e){
                //密码登录
                if($("#input-code").hasClass("dn")){
                    if(pwdLoginVali()){
                        //console.log("pwd login submit:true");
                        pwdlogin();
                        /*登录ajax*/
                        function pwdlogin(){
                            var  data = {
                                "mobile":$("#login-phone-num").val(),
                                "password":$("#login-pwd").val()
                            };
                            $.ajax({
                                type:"POST",
                                url:ajaxUrl+"User/Login",
                                contentType: "text/plain; charset=UTF-8",
                                dataType:'json',
                                data:JSON.stringify(data),
                                success:function(data){
                                    console.log(data);
                                    if( data.code == 0){
                                        window.localStorage.bootstrap=data.data.bootstrap;
                                        setCookie('user',$("#login-phone-num").val(),30);
                                        setCookie('pwd',encrypt($("#login-pwd").val()),30);
                                        window.localStorage.sessionId = null;
                                        window.localStorage.selfUuid = null;
                                        window.localStorage.sessionId = data.data.sessionId;
                                        window.localStorage.selfUuid = data.data.uuid;
                                        window.localStorage.removeItem('openid');
                                        if (data.data.openid) {
                                            window.localStorage.openid = data.data.openid;
                                        }
                                        window.location = "../index.html";
                                        return true;
                                    }else{
                                        console.log('no');
                                        $("#login-notice").text(data.message);
                                        return false;
                                    }
                                },
                                error:function(res){
                                    if(res.status == 401){
                                        myalert.tips({
                                            txt:"会话超时，请重新登录",
                                            fnok:function(){
                                                window.location = "../html/newLogin.html";
                                            },
                                            btn:1
                                        });

                                    }
                                }
                            })
                        }
                    }else{
                        //console.log("pwd login submit:false");
                    }
                }
                //短信登录
                else{
                    if(msgLoginVali()){
                        //console.log("msg login submit:true");
                        $("#btn-login").removeClass("opacity78");
                        msgLogin();
                        /*登录ajax*/
                        function msgLogin(){
                            var  data = {
                                "mobile":$("#login-phone-num").val(),
                                "verifyCode":$("#login-code").val()
                            };
                            $.ajax({
                                type:"POST",
                                url:ajaxUrl+"User/SmsLogin",
                                contentType: "text/plain; charset=UTF-8",
                                dataType:'json',
                                data:JSON.stringify(data),
                                success:function(data){
                                    console.log(data);
                                    if( data.code == 0){
                                        window.localStorage.bootstrap=data.data.bootstrap;
                                        setCookie('user',$("#login-phone-num").val(),30);
                                        window.localStorage.sessionId = null;
                                        window.localStorage.selfUuid = null;
                                        window.localStorage.sessionId = data.data.sessionId;
                                        window.localStorage.selfUuid = data.data.uuid;
                                        window.localStorage.removeItem('openid');
                                        if (data.data.openid) {
                                            window.localStorage.openid = data.data.openid;
                                        }
                                        window.location.href="../index.html";
                                        return true;
                                    }else{
                                        console.log('no');
                                        $("#login-notice").text(data.message);
                                        return false;
                                    }
                                },
                                error:function(res){
                                    if(res.status == 401){
                                        myalert.tips({
                                            txt:"会话超时，请重新登录",
                                            fnok:function(){
                                                window.location = "../html/newLogin.html";
                                            },
                                            btn:1
                                        });

                                    }
                                }
                            })
                        }
                    }else{
                        //console.log("msg login submit:false");
                        $("#btn-login").addClass("opacity78");
                    }
                }
                e.preventDefault();
                function pwdLoginVali(){
                    return $('#login-phone-num').triggerHandler('blur')&&$('#login-pwd').triggerHandler('blur');
                }
                function msgLoginVali(){
                    return $('#login-phone-num').triggerHandler('blur')&&$('#login-code').triggerHandler('blur');
                }
            }
        })
    },
    clickReg:function(){
        var $btnReg=$("#btn-reg");
        $btnReg.swipe({
            tap:function(){
                if(regFormVali()){
                    //console.log("reg submit:true");
                    regAjax();
                    /*注册ajax*/
                    function regAjax(){
                        var data = {
                            "mobile":$("#reg-phone-num").val(),
                            "password":$("#reg-pwd").val(),
                            "verifyCode":$("#reg-code").val()
                        };
                        $.ajax({
                            type:"POST",
                            url:ajaxUrl+"User/Register",
                            contentType: "text/plain; charset=UTF-8",
                            dataType:'json',
                            data:JSON.stringify(data),
                            success: function(data){
                                if(data.code == 0){
                                    window.localStorage.bootstrap=data.data.bootstrap;
                                    setCookie('user',$("#reg-phone-num").val(),30);
                                    setCookie('pwd',encrypt($("#reg-pwd").val()),30);
                                    window.localStorage.sessionId = data.data.sessionId;
                                    window.localStorage.useruuid = data.data.uuid;
                                    window.location = "../index.html";
                                    return true;
                                }else {
                                    $("#reg-notice").text(data.message);
                                    return false;
                                }
                            },
                            error:function(res){
                                if(res.status == 401){
                                    myalert.tips({
                                        txt:"会话超时，请重新登录",
                                        fnok:function(){
                                            window.location = "../html/newLogin.html";
                                        },
                                        btn:1
                                    });

                                }
                            }
                        });
                    }
                }else{
                    //console.log("reg submit:false");
                }
                function regFormVali(){
                    return $('#reg-phone-num').triggerHandler('blur')&&$('#reg-pwd').triggerHandler('blur')&&$('#reg-code').triggerHandler('blur');
                }
            }
        })
    }
};


