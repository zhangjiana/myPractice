// JavaScript Document
// JavaScript Document


addEvent(window,'load',function(){
    var oUser = document.getElementById('txt1');
    var oPwd = document.getElementById('txt2');
    var oAg_pwd = document.getElementById('txt3');
    var oRandomCode = document.getElementById('txt4');
    var P1 = document.getElementById('p1');

    addEvent(oUser,'click',function(){
        oUser.value = '';
    })

    addEvent(oUser,'blur',user);
    addEvent(oPwd,'blur',pwd);
    addEvent(oAg_pwd,'blur',agpwd);
    addEvent(oRandomCode,'blur',randomCode);


    var oChoose = document.getElementById('choose');
    addEvent(oChoose,'click',choose);




})

function user(){
    var that = document.getElementById('txt1');

    var P1 = document.getElementById('p1');
    var re1 = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/;
    var re2= /^1[3|5|7|8|9][0-9]{9}$/
    if((re1.test(that.value))||(re2.test(that.value))){
            P1.style.display='none';
            return true;
    }
    else if(!that.value) {

            P1.style.display = 'block';
           // that.focus();
            return false;
        }
    else{

            P1.innerHTML = "请输入正确手机号或邮箱号";
            P1.style.display = 'block';
           // that.focus();
            return false;
    }

}

function pwd(){
    var that=document.getElementById('txt2');
    var P2=document.getElementById('p2');
    var re2=/^[a-zA-Z0-9]{6,16}$/
    if(re2.test(that.value)){
        P2.style.display='none';
        return true;
        }
    else if(!that.value) {

        P2.style.display = 'block';
        //that.focus();
        return false;
    }
    else{
        P2.innerHTML = "密码输入长度在6-16之间"
        P2.style.display = 'block';
       // that.focus();
        return false;
        }
    }
function agpwd(){
    var that = document.getElementById('txt3');
    var P3 = document.getElementById('p3');
    var oPwd = document.getElementById('txt2');
    if(that.value == oPwd.value){
        P3.style.display = 'none';
        return true;
    }
    else if(!that.value){
        P3.style.display = 'block';
       // that.focus();
        return false;
    }
    else{
        P3.innerHTML = '两次输入密码不一致，请重新输入'
        P3.style.display = 'block';
       // that.focus();
        return false;
    }
}
function randomCode(){
    var that = document.getElementById('txt4');
    var P4 = document.getElementById('p4');
    var re4 = /^jiwchb$/i;
    if(re4.test(that.value)){

        P4.style.display = 'none';
        return true;
    }
    else{
        P4.style.display = 'block';
        return false;
    }
}
function choose(){
    var oChoose = document.getElementById('choose');
    if(oChoose.className == 'not_checked'){
        oChoose.className = '_checked';
        return true;
    }
    else{
        oChoose.className = 'not_checked';
        return false;
    }
}
function testfn(){
    var oUser = document.getElementById('txt1');
    var oPwd = document.getElementById('txt2');
    if(user()&&pwd()&&agpwd()&&randomCode()){

        setCookie('user',oUser.value,30);
        setCookie('pwd',oPwd.value,7);
        return true;

    }
    else{
        alert("有内容尚未填写，请检查后再点击注册");
        return false;
    }


}