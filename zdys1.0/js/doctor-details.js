/**
 * Created by zJ on 2015/12/9.
 */


$(function(){

    if(window.localStorage.DoctorInfo){
        createDoctorInfo(window.localStorage.DoctorInfo)
    }else {
        getDoctorInfo();
    }
});

//var uuid = GetQueryString("uuid");
 var uuid = GetQueryString("uuid");
function getDoctorInfo(){

    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Platform/Doctor/"+uuid,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){
            if (data.code == 0){
                var data = JSON.stringify(data);
                window.localStorage.DoctorInfo = data;
                createDoctorInfo(data)
            }
        }
    })

}

function createDoctorInfo(data){
    $("#doctor-wrap").html('');

    var data = JSON.parse(data);
    $(".index-head h1").text(data.data.name);

        var $doctorTop = $('<div class="doctor-head cbo"><em class="db fl">' +
            '<img src='+data.data.avatar+'></em>' +
            '<div class="fr"><p class="cbo f28 mb16">' +
            '<span class="db fl"><em class="f30" data-uuid='+data.data.uuid+'>'+data.data.name+'</em>&nbsp;&nbsp;<em class="f24">'+data.data.jobTitle+'</em></span></p>' +
            '<p class="f24">'+data.data.hospital+'&nbsp;&nbsp;'+data.data.sectionName+'</p>' +
            '<p class="cbo f24 comment">' +
            '<span class="fl">患者好评 <strong class="c-red">9.4</strong>分</span>' +
            '<span class="fr">预约量 <strong class="c-red">120</strong>次</span></p></div></div>');

        var $doctorInstro = $('<div class="doctor-instro"><h3 class="f34">个人简介</h3>' +
                            '<p class="f30 clamp2" id="instro">'+data.data.description+'</p></div>');

        var $doctorPro = $('<div class="doctor-profession"><h3 class="f34">专业特长</h3>' +
            '<p class="f30 clamp2" id="Pro">'+data.data.goodAt+'</p></div>');

        var $doctorSocTitle = $('<div class="doctor-socialTitle"><h3 class="f34">社会职务</h3><p class="f30 clamp2" id="Social">'+data.data.socialTitle+'</p></div>');


    $("#doctor-wrap").append($doctorTop);
    $("#doctor-wrap").append($doctorInstro);
    $("#doctor-wrap").append($doctorPro);
    $("#doctor-wrap").append($doctorSocTitle);

    /*点击展开其余文字*/
    $("#instro").swipe({
        tap:function() {
            $(this).toggleClass('clamp2');
        }
    });
    $("#Pro").swipe({
        tap:function(){
            $(this).toggleClass('clamp2');
        }
    });
    $("#Social").swipe({
        tap:function(){
            $(this).toggleClass('clamp2');
        }
    });

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