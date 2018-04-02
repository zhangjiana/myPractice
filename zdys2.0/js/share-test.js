

$(function(){
    var u = window.navigator.userAgent.toLocaleLowerCase();
    var $shareBtn=$(".share-btn");
    if(u.indexOf("micromessenger") > -1){
        $shareBtn.removeClass('dn');
        $shareBtn.swipe({
            tap:function(){
                var $shareBox=$('<div class="per-info-bot-wrap" id="share-list">' +
                '<div class="weixin-share" id="weixin-share" >' +
                '<img src="http://imgcdn.zhaoduiyisheng.com/img/weixin_share.png"/>' +
                '</div>' +
                '</div>');
                $("body").append($shareBox);
                $('#share-list').swipe({
                    tap:function(e){
                        $(this).remove();
                        e.preventDefault();
                    }
                })
            }
        });
    }
    else{
        $shareBtn.addClass('dn');
    }
});





