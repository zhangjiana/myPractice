

var config = {
    url:'http://www.zhaoduiyisheng.com/',// 分享的网页链接
    title:'孩子致家人的一封信',// 标题
    desc:"找对医生",// 描述
    img:'http://www.zhaoduiyisheng.com/img/logo.png',// 图片
    img_title:'找对医生',// 图片标题
    from:'找对医生' // 来源
};
var share_obj = new nativeShare('nativeShare',config);
clickShare("#btn-share","#btn-cancel-share","#share-list");
sendMsg("#share-send-msg","我们是找对医生:http://www.zhaoduiyisheng.com/");