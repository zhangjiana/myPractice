// JavaScript Document
addEvent(window,'load',function(){
    var oUser = document.getElementById('txt1');
    var oPwd = document.getElementById('txt2');

    var oRandomCode = document.getElementById('txt4');

    oUser.value = getCookie('user');
    addEvent(oUser,'click',function(){
        oUser.value = '';
    });

    addEvent(oUser,'blur',user);
    addEvent(oPwd,'blur',pwd);

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

//记住密码
function choose(){
    var oChoose = document.getElementById('choose');
    var oPwd = document.getElementById('txt2');
    if(oChoose.className == 'not_checked'){
        setCookie('pwd',oPwd.value,7);
        oChoose.className = '_checked';
        return false;
    }
    else{
        oChoose.className = 'not_checked';
        return true;
    }
}
function testpwd(){
    var  oUser = document.getElementById('txt1');
    var  oPwd = document.getElementById('txt2');
    var a = getCookie('user');
    var b = getCookie('pwd');
    if(oUser.value == a && oPwd.value == b){
        return true;
    }
    else{
        return false;
    }
}
function test2fn(){
    var oUser = document.getElementById('txt1');
    if(user()&&pwd()&&randomCode()&&testpwd()){
        setCookie('user',oUser.value,30);
        return true;
    }if(user()&&pwd()&&randomCode()){
        alert('帐号与密码不符，请重新填写！');
        return false;
    }
    else{
        alert("有内容尚未填写，请检查后再点击注册")
        return false;
    }


}