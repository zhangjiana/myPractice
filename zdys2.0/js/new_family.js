/**
 * Created by zJ on 2016/1/25.
 */
  var loginFlag = false;
$(function() {
    getHomeMember();
   

    $("#add-mem").swipe({
        tap: function() {
            if(!loginFlag){
                myalert.tips({
                    txt: "您未登录，请先登录",
                    fnok: function() {
                        window.location.href = '/html/newLogin.html';
                    },
                    notxt: "逛一逛",
                    oktxt: "去登录"
                });
            } else {
                window.location.href = '../html/addMember.html';
            }
        }
    });

});
var relation = JSON.parse(window.localStorage.theRelationship);

function getHomeMember() {
    $.ajax({
        type: "GET",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientList?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        success: function(data) {
            if (data.code == 0) {
                loginFlag = true;
                $("#service-notice-list").html('');
                window.localStorage.allMember = JSON.stringify(data.data);
                var config = JSON.stringify(data.data);
                createMem(config);
                console.log(data.data);
            } else if (data.code == 909) {
                loginTimeOut();
            }
        },
        error: function(res) {
            if (res.status == 401) {
                //myalert.tips({
                //    txt:"会话超时，请重新登录",
                //    fnok:function(){
                //        window.location = "../html/newLogin.html";
                //    },
                //    btn:1
                //});
                loginTimeOut();
            }
        }
    });
}

function createMem(config) {
    var data = JSON.parse(config),
        theRelation = {};
    $.each(data, function(i) {
        var head_img = 'http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png';
        if (data[i].avatar) {
            if(data[i].avatar.indexOf('http')>-1){
                head_img = data[i].avatar;
            }else{
                head_img = 'http://imgcdn.zhaoduiyisheng.com/img/head/' + data[i].avatar;
            }
        } else if (data[i].relationship == "me") {
            head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/n1.png";
        } else if (data[i].relationship == "father") {
            head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/m1.png";
        } else if (data[i].relationship == "mother") {
            head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/m3.png";
        }

        if (relation[this.relationship] == undefined) {
            theRelation[this.uuid] = this.relationship;
        } else {
            theRelation[this.uuid] = relation[this.relationship];
        }


        var $li = $('<li class="bg-white icon-list pl30 pt30 pb30 pr20"><a href="../html/familyInfo.html?patientUuid=' + data[i].uuid + '" class="db cbo"> ' +
            '<div class="fl user-head tc"> <img src="' + head_img + '" alt=""> </div> ' +
            '<div class="fl f34 c-33 mt30">' + theRelation[this.uuid] + '</div></a></li>');
        $("#service-notice-list").append($li);

    });

    setTimeout(function() {
        scroll.refresh();
    }, 500);
}
