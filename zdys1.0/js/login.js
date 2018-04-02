/**
 * Created by yxf on 2015/12/4.
 */
/*ajax 的 URL*/
window.localStorage.url = "http://www.zhaoduiyisheng.com/api/";
var ajaxUrl = window.localStorage.url;

$(function(){
    //regFormValidation();

    regSubmit();
    loginSubmit();
    resetSubmit();
    getRegCode();


});

//提交注册表单
function regSubmit(){
    regPhoneNum("#reg-phone-num","#reg-notice");
    regPwd("#reg-pwd","#reg-notice");
    regCode("#reg-code","#reg-notice");
    regAcceptService("#reg-check","#reg-notice");
    var $btnReg=$("#btn-reg");
    $btnReg.swipe({
        tap:function(){
             //getReg();
            if(regFormValidation()){

                getReg();
            }
            else{
                console.log("submit:false");
            }
        }
    })
}

//注册表单验证
function regFormValidation(){

    if($('#reg-phone-num').triggerHandler('blur')&&$('#reg-pwd').triggerHandler('blur')&&$('#reg-code').triggerHandler('blur')&&$('#reg-check').hasClass('icon-checked')){
        return true;
    }else{
        if(!$('#reg-check').hasClass('icon-checked')){
            $('#reg-notice').text("您还没有同意找对医生服务条款");
        }
        return false;
    }
}

//提交登录表单
function loginSubmit(){
    //点击眼睛显示密码
    var $eye = $("#icon-eye"),
        $loginPwd = $("#login-pwd"),
        $check = $('#check'),
        $checkicon = $('#icon-check');
    $eye.swipe({
        tap:function(){
            if($eye.hasClass("icon-close-eye")){
                $eye.removeClass("icon-close-eye").addClass("icon-open-eye");
                $loginPwd.attr("type","text");
            }
            else{
                $eye.addClass("icon-close-eye").removeClass("icon-open-eye");
                $loginPwd.attr("type","password");
            }

        }
    });

/*    //点击记住密码
    $check.swipe({
        tap: function(e,target){
            if(target.tagName == 'SPAN'){
                $checkicon.toggleClass('icon-checked');
            }
        }
    });*/

    regPhoneNum("#login-phone-num","#login-notice");
    regPwd("#login-pwd","#login-notice");
    var $btnReg=$("#btn-login");
    $btnReg.swipe({
        tap:function(){
            if(loginFormValidation()){

                console.log("submit:true");
                getLogin();
            }
            else{
                console.log("submit:false");
            }
           /* //在这里判断用户名密码是否正确再记住密码
            if($checkicon.hasClass("icon-checked")){
                saveUserInfo(-1);//记住密码，存储到localStorage
            }
            else{
                saveUserInfo(1);//不记住密码，存储到sessionStorage
            }*/
        }
    })
}
//登录表单验证
function loginFormValidation(){

    if($('#login-phone-num').triggerHandler('blur')&&$('#login-pwd').triggerHandler('blur')){
        getRegCode();
        return true;
    }else{
        return false;
    }

}

/*存储用户登录手机号和密码*/

/*function saveUserInfo(num){
    if(typeof Storage){
        if(num==1){
            sessionStorage.userName=$("#login-phone-num").val();
            sessionStorage.password=$("#login-pwd").val();
        }
        else{
            localStorage.userName=$("#login-phone-num").val();
            localStorage.password=$("#login-pwd").val();
        }
    }
}*/




//提交重置密码表单
function resetSubmit(){
    regPhoneNum("#reset-phone-num","#reset-notice");
    regPwd("#reset-pwd","#reset-notice");
    regCode("#reset-code","#reset-notice");
    var $btnReg=$("#btn-reset-pwd");
    $btnReg.swipe({
        tap:function(){
            if(resetFormValidation()){

                console.log("submit:true");
                getForgotPwd();
            }
            else{
                console.log("submit:false");
            }
        }
    })
}
//重置密码表单验证
function resetFormValidation(){

    if($('#reset-phone-num').triggerHandler('blur')&&$('#reset-pwd').triggerHandler('blur')&&$('#reset-code').triggerHandler('blur')){
        getRegCode();
        return true;
    }else{

        return false;
    }

}




/************公用的方法*************/
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
            $regPwd.val("");
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
    })   ;


}
//同意找对医生服务条款
function regAcceptService(regCheck,regNotice){
    var $regCheck=$(regCheck);
    var $regNotice=$(regNotice);
    $("#reg-accept-service").swipe({
        tap:function(){
            if($regCheck.hasClass("icon-checked")){
                $regCheck.removeClass("icon-checked");
                $regNotice.text("您还没有同意找对医生服务条款");
                return false;
            }
            else{
                $regCheck.addClass("icon-checked");
                $regNotice.text("");
                return true;
            }
        }
    });
}


