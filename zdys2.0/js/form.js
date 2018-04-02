
var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";

//提交修改密码表单
function changePwd(){
    regPhoneNum("#change-phone-num","#change-pwd-notice");
    regPwd("#change-pwd","#change-pwd-notice");
    regCode("#change-code","#change-pwd-notice");
    var $btnReg=$("#btn-submit-pwd");
    $btnReg.swipe({
        tap:function(){
            if(changePwdFormVali()){
                console.log("submit:true");
                changePwdSubmit();
            }
            else{
                console.log("submit:false");
            }
        }
    })
}
//修改密码表单验证
function changePwdFormVali(){
    if($('#change-phone-num').triggerHandler('blur')&&$('#change-pwd').triggerHandler('blur')&&$('#change-code').triggerHandler('blur')){
        return true;
    }else{

        return false;
    }

}
/*修改密码后提交ajax*/
function changePwdSubmit(){
    var data = {
        "mobile":$("#change-phone-num").val(),
        "password":$("#change-pwd").val(),
        "verifyCode":$("#change-code").val()
    };
    $.ajax({
        type: "POST",
        url: ajaxUrl+"User/ResetPassword",
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (data) {
            if( data.code == 0){
                //$("#change-pwd-notice").text("修改密码成功");
                myalert.tips({
                    txt: "修改密码成功，点击确定返回上一页",
                    fnok:function (){
                            myalert.remove();
                            $("#page-change-pwd").css("-webkit-transform","translate3d(0,0,0)").css("transform","translate3d(0,0,0)");
                    }
                });
                setCookie('user',$("#change-phone-num").val(),30);
                setCookie('pwd',encrypt($("#change-pwd").val()),30);

                window.localStorage.sessionId = data.data.sessionId;
                window.localStorage.useruuid = data.data.uuid;

            }else {
                $("#change-pwd-notice").text(data.message);
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
//判断验证码为6位数
function regCode(regCode,regNotice){
    var $regCode=$(regCode);
    var $regNotice=$(regNotice);

    $regCode.on("blur keyup",function(){
        if($regCode.val().length == 6){
            $("#btn-submit").removeClass("btn-disable");
            $regNotice.text("");
            return true;
        }
        else {
            $("#btn-submit").addClass("btn-disable");
            $regNotice.text("请输入正确的验证码");
            return false;
        }
    });
}
//点击叉号清空input
function clearInput(){
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
    clearObj.clearFun("#change-phone-num");
    clearObj.clearFun("#default-person-name02");
    $(".clear-input").swipe({
        tap: function(){
            $(this).prev().val('');
        }
    })
}
//点击眼睛显示密码
function showPwd(){
    $("#change-eye").swipe({
        tap:function(){
            $(this).toggleClass("eye-on");
            if($("#change-pwd").attr("type")=="password"){
                $("#change-pwd").attr("type","text");
            }else{
                $("#change-pwd").attr("type","password");
            }
        }
    });
}
//点击获取验证码
function getChangePwdCode(){
    var $getLoginCode = $("#get-change-code");
    $getLoginCode.swipe({
        tap:function(){
            console.log("tap");
            if($('#change-phone-num').triggerHandler('blur')){
                console.log("手机号格式正确");
                if(!$("#get-change-code").hasClass('disable')){
                    console.log("可以发送验证码");
                    getChangeCodeAjax();
                }
            }
        }
    });
}
//获取修改密码验证码ajax
function  getChangeCodeAjax(){
    $.ajax({
        type:"GET",
        url:ajaxUrl+"User/VerifyCode",
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        data:"mobile="+$("#change-phone-num").val()+"&type=forgot_password",
        success: function(data){
            if(data.code == 0){
                getCodeActive($("#get-change-code"));
                return true;
            }else {
                $('#change-pwd-notice').text(data.message);
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
