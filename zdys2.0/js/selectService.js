
var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";
var scroll = new IScroll('#scroll-select-service', { probeType: 3, mouseWheel: true });

var patientUuid = GetQueryString('patientUuid'),
    caseUuid=GetQueryString('caseUuid'),
    clinicService=GetQueryString('clinicService'),
    sliceService='',
    orderId=GetQueryString('orderId'),
    serviceName='',
    payHref='';
$(function(){
    var index=clinicService.indexOf('_');
    sliceService=clinicService.slice(0,index);
    console.log(sliceService);
    getDoctorList();
    $("#back").swipe({
        tap: function(e){
            window.location.href = "../html/familyInfo.html?patientUuid="+patientUuid;
            e.preventDefault();
        }
    })

});
function getDoctorList(){
    $.ajax({
        type:"GET",
        url:ajaxUrl+"Patient/CaseService?sessionId="+window.localStorage
.sessionId+"&patientUuid="+patientUuid+"&caseUuid="+caseUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){
            if (data.code == 0){
                createDoctorList(data);
                scroll.refresh();
            }
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
    }).success(function(){
        getServiceList();
        var $doctorLen=$(".service-doctor-list").children().length;
        var numArr=['一','二','三','四','五','六'];
        $("#doctor-num").text(numArr[$doctorLen-1]);
    });
}
function createDoctorList(data){
    var $wrap=$('<div class="select-wrap f30"></div>');

    if(data.data.remote.length){
        if(sliceService=='remote'){
            var remoteArr=data.data.remote;
            var $doctorUl=$('<ul class="service-doctor-list cbo pr30" id="remote-doctor"></ul>');
            for(var i=0;i<remoteArr.length;i++){
                if(!remoteArr[i].avatar){
                    remoteArr[i].avatar='http://imgcdn.zhaoduiyisheng.com/img/icon/icon_doctor_big.jpg';
                }
                var $doctor=$('<li class="doctor-item">'+
                '<a href="doctorDetail.html?from=selectService&patientUuid='+patientUuid+'&caseUuid='+caseUuid+'&clinicService='+clinicService+'&orderId='+orderId+'&uuid='+remoteArr[i].uuid+'">'+
                '<div class="doctor-head tc" style="background-image: url('+remoteArr[i].avatar+')"></div>'+
                '<div class="doctor-name cbo">'+
                '<p class="f28 mt20">'+remoteArr[i].name+'</p>'+
                '<p class="f20 c-66 mt06 job-title">'+remoteArr[i].jobTitle+'</p>'+
                '</div></a></li>');
                $doctorUl.append($doctor);
            }
        }
    }

    if(data.data.local.length){
        if(sliceService=='local'){
            var localArr=data.data.local;
            var $doctorUl=$('<ul class="service-doctor-list cbo" id="face-doctor"></ul>');
            for(var i=0;i<localArr.length;i++){
                if(!localArr[i].avatar){
                    localArr[i].avatar='http://imgcdn.zhaoduiyisheng.com/img/icon/icon_doctor_big.jpg';
                }
                var $doctor=$('<li class="doctor-item">'+
                '<a href="doctorDetail.html?from=selectService&patientUuid='+patientUuid+'&caseUuid='+caseUuid+'&clinicService='+clinicService+'&orderId='+orderId+'&uuid='+localArr[i].uuid+'">'+
                '<div class="doctor-head tc" style="background-image: url('+localArr[i].avatar+')"></div>'+
                '<div class="doctor-name cbo">'+
                '<p class="f28 mt20">'+localArr[i].name+'</p>'+
                '<p class="f20 c-66 mt06 job-title">'+localArr[i].jobTitle+'</p>'+
                '</div></a></li>');
                $doctorUl.append($doctor);
            }
        }
    }
    $wrap.append($doctorUl);
    $("#service-box").prepend($wrap);

}
function getServiceList(){
    $.ajax({
        type:"GET",
        url:ajaxUrl+"Platform/Service/"+clinicService,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(res){
            if (res.code == 0){
                var $serviceTop=$(' <div class="service-title prl30 cbo">'+
                '<h2 class="fl f30 c-33 icon-remote">'+res.data.name+'</h2>'+
                '<span class="fr c-red service-price">'+res.data.servicePrice+'</span>'+
                '</div>');
                serviceName=res.data.name;
                $("#service-box>div").first().prepend($serviceTop);
            }
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
    }).success(function(){
        goPay();
        showPrice();
    })
}
function goPay(){
    $("#btn-pay").swipe({
        tap:function(){
            payHref='../html/pay.html?patientUuid='+patientUuid+
            '&caseUuid='+caseUuid+'&serviceType='+clinicService+'&clinicService='
            +serviceName+'&orderId='+orderId;
            window.location.href=payHref;
        }
    })
}
