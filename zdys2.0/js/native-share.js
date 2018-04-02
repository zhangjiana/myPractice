

var config = {
    url:window.location.href,// 分享的网页链接
    title:$("header h1").text(),// 标题
    desc:"找对医生科普知识",// 描述
    img:'http://www-test.zhaoduiyisheng.com/img/logo01.png',// 图片
    img_title:'找对医生',// 图片标题
    from:'找对医生' // 来源
};
var share_obj = new nativeShare('nativeShare',config);
clickShare("#btn-cancel-share","#share-window");

//点击分享弹出底部菜单
function clickShare(hideBtn,page) {
    $(hideBtn).bind("click",function(){
        event.stopPropagation();
        $(page).addClass("dn");
    })
}
