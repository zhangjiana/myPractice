/**
 * Created by zJ on 2015/12/9.
 */


$(function () {
    if(window.localStorage.Doctors){
        createDoctor(window.localStorage.Doctors)
    }else {
        getDoctor();
    }
});

function getDoctor(){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Patient/CaseService?sessionId="+window.localStorage.sessionId+"&patientUuid="+GetQueryString("selectPatientUuid")+"&caseUuid="+GetQueryString("selectCase"),
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){
            if (data.code == 0){
                var data = JSON.stringify(data);
                window.localStorage.Doctors = data;
                createDoctor(data);
            }
        }
    })
}


function createDoctor(data){
    data = JSON.parse(data);
    var localArr=eval(data.data.local);
        if(localArr.length){
            $("#local-doctor").html(' ');
            for(var i=0;i<localArr.length;i++){
                var $doctor = $('<a class="db service-doctor-item fl" href="../html/docotr-details.html?uuid='+localArr[i].uuid+'">' +
                    '<dl><dt class="doctor-pic"></dt><dd class="doctor-name">' +
                    '<span class="f28 db fl">'+localArr[i].name+'</span>' +
                    '<span class="f20 db fl">'+localArr[i].jobTitle+'</span></dd></dl></a>');
                $("#local-doctor").append($doctor);
            }

        }
    var remoteArr=eval(data.data.remote);
        if(remoteArr.length){
            $("#remote-doctor").html(' ');
            for(var j=0;j<remoteArr.length;j++){
                var $doctor = $('<a class="db service-doctor-item fl" href="../html/docotr-details.html?uuid='+remoteArr[j].uuid+'">' +
                '<dl><dt class="doctor-pic"></dt><dd class="doctor-name">' +
                '<span class="f28 db fl">'+remoteArr[j].name+'</span>' +
                '<span class="f20 db fl">'+remoteArr[j].jobTitle+'</span></dd></dl></a>');
                $("#remote-doctor").append($doctor);
            }

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