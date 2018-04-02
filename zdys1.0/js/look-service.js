/**
 * Created by yxf on 2015/12/9.
 */


$(function(){

    //查看不同服务
    lookService();
});

//查看不同服务
function lookService(){
    var $serviceStyle=GetQueryString("service");
    var $topTitle=$("#top-title");
    if($serviceStyle=="local"){
        $topTitle.text("本地医生咨询服务价格");
        $("#look-service").html("");//清空原有列表
        //调用本地服务列表
        var data01={
            type:"local"
        };
        lookServiceAjax(data01);
    }
    else{
        $topTitle.text("异地医生咨询服务价格");
        //调用异地服务列表
        var data02={
            type:"remote"
        };
        lookServiceAjax(data02);
    }
}
//请求ajax
function lookServiceAjax(config){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Platform/ServiceList",
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        data:config,
        success: function(data){
            if(data.code == 0){
                console.log(data);

                    //window.localStorage.serviceuuid = data.data[i].uuid;
                    createSerList(data);

            }
        }
    })
}
//创建服务列表结构
function createSerList(data){
    if(data.data.length){
        $("#look-service").html("");
        $.each(data.data,function(i){
            var $serviceDiv=$(' <div class="basic-info-wrap cbo mb16 look-service-wrap" data-type='+data.data[i].type+'>' +
                '<div class="look-service-detail cbo">' +
                '<h2 class="look-service-title fl f34">'+data.data[i].name+'</h2>' +
                '<div class="fl f28 c-red mt24">' +
                '<span class="service-price">'+data.data[i].servicePrice+'</span></div></div>' +
                '<div class="look-service-explain f28">'+data.data[i].description+'</div><div>' +
                '<a class="db fr f28 select-service-btn mt50 mb20" href="../html/appoint.html">支付</a></div></div>');
            $("#look-service").append($serviceDiv);
        });
    }

    //显示价格
    showPrice();
}
//显示价格
function showPrice(){
    var $price=$(".service-price");
    for(var i=0;i<$price.length;i++){
        $price.eq(i).text(formatPrice($price.eq(i).text()));
    }
}

//获取地址中的信息
function GetQueryString(name){
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*返回参数值*/
    if(r!=null){
        return  decodeURI(r[2]);
    }
    else{
        return null;
    }

}
//价格格式化
function formatPrice(s){
    if(/[^0-9\.]/.test(s)) return "invalid value";
    s=s.replace(/^(\d*)$/,"$1.");
    s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
    s=s.replace(".",",");
    var re=/(\d)(\d{3},)/;
    while(re.test(s))
        s=s.replace(re,"$1,$2");
    s=s.replace(/,(\d\d)$/,".$1");
    return "￥" + s.replace(/^\./,"0.")
}