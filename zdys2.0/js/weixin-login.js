

$(function(){
    weixinLogin("#btn-w-login");
});

   function weixinLogin(id){
       $(id).swipe({
           tap:function(e){
               var u = window.navigator.userAgent.toLocaleLowerCase();
               if (u.indexOf("micromessenger") > -1) {
                   var appId="wx14da7f3cb2e1b8ff";
                   var redirect_uri=encodeURI("http://www-test.zhaoduiyisheng.com/index.html");
                   window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirect_uri+
                   "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                   e.preventDefault();
               }else{
                   $("body").append('<div class="f28 c-white centerX alert-free-check" id="alert-wx">试试手机登录吧</div>');
                   setTimeout(function() {
                       var $free=$('#alert-wx');
                       $free.fadeOut(500);
                       $free.remove();
                   }, 2000);
               }

           }
       });
   }


