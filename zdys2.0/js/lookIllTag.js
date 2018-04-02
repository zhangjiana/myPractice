/**
 * Created by zJ on 2016/1/11.
 */
$(function(){
        getHomeMember();
        $("#back").swipe({
        tap: function(){
            if (GetQueryString('from')=='family') {
                window.location = '../html/newFamily.html';
            }else{
                window.location = '../index.html';
            }
        }
    });
});

var relation = JSON.parse(window.localStorage.theRelationship);
var scroll;
/*获取家庭成员列表*/
function getHomeMember() {

    $.ajax({
        type: "GET",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientList?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function (data) {

            if (data.code == 0) {
                $("#people-box").html('');
                window.localStorage.allMember = JSON.stringify(data.data);
                $.each(data.data,function(i){
                    var theRelation = null;
                    if(relation[data.data[i].relationship] == undefined){
                        theRelation = data.data[i].relationship ;
                    }else {
                        theRelation = relation[data.data[i].relationship];
                    }
                    var head_img = null;
                    if(data.data[i].avatar){
                        head_img = data.data[i].avatar;
                    }else if(data.data[i].relationship == "me"){
                        head_img = "n1.png";
                    }else if(data.data[i].relationship == "father"){
                        head_img = "m1.png";
                    }else if(data.data[i].relationship == "mother"){
                        head_img = "m3.png";
                    }


                        var $li = $('<li class="bg-white prl30 mb20 icon-list"><a href="../html/careIll.html?patientUuid='+data.data[i].uuid+'" class="db clearfix">' +
                            '<div class="fl user-head tc"><img src="http://imgcdn.zhaoduiyisheng.com/img/head/'+head_img+'" alt="">' +
                            '</div>' +
                            '<div class="ill-tag tag-box fl"><p class="c-33 pb20">'+theRelation+'</p></div></a></li>');

                    $("#people-box").append($li);


                    getHomeMemberDAta(i,data.data[i].uuid)
                });
                scroll = new IScroll('#scroll', { probeType: 3, mouseWheel: true });
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

function getHomeMemberDAta(i,objUuid) {
    $.ajax({
        type: 'GET',
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + objUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                if(data.data.tagList.length){
                    var $span = '';
                    for( var j = 0 ;j< data.data.tagList.length; j++){
                            $span += '<span class="tag-gray fl">'+data.data.tagList[j].name+'</span>';
                    }
                    $(".ill-tag").eq(i).append($span);
                    scroll.refresh();
                }else {
                    // var $div = $('<div class="no-msg pr"><div class="centerX tc"> ' +
                    //     '<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/cloud.png" alt=""> ' +
                    //     '<p class="c-99">还没有关注的疾病</p> ' +
                    //     '</div></div>');
                     var $div = $('<span class="tag-gray add-tag bcc fl" style="background:url(http://imgcdn.zhaoduiyisheng.com/img/icon/add.png) no-repeat center;background-size:.44rem">&emsp;&emsp;</span>');
                    $(".tag-box").eq(i).removeClass('ill-tag').addClass('mt30').append($div);
                    scroll.refresh();
                }
                setTimeout(function(){
                    scroll.refresh();
                },500);
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
