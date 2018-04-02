/**
 * Created by zJ on 2016/1/10.
 */
$(function() {
    getHomeMember();
    $('#mymember-wrap').swipe({
        tap: function(e,t) {
            if ('IMG' === t.tagName || 'H4' === t.tagName) {
                window.location.href = 'familyInfo.html?patientUuid=' + $(t).parent().parent().parent().data('uuid');
            }
            e.preventDefault();
        }
    });
});
var scroll = new IScroll('#scroll', { probeType: 3, mouseWheel: true ,preventDefault:false});
var relation = JSON.parse(window.localStorage.theRelationship);
/*获取家庭成员列表*/
function getHomeMember() {
    $.ajax({
        type: "GET",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientList?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function(data) {

            if (data.code == 0) {
                createMember(data);
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

function createMember(data) {
    var len = data.data.length,
        num = 0,
        theRelation = {},
        flags = {};
    $.each(data.data, function(i) {
        flags[this.uuid] = false;
        if (relation[this.relationship] == undefined) {
            theRelation[this.uuid] = this.relationship;
        } else {
            theRelation[this.uuid] = relation[this.relationship];
        }

        /*查询服务通知*/

        getServiceProcess(data.data[i].uuid);
        /*服务通知*/
        /*查询找对医生的服务流程*/
        function getServiceProcess(patientUuid) {
            $.ajax({
                type: 'GET',
                url: 'http://www-test.zhaoduiyisheng.com/api/Patient/ServiceProcess?sessionId=' + window.localStorage.sessionId + "&patientUuid=" + patientUuid,
                contentType: "text/plain; charset=UTF-8",
                dataType: 'json',
                success: function(d) {
                    if (d.code == 0) {
                        var dataB = d.data,
                            str = '',
                            time = '';
                        if (dataB.caseUuid) {
                            if (dataB.uploaded.state) {
                                str = "已上传资料，等待医疗专员匹配医师";
                                time = dataB.uploaded.time;
                                flags[dataB.patientUuid] = true;
                            }
                            if (dataB.uncompleted.state) {
                                str = "资料不详细，请补充资料";
                                time = dataB.uncompleted.time;
                            }
                            if (dataB.matched.state) {
                                str = "医疗专员正为你匹配专家，请选择服务";
                                time = dataB.matched.time;
                            }
                            if (dataB.selected.state) {
                                str = "已选择服务，请付款";
                                time = dataB.selected.time;
                            }
                            if (dataB.paid.state) {
                                str = "已为你匹配专家！";
                                time = dataB.paid.time;
                            }
                            if (dataB.appointed.state) {
                                str = "已为您预约专家";
                                time = dataB.appointed.time;
                            }
                            if (dataB.finished.state) {
                                str = "完成服务";
                                time = dataB.finished.time;
                            }
                            if (time === null) {
                                time = '';
                            }
                            var head_img = null;
                            if(data.data[i].avatar){
                                head_img = data.data[i].avatar;
                            }else if(data.data[i].relationship == "me"){
                                head_img = "n1.png";
                            }else if( data.data[i].relationship == "father"){
                                head_img = "m1.png";
                            }else if(data.data[i].relationship == "mother"){
                                head_img = "m3.png";
                            }


                            if (flags[dataB.patientUuid]) {
                                var $memberInfo = $('<div class="members be5-b">' +
                                    '<a href="serviceProcess.html?patientUuid=' + dataB.patientUuid + '&caseUuid=' + dataB.caseUuid + '&head=' + head_img + '&patientName=' + theRelation[dataB.patientUuid] + '" class="db cbo">' +
                                    '<div class="fl pt30 user-head">' +
                                    '<img src="http://imgcdn.zhaoduiyisheng.com/img/head/' +  head_img + '">' +
                                    '</div>' +
                                    '<div class="fl pt30 user-info icon-list">' +
                                    '<h4 class="f28 c-66">' + theRelation[dataB.patientUuid] + '</h4>' +
                                    '<h5 class="f24 c-99 status">' + str + '</h5>' +
                                    '<p class="f20 c-99 pb20 serviceInfo-time">' + time + '</p>' +
                                    '</div></a></div>');
                                $("#memberInfo-wrap").append($memberInfo);
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
            }).complete(function() {
                num++;
                if (num === len) {
                    if (!$('#memberInfo-wrap').children()[0]) {
                        $('#memberInfo-wrap').append('<div class="no-msg pr">' +
                            '<div class="centerX tc">' +
                            '<img class="icon-cloud" src="http://imgcdn.zhaoduiyisheng.com/img/icon/cloud.png">' +
                            '<p class="f20 c-99">您还没有服务通知</p>' +
                            '</div>' +
                            '</div>');
                    }
                }
            });
        }
        personalArticle(data.data, i, data.data[i].uuid);

    });
    /*给患者推送的文章*/
    function personalArticle(data, i, patientUuid) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/RecommendArticle?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + patientUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(d) {
                if (d.code == 0) {
                    var dataC = d.data;
                    var head_img = null;

                    if(data[i].avatar){
                        head_img = data[i].avatar;
                    }else if(data[i].relationship == "me"){
                        head_img = "n1.png";
                    }else if( data[i].relationship == "father"){
                        head_img = "m1.png";
                    }else if(data[i].relationship == "mother"){
                        head_img = "m3.png";
                    }

                    var $mymember = $('<div class="my-family-main ml30 pr30 be5-t pr" data-uuid="' + data[i].uuid + '">' +
                        '<div class="members pt30 mb20 clearfix icon-list">' +
                        '<div class="fl user-head">' +
                        '<img src="http://imgcdn.zhaoduiyisheng.com/img/head/' + head_img+ '" >' +
                        '</div>' +
                        '<div class="fl user-info">' +
                        '<h4 class="f28 c-66">' + theRelation[patientUuid] + '</h4>' +
                        '</div>' +
                        '</div>' +
                        '<h5 class="f24 c-66 article"><a href="../html/article01.html?uuid=' + dataC.uuid + '&patientUuid=' + patientUuid + '&title=' + dataC.title + '&from=family">'+dataC.title.slice(0, 14)+'</a></h5>' +
                        '<ul class="ill-tag dn cbo f20"></ul>' +
                        '<p class="f22 share-to cbo"> ' +
                        '<span class="fl c-99">分享给家人:</span><a class="fl clearfix" href="../html/article01.html?uuid=' + dataC.uuid + '&patientUuid=' + patientUuid + '&title=' + dataC.title + '&share=true&from=family">' +
                        '<img class="fl db index-share ml40" src="http://imgcdn.zhaoduiyisheng.com/img/icon/share.png"></a>' +
                        '<em class="col-line fl"></em>' +
                        '<a class="fl clearfix" href="../html/msgShare.html?uuid=' + dataC.uuid + '&patientUuid=' + patientUuid + '&title=' + dataC.title + '&from=family"><img class="fl db index-msg" src="http://imgcdn.zhaoduiyisheng.com/img/icon/msg.png"></a>' +
                        '</p> </div>');
                    $("#mymember-wrap").append($mymember);
                    if (dataC.tagList.length) {
                        var $li = '';
                        for (var j = 0; j < dataC.tagList.length; j++) {
                            $li += '<li class="tag-gray">' + dataC.tagList[j].name + '</li>';
                        }
                        $(".ill-tag").eq(i).prepend($li).removeClass('dn');
                    }else{
                        $(".ill-tag").eq(i).remove();
                    }
                    setTimeout(function(){
                        scroll.refresh();
                    },200);
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
}
