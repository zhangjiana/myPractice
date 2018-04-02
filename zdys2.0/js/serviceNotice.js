
$(function(){
    var patientName=GetQueryString('patientName');
    var scroll = new IScroll('#scroll-ser-notice', { probeType: 3, mouseWheel: true });
    getSerNotice();
    function getSerNotice(){
        $.ajax({
            type:"GET",
            url:"http://www-test.zhaoduiyisheng.com/api/Patient/CaseNotice?sessionId="+window.localStorage.sessionId+"&patientUuid="+GetQueryString('patientUuid')+"&caseUuid="+GetQueryString('caseUuid'),
            contentType: "text/plain; charset=UTF-8",
            dataType:'json',
            success: function(res){
                if(res.code == 0){
                    $("#notice-main").html("");
                    if(res.data.localDoctor){ //有两个医生
                        var localDoc=res.data.localDoctor;
                        var $notice1=$('<li>' +
                        '<em>服务方式：</em>' +
                        '<span class="c-66" id="serviceName">'+res.data.serviceName+'</span>' +
                        '</li>' +
                        '<li>'+
                        '<em><b class="word-three">咨询</b>者：</em>'+
                        '<span class="c-red" id="serviceObject">'+patientName+'</span>' +
                        '</li>' +
                        '<li>'+
                        '<em>远程专家：</em>'+
                        '<span class="c-66">'+res.data.doctor.name+'，' +
                        ''+res.data.doctor.jobTitle+'，'+res.data.doctor.hospital+'，'+res.data.doctor.sectionName+'。</span>' +
                        '</li>' +
                        '<li>'+
                        '<em>当地专家：</em>' +
                        '<span class="c-66">'+ localDoc.name+'，'+localDoc.jobTitle+'，'+localDoc.hospital+'，'+localDoc.sectionName+'</span>' +
                        '</li>' +
                        '<li>'+
                        '<em><b class="word-two">地</b>点：</em>'+
                        '<span class="c-66">'+res.data.clinicLocation+'</span>' +
                        '</li>' +
                        '<li>'+
                        '<em><b class="word-two">时</b>间：</em>'+
                        '<span class="c-red">'+res.data.clinicTime+'</span>' +
                        '</li>' +
                        '<li>'+
                        '<em><b class="word-three">订单</b>号：</em>'+
                        '<span class="c-66">'+GetQueryString('orderId')+'</span>'+
                        '</li>');
                        $("#notice-main").append($notice1);
                    }else{
                        var $notice2=$('<li><em>服务方式：</em>' +
                        '<span class="c-66" id="serviceName">'+res.data.serviceName+'</span></li><li>'+
                        '<em><b class="word-three">咨询</b>者：</em>'+
                        '<span class="c-red" id="serviceObject">'+patientName+'</span></li><li>'+
                        '<em><b class="word-two">专</b>家：</em>' +
                        '<span class="c-66">'+ res.data.doctor.name+'，'+res.data.doctor.jobTitle+'，'+res.data.doctor.hospital+'，'+res.data.doctor.sectionName+'</span></li><li>'+
                        '<em><b class="word-two">地</b>点：</em>'+
                        '<span class="c-66">'+res.data.clinicLocation+'</span></li><li>'+
                        '<em><b class="word-two">时</b>间：</em>'+
                        '<span class="c-red">'+res.data.clinicTime+'</span></li><li>'+
                        '<em><b class="word-three">订单</b>号：</em>'+
                        '<span class="c-66">'+GetQueryString('orderId')+'</span>'+
                        '</li>');
                        $("#notice-main").append($notice2);
                    }

                }
            }
        }).success(function(){
            scroll.refresh();
        })
    }
});