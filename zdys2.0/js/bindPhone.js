
var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";

$(function(){
    clearInput();
    showPwd();
    bindPhoneSubmit();
});
//点击叉号清空input
function clearInput(){
    var clearObj={
        clearFun:function(id){
            $(id).on('focus',function(){
                $(this).next().removeClass('dn');
            });
            $(id).on('blur',function(){
                $(this).next().addClass('dn');
            });
        }
    };
    clearObj.clearFun("#bind-phone-num");
    $(".clear-input").swipe({
        tap: function(){
            $(this).prev().val('');
        }
    });
}
//点击眼睛显示密码
function showPwd(){
    $("#bind-eye").swipe({
        tap:function(){
            $(this).toggleClass("eye-on");
            if($("#bind-pwd").attr("type")=="password"){
                $("#bind-pwd").attr("type","text");
            }else{
                $("#bind-pwd").attr("type","password");
            }
        }
    });
}
//提交绑定手机号表单
function bindPhoneSubmit(){
    regPhoneNum("#bind-phone-num","#bind-notice");
    regPwd("#bind-pwd","#bind-notice");
    regCode("#bind-code","#bind-notice");
    getRegCode();
    var $btnReg=$("#btn-bind");
    $btnReg.swipe({
        tap:function(){
            if(bindFormValidation()){
                getReg();
            }
            else{
                console.log("submit:false");
            }
        }
    });
}
//绑定手机号表单验证
function bindFormValidation(){

    if($('#bind-phone-num').triggerHandler('blur')&&$('#bind-pwd').triggerHandler('blur')&&$('#bind-code').triggerHandler('blur')){
        return true;
    }else{
        return false;
    }
}
//获取验证码
function getRegCode(){
    var $getRegCode = $("#get-bind-code");
    $getRegCode.swipe({
        tap:function(){
            if($('#bind-phone-num').triggerHandler('blur')) {
                getCode();
            }
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
        data:"mobile="+$("#bind-phone-num").val()+"&type=bind_mobile",
        success: function(data){
            if(data.code == 0){
                regCode_changeColor($("#get-bind-code"));
                return true;
            }else {
                $('#bind-notice').text(data.message);
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
/*绑定手机号*/
function  getReg(){
    var data = {
        "mobile":$("#bind-phone-num").val(),
        "password":$("#bind-pwd").val(),
        "verifyCode":$("#bind-code").val()

    };
    $.ajax({
        type:"POST",
        url:ajaxUrl+"User/BindMobile?sessionId="+window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        data:JSON.stringify(data),
        success: function(data){
            if(data.code == 0){
                setCookie('user',$("#bind-phone-num").val(),30);
                setCookie('pwd',encrypt($("#bind-pwd").val()),30);
                $("#bind-notice").text("绑定成功");
                return true;
            }else {
                $("#bind-notice").text(data.message);
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
    });
}
