

$(function(){
    weixinLogin("#btn-w-login");
});

   function weixinLogin(id){
       $(id).swipe({
           tap:function(){
               var appId="wx7d672dee4e236a9f";
               var redirect_uri=encodeURI("http://www.zhaoduiyisheng.com/index.html");
               window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirect_uri+
               "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
           }
       });
   }


