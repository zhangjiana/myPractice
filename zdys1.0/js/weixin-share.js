

$(function(){
    getConfig();
    $("#share-list").swipe({
        tap:function(){
            this.addClass("dn");
        }
    });
    knowledgeShare();
});

function knowledgeShare(){
    $("#btn-good").swipe({
        tap:function(){
            $("#share-list").removeClass("dn");
        }
    });
}

//微信获取接口权限配置项
function getConfig(){
    var config={
        url:"http://www.zhaoduiyisheng.com/index.html"
    };
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Weixin/Signature",
        contentType: "text/plain; charset=UTF-8",
        dataType:"json",
        data:config,
        success:function(data){
            if(data.code==0){
                wx.config({
                    debug: false,
                    appId: data.data.appId,//必填，公众号的唯一标识
                    timestamp: data.data.timestamp,// 必填，生成签名的时间戳
                    nonceStr: data.data.nonceStr,// 必填，生成签名的随机串
                    signature: data.data.signature,// 必填，签名，见附录1
                    jsApiList: [
                        'onMenuShareTimeline',//微信朋友圈
                        'onMenuShareAppMessage',//微信好友
                        'onMenuShareQQ'//QQ
                    ]
                });
                weixinShare();
            }

        }

    });
}


function weixinShare() {

    var title="孩子致家人的一封信";
    var desc="找对医生";
    var link="http://www.zhaoduiyisheng.com/";
    var imgUrl="http://www.zhaoduiyisheng.com/img/logo.png";
    var opt = {
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        //trigger: function (res) {
        //    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        //    alert('用户点击发送给朋友');
        //},
        success: function (res) {

            $("#share-window").css("display","block");
            //点击右上角关闭弹窗
            $("#btn-close-share").swipe({
                tap:function(){
                    $("#share-window").css("display","none");
                }
            });
            //alert('已分享');
        },
        cancel: function (res) {

            //alert('已取消');
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
        }
    };
    // 2.1 监听“分享给微信朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage(opt);
        //alert('已注册获取“发送给朋友”状态事件');

    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline(opt);
        //alert('已注册获取“分享到朋友圈”状态事件');

    // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareQQ(opt);
        //alert('已注册获取“分享到 QQ”状态事件');

}
