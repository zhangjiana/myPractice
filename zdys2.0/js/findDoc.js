/**
 * Created by zJ on 2016/1/9.
 */
$(function () {
     needAlert();
    getHomeMember();

    $("#finDoc-back").swipe({
        tap: function(){
            if (GetQueryString('from')=='family') {
                window.location = '../html/newFamily.html';
            }else{
                window.location = '../index.html';
            }
        }
    });
    if(GetQueryString('patientUuid')){
        the_patientUuid = GetQueryString('patientUuid');
        askCaseList(the_patientUuid);
        getHomeMemberDAta(the_patientUuid);
    }else{
        $("#name").text('请填写姓名');
        $("#sex-text").text("请选择");
        $("#birth-text").text('请选择');
        $("#province-val").text("请选择");
    }
    $("#description").on('input propertychange', changeFlag);
    function changeFlag(){
        $(this).val($(this).val().replace(/^\s+|\s+$/g,''));
        if($(this).val()){
            $(this).attr('data-flag','true');
        }else{
            $(this).attr('data-flag','false');
        }
    }
});

var the_patientUuid,the_CaseUuid;
var nextflag = false;
/*获取家庭成员列表*/
function getHomeMember() {

    $.ajax({
        type: "GET",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientList?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function (data) {

            if (data.code == 0) {

                window.localStorage.allMember = JSON.stringify(data.data);
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
    });
}



/*查询家庭成员资料*/
function getHomeMemberDAta(objUuid) {
    $.ajax({
        type: 'GET',
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + objUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                /*判断姓名*/
                if(data.data.name){
                    $("#name").text(data.data.name);
                }else {
                    $("#name").text('"请填写姓名');
                }
                //    判断性别
                if(data.data.gender){
                    if(data.data.gender == 'male'){
                        $("#sex-text").attr("data-sex",'male');
                        $("#sex-text").text("男");
                    }else {
                        $("#sex-text").attr("data-sex",'female');
                        $("#sex-text").text("女");
                    }
                }else {
                    $("#sex-text").text("请选择");
                }
                /*出生日期*/
                if(data.data.birthDate){
                    $("#birth-text").text(data.data.birthDate.slice(0,4))
                }else {
                    $("#birth-text").text('请选择');
                }
                //城市
                if(data.data.city){
                    getLocation(data.data.province,data.data.city);
                }else {
                    $("#province-val").text("请选择");
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
    });
}

$(".common-foot").swipe({
    tap: function(){
        var the_patientUuid = GetQueryString('patientUuid')||$("#name").data('uuid');

        if(!the_patientUuid){
            myalert.tips({
                txt: '请先添加家庭成员',
                btn: 1
            });
            return false;
        }
        if(($("#name").attr('data-flag')=='false')||($("#sex-text").attr('data-flag')=='false')||($("#birth-text").attr('data-flag')=='false')||($("#province-val").attr('data-flag')=='false')||($("#description").attr('data-flag')=='false')){
            $("#findDoc-notice").text("请将信息填写完整");
        }else {
            var sendData = {
                    "patientUuid": the_patientUuid,
                    "smoking": "off",
                    "description": $("#description").val()
                };
                /*查询病例是否未完成*/
                if(the_CaseUuid){
                    console.log(the_CaseUuid);
                    sendData.caseUuid = the_CaseUuid;
                    console.log(sendData);
                    modifyMemData();
                    modifyCase(the_patientUuid,sendData);
                 }else {
                     modifyMemData();
                     newCase(the_patientUuid,sendData);
                 }
        }


    }
});

/*查询病例列表*/
function askCaseList(objPatientUuid) {
    $.ajax({
        type: "GET",
        url: "http://www-test.zhaoduiyisheng.com/api/Patient/CaseList?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + objPatientUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                console.log("查询病例成功" + data.message);
                console.log(data.data);

                if(data.data.length){
                    for( var j = 0 ; j< data.data.length;j++){
                        if(data.data[j].caseStatus !== "finished"){
                            the_CaseUuid = data.data[j].uuid;
                        }else {
                            the_CaseUuid = null;
                        }
                    }
                }else {
                    the_CaseUuid = null;
                    console.log(the_CaseUuid);
                }
                if(the_CaseUuid){
                    myalert.tips({
                        txt: "已在服务中",
                        fnok: function(){
                          window.location.href = 'serviceProcess.html?patientUuid='+objPatientUuid;
                        },
                        oktxt:"查看服务进程"
                    });
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
    });
}

/*未创建过病例，创建病例*/
function newCase(objUuid,objData) {
    console.log(objData);
    $.ajax({
        type: "POST",
        url: "http://www-test.zhaoduiyisheng.com/api/Patient/AddCase?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(objData),
        success: function (data) {
            console.log(data);
            window.localStorage[objData.patientUuid+'canorder']=1;
            if (data.code == 0) {
                console.log("病例创建成功");
                console.log(data);
                setInterval(function(){
                    if(nextflag){
                        window.location.href = 'uploadData.html?patientUuid='+objUuid+'&caseUuid='+data.message;
                    }
                },100);
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
    });
}

/*修改病例*/
function modifyCase(objUuid,objData) {
    $.ajax({
        type: "POST",
        url: "http://www-test.zhaoduiyisheng.com/api/Patient/ModifyCase?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(objData),
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                console.log("病例修改成功");
                setInterval(function(){
                    if(nextflag){
                        window.location.href = 'uploadData.html?patientUuid='+objUuid+'&caseUuid='+data.message;
                    }
                },100);
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
    });
}

/*修改家庭成员资料 ajax;*/
function modifyMemData() {
    var the_patientUuid = GetQueryString('patientUuid')||$("#name").data('uuid');
    var data = {
        "uuid": the_patientUuid,
        "avatar": $("#name").data('avatar'),
        "relationship":$("#name").attr('data-relationship'),
        "name": $("#name").text(),
        "gender": $("#sex-text").attr('data-sex'),
        "height":'0',
        "weight": '0',
        "birthDate": $("#birth-text").text() + "-01-01",
        "province": $("#province-val").attr('data-id'),
        "city": $("#province-val").attr('city-id')
    };
    console.log(data);
    $.ajax({
        type: "POST",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/ModifyPatient?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (data) {
            if (data.code == 0) {
                console.log('修改成员资料成功');
                if($("#description").val()){
                    nextflag = true;
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
    });
}





/*所需要的弹窗*/
function needAlert(){
     $("#choose-member").swipe({
        tap: function(){
            myalert.family(function () {
                askCaseList($("#name").data('uuid'));
            });
        }
    });

    $("#name").parent().swipe({
        tap: function(){
            myalert.name();

        }
    });

    $("#sex-text").parent().swipe({
        tap: function(){
            myalert.sex();

        }
    });

    $("#birth-text").parent().swipe({
        tap: function(){
            myalert.year();
        }
    });

    $("#province-val").parent().swipe({
        tap: function(){
            myalert.city();
        }
    });

}