//获取验证码
function getRegCode(){
    var $getRegCode = $("#get-reg-code");
    var $getResetCode = $("#get-reset-code");
    $getRegCode.swipe({
        tap:function(){
            getCode();
        }
    });
    $getResetCode.swipe({
        tap:function(){
            getCode_forgePwd();
        }
    });


}




/*点击获取验证码 ，验证码开始倒计时*/
function regCode_changeColor(obj){
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


/*获取手机验证码 ajax*/
function  getCode(){
    $.ajax({
        type:"GET",
        url:ajaxUrl+"User/VerifyCode",
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        data:"mobile="+$("#reg-phone-num").val()+"&type=register",
        success: function(data){

            if(data.code == 0){
                regCode_changeColor($("#get-reg-code"));
                return true;
            }else {
                $('#reg-notice').text(data.message);
                return false;
            }
        }
    })
}

/*重置密码  获取手机验证码 ajax*/

function getCode_forgePwd(){
    $.ajax({
        type: "GET",
        url: ajaxUrl+"User/VerifyCode",
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: "mobile=" + $("#reset-phone-num").val() + "&type=forgot_password",
        success: function (data) {
            console.log(data);
            if(data.code == 0){
                regCode_changeColor($("#get-reset-code"));
                return true;
            }else {
                $("#reset-notice").text(data.message);
                return false;
            }
        }
    })
}

/*忘记密码重置，点击重置密码 ajax*/
function getForgotPwd(){
    var data = {
        "mobile":$("#reset-phone-num").val(),
        "password":$("#reset-pwd").val(),
        "verifyCode":$("#reset-code").val()
    };
    $.ajax({
        type: "POST",
        url: ajaxUrl+"User/ResetPassword",
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (data) {
            if( data.code == 0){
                $("#reset-notice").text(data.message);

                setCookie('user',$("#reset-phone-num").val(),30);
                setCookie('pwd',encrypt($("#reset-pwd").val()),30);


                window.localStorage.sessionId = data.data.sessionId;
                window.localStorage.useruuid = data.data.uuid;

                window.location = 'index.html';
            }else {
                console.log('no');
                $("#reset-notice").text(data.message);
                return false;
            }
        }
    })
}


/*注册*/
function  getReg(){
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
                console.log("submit:true");
                setCookie('user',$("#reg-phone-num").val(),30);
                setCookie('pwd',encrypt($("#reg-pwd").val()),30);
                window.localStorage.sessionId = data.data.sessionId;
                window.localStorage.useruuid = data.data.uuid;
                window.location = "index.html";
                return true;
            }else {
                console.log('no');
                $("#reg-notice").text(data.message);
                return false;
            }
        }
    });
}


/*登录*/
function  getLogin(){
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

                console.log('yes');
                setCookie('user',$("#login-phone-num").val(),30);
                setCookie('pwd',encrypt($("#login-pwd").val()),30);
                window.localStorage.sessionId = null;

                window.localStorage.selfUuid = null;
                console.log("clear:"+window.localStorage.selfUuid);
                window.localStorage.sessionId = data.data.sessionId;
                window.localStorage.selfUuid = data.data.uuid;
                console.log("登录时的uuid"+data.data.uuid);
                window.localStorage.removeItem('openid');
                window.location = "index.html";

                return true;
            }else{
                console.log('no');
                $("#login-notice").text(data.message);
                return false;
            }
        },
        error:function(data){
            console.log(data.code);
        }
    })
}

/*页面跳转*/

function startPageAni(btn,page){
    $(btn).swipe({
        tap:function(){
            $(page).css("display","block").siblings().css("display","none");
        }
    });
}

startPageAni("#start-btn-login","#login-page");
startPageAni("#start-btn-reg","#reg-page");
startPageAni("#reg-back","#start-page");
startPageAni("#login-back","#start-page");
startPageAni("#reset-back","#start-page");
startPageAni("#forget-pwd","#reset-page");


// JavaScript Document

function setCookie(name,value,oDay){
    var oTime=new Date();
    var oDate=oTime.getDate();
    oTime.setDate(oDate+oDay);
    document.cookie=name+'='+value+';expires='+oTime;

}

function getCookie(name){
    var str=document.cookie.split('; ');

    for(i=0;i<str.length;i++){
        arr=str[i];
        arr1=arr.split('=');
        if(arr1[0]==name)
            return arr1[1];

    }

    return '';

}
function removeCookie(name){

    setCookie(name,'00',-1);

}

var seed = Math.floor(Math.random() * 0x7f) + 1;
setCookie('seed',seed,30);
function encrypt(s)
{
    var fnl = "", code = 0;
    for(var i = 0; i < s.length; i++){
        code = s.charCodeAt(i) & 0x7f ^ (seed << 7 - i % 8 | seed >> i % 8 | 0x80) & 0xff;
        fnl += code.toString(16);
    }
    return fnl;
};