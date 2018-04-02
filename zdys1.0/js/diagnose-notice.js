/**
 * Created by zJ on 2015/12/14.
 */


$(function(){
    getDiagnoseNotice();
});
function getDiagnoseNotice(){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Patient/CaseNotice?sessionId="+window.localStorage.sessionId+"&patientUuid="+patientUuid+"&caseUuid="+caseUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){
            console.log(data);
            if(data.code == 0){
                $("#serviceWay").text(data.data.serviceName);
                $("#serviceObject").text(window.localStorage.theRelationship[data.data.relationship]);
                $("#serviceDocName").text(data.data.doctor.name);
                $("#serviceDocTitle").text(data.data.doctor.jobTitle);
                $("#serviceDocLocation").text(data.data.clinicLocation);
                $("#serviceDocCityName").text(data.data.cityName);
                $("#serviceTime").text(data.data.clinicTime)
            }
        }
    })
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