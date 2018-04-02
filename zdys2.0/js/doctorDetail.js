
var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";

$(function(){
    $("#back").swipe({
        tap:function(e){
            e.preventDefault();
            var patientUuid = GetQueryString('patientUuid'),
                caseUuid=GetQueryString('caseUuid'),
                clinicService=GetQueryString('clinicService'),
                orderId=GetQueryString('orderId'),
                patientName=GetQueryString('patientName');
            var from=GetQueryString('from');
            if(from=='doctorInfo'){
                window.location='../html/doctorInfo.html';
            }else if(from=='selectService'){
                window.location='../html/selectService.html?patientUuid='+patientUuid+'&caseUuid='+caseUuid+'&clinicService='+clinicService+'&orderId='+orderId;
            }else if(from='serviceProcess'){
                window.location='../html/serviceProcess.html?patientUuid='+patientUuid+'&caseUuid='+caseUuid+'&patientName='+patientName;
            }
        }
    });

    getDoctorInfo();

});

var uuid = GetQueryString("uuid");
var scroll;
function getDoctorInfo(){
    $.ajax({
        type:"GET",
        url:ajaxUrl+"Platform/Doctor/"+uuid,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){
            if (data.code == 0){
                createDoctorInfo(data);
                scroll = new IScroll('#scroll-doctor-detail', { probeType: 3, mouseWheel: true });
            }
            clickShowAllInfo();
        },
        error:function(res){
            if(res.status == 401){
                myalert.tips({
                    txt:"会话超时，请重新登录",
                    fnok:function(){
                        window.location = "../html/newLogin.html";
                    },
                    btn:1
                });

            }
        }
    })
}

function createDoctorInfo(data){
    if(!data.data.avatar){
        data.data.avatar='http://imgcdn.zhaoduiyisheng.com/img/icon/icon_doctor.png';
    }
    $("#doctor-info").html("");
    $("#doctor-name").text(data.data.name);
    var $doctorInfo=$('<div class="doctor-head-pic"><a href="https://www.baidu.com/s?ie=utf-8&fr=bks0000&wd='+data.data.name+'%20'+ data.data.hospital+'"><img src="'+data.data.avatar+'"/></a></div>' +
    '<p><span class="mr16">'+data.data.hospital+'</span><span>'+data.data.sectionName+'</span></p>' +
    '<p><span class="mr16 f30">'+data.data.name+'</span><span>'+data.data.jobTitle+'</span></p>');
    $("#doctor-info").append($doctorInfo);

    $("#doctor-intro").append(data.data.description);
    $("#doctor-specialty").append(data.data.goodAt);

    shareWeixin(data.data.name+' '+data.data.jobTitle,data.data.hospital,window.location.href,data.data.avatar);
}
/*点击展开其余文字*/
function clickShowAllInfo(){
    $(".icon-more").each(function(){
        $(this).swipe({
            tap:function(){
                $(this).toggleClass('icon-close');
                $(this).prev().toggleClass('clamp3');
                scroll.refresh();
            }
        })
    });
}
