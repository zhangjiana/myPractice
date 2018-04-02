
$(function(){
    var scroll = new IScroll('#scroll-process', { probeType: 3, mouseWheel: true });
    var flag=false;
    var orderId;
    if(GetQueryString("patientName")){
        var patientName=GetQueryString("patientName");
        $("#patient-name").text(GetQueryString("patientName"));
    }
    if(GetQueryString("caseUuid")){
        var caseUuid=GetQueryString("caseUuid");
    }
    if(GetQueryString("patientUuid")){
        var patientUuid=GetQueryString("patientUuid");
    }
    getServiceProcess(patientUuid);
    //订单跟踪时间截取
    function sliceTime(time){
        if(time === null){
            time = '';
        }else{
            time = time.split('');
            time[10]='<br>';
            time = time.join('');
            time=time.slice(2);
        }
        return time;
    }
    /*查询找对医生的服务流程*/
    function getServiceProcess() {
        $.ajax({
            type: 'GET',
            url: 'http://www-test.zhaoduiyisheng.com/api/Patient/ServiceProcess?sessionId=' + window.localStorage.sessionId + "&patientUuid=" + patientUuid +"&caseUuid="+caseUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function (d) {
                if (d.code == 0) {
                    var dataB = d.data,time='',$serviceBox=$("#service-pro-box");
                    if(dataB.selected.state){
                        time = dataB.selected.time;
                        time = sliceTime(time);
                        var $selectSer=$('<div class="container">'+
                        '<div class="service-pro-time">'+
                        '<span class="icon icon-clock"></span>'+
                        '<p class="f20 mb20 tc">'+time+'</p>'+
                        '</div>'+
                        '<div class="service-pro-notice sub mr30">'+
                        '<p class="f30 pt30 mb20">您已预约服务</p>'+
                        '<p class="f24 mb20">您已为<span>'+patientName+'</span><span id="caseName"></span>的病例选择了<span id="service-name02"></span>服务</p>'+
                        '</div>'+
                        '</div>');

                        $serviceBox.prepend($selectSer);
                    }
                    if(dataB.caseUuid){
                        if(dataB.matched.state){
                            time = dataB.matched.time;
                            time = sliceTime(time);
                            var $matchDoctor=$('<div class="container">'+
                            '<div class="service-pro-time">'+
                            '<span class="icon icon-clock"></span>'+
                            '<p class="f20 mb20 tc">'+time+'</p>'+
                            '</div>'+
                            '<div class="be5-b service-pro-notice sub mr30">'+
                            '<p class="f30 pt30 mb20">精准匹配专家</p>'+
                            '<p class="f24 mb20">已经为您匹配六名专家</p>'+
                            '<a id="look-doctor" class="btn fr btn-service mb20" href="#">去查看</a>'+
                            '</div>'+
                            '</div>');
                            $serviceBox.prepend($matchDoctor);
                        }
                        if(dataB.paid.state){
                            time = dataB.paid.time;
                            time = sliceTime(time);
                            var $paid=$('<div class="container">'+
                            '<div class="service-pro-time">'+
                            '<span class="icon icon-clock"></span>'+
                            '<p class="f20 mb20 tc">'+time+'</p>'+
                            '</div>'+
                            '<div class="be5-b service-pro-notice sub mr30">'+
                            '<p class="f30 pt30 mb20">立即支付</p>'+
                            '<p class="f24 mb20">您已经付款完成，正在帮您预约名医</p>'+
                            '</div>'+
                            '</div>');
                            $serviceBox.prepend($paid);
                            $("#look-doctor").remove();
                            $("#go-pay").remove();

                        }else if(dataB.matched.state){
                            var $paid=$('<div class="container">'+
                            '<div class="service-pro-time">'+
                            '<span class="icon icon-clock"></span>'+
                            '<p class="f20 mb20 tc">'+time+'</p>'+
                            '</div>'+
                            '<div class="be5-b service-pro-notice sub mr30">'+
                            '<p class="f30 pt30 mb20">立即支付</p>'+
                            '<p class="f24 mb20">您还没有付款</p>'+
                            '<a class="btn fr btn-service mb20" ' +
                            'href="pay.html" id="go-pay">去付款</a>'+
                            '</div>'+
                            '</div>');
                            $serviceBox.prepend($paid);
                        }
                        if(dataB.appointed.state){
                            time = dataB.appointed.time;
                            time = sliceTime(time);
                            flag=true;
                            var $appointDoctor=$('<div class="container" id="match-doctor">'+
                            '<div class="service-pro-time w106">'+
                            '</div>'+
                            '<div class="service-pro-notice sub" id="doctor-detail">'+
                            '<p class="f30 pt30 mb20 c-cyan">成功预约名医</p>'+
                            '</div>'+
                            '</div>');
                            $serviceBox.prepend($appointDoctor);

                            var $appointTime=$('<div class="container">'+
                            '<div class="service-pro-time">'+
                            '<span class="icon icon-clock"></span>'+
                            '<p class="f20 mb20 tc">'+time+'</p>'+
                            '</div>'+
                            '<div class="be5-b service-pro-notice sub mr30">'+
                            '<p class="f30 pt30 mb20">预约时间</p>'+
                            '<p class="f24 mb20 appoint-time">'+
                            '您的预约时间为'+dataB.clinicTime+'，您可以点击服务通知查看详情</p>'+
                            '<a class="btn fr btn-service mb20" id="btn-notice" href="">服务通知</a>'+
                            '</div>'+
                            '</div>');
                            $serviceBox.prepend($appointTime);

                        }
                        if(dataB.finished.state){
                            $("#doctor-detail .c-cyan").removeClass("c-cyan");
                            time = dataB.finished.time;
                            time = sliceTime(time);
                            var $finishSer=$('<div class="container">'+
                            '<div class="service-pro-time">'+
                            '<span class="icon icon-clock"></span>'+
                            '<p class="f20 mb20 tc">'+time+'</p>'+
                            '</div>'+
                            '<div class="be5-b service-pro-notice sub mr30"'+
                            'id="complete-service">'+
                            '<p class="f30 pt30 mb20">服务完成</p>'+
                            '<p class="f24 mb20" id="serFinish">您的服务已经完成，感谢您对找对医生的信赖！</p>'+
                            '</div>'+
                            '</div>');
                            $("#service-pro-box").prepend($finishSer);
                        }
                    }
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
            lookCaseDetail();
            scroll.refresh();
        })
    }
    function lookCaseNotice(){
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/CaseNotice?sessionId=" + window.localStorage.sessionId+
            "&patientUuid="+patientUuid+"&caseUuid="+caseUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    if(data.data.serviceName){
                        $("#service-name").text(data.data.serviceName);
                        $("#service-name02").text(data.data.serviceName);
                    }else{
                        $("#service-name").text("您还没有选择服务");
                    }
                    if(flag&&data.data.doctor){
                        var $doctorInfo=$(' <div class="f24 cbo mr30 be5-b">'+
                        '<a href="../html/doctorDetail.html'+window.location.search+'&uuid='+data.data.doctor.uuid+'&from=serviceProcess'+'" class="db cbo">'+
                        '<div class="fl service-person-head mr12"><img '+
                        'src="'+data.data.doctor.avatar+'"/></div>'+
                        '<div class="fl">'+
                        '<p class="mt10">'+
                        '<span class="f28 mr12">'+data.data.doctor.name+'</span>'+
                        '<span class="f24">'+data.data.doctor.jobTitle+'</span>'+
                        '</p>'+
                        '<p class="f28 mt10">'+data.data.clinicLocation+'</p>'+
                        '</div>'+
                        '<a class="btn fr btn-service mb20" href="../html/doctorDetail.html'+window.location.search+'&uuid='+data.data.doctor.uuid+'&from=serviceProcess">去查看</a>'+
                        '</a>'+
                        '</div>');
                        $("#doctor-detail").append($doctorInfo);
                    }else{
                        $("#match-doctor").remove();
                    }
                    $("#go-pay").attr("href",'../html/pay.html?patientUuid='+data.data.patientUuid+
                    '&caseUuid='+data.data.caseUuid+'&serviceType='+data.data.clinicService+'&clinicService='
                    +data.data.serviceName+'&orderId='+orderId);
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
        })

    }

    function lookCaseDetail(){
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/Case?sessionId=" + window.localStorage.sessionId+ "&caseUuid="+caseUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function (res) {
                if (res.code == 0) {
                    if(res.data.patient.avatar){
                        if(res.data.patient.avatar.indexOf('http')>-1){
                            $("#service-person-head").html('<img src="'+res.data.patient.avatar+'"/>');
                        }else{
                            $("#service-person-head").html('<img src="http://imgcdn.zhaoduiyisheng.com/img/head/'+res.data.patient.avatar+'"/>');
                        }
                    }else{
                        $("#service-person-head").html('<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png"/>');
                    }
                    var clinicService=res.data.clinicService;
                    var index=clinicService.indexOf('_');
                    var sliceService=clinicService.slice(0,index);

                    if(res.data.videoUrl){
                        if(sliceService=='remote'){
                            var $videoUrl=$('<span>咨询视频请点击链接查看'+
                            '<a class="video-url c-cyan" href="'+res.data.videoUrl+'">'+res.data.videoUrl+'</a>'+
                            '</span>');
                            $("#serFinish").append($videoUrl);
                        }

                    }
                    $("#orderId").text(res.data.orderId);
                    orderId=res.data.orderId;
                    $("#caseName").text(res.data.caseName);
                    $("#look-doctor").attr("href",'selectService.html?patientUuid='+patientUuid+'&caseUuid='+caseUuid+'&clinicService='+res.data.clinicService+'&orderId='+orderId);
                    $("#btn-notice").attr("href",'serveNotice.html?caseUuid='+caseUuid+'&patientUuid='+patientUuid+'&orderId='+orderId+'&patientName='+patientName);
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
            lookCaseNotice();
        })
    }
});


