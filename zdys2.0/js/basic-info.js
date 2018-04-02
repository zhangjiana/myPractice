/**
 * Created by zJ on 2016/1/8.
 */

$(function() {
    var basicIscroll = new IScroll('#basicIscroll', {
        scrollX: false,
        scrollY: true
    });
    var relation = JSON.parse(window.localStorage.theRelationship);

    var patientUuid = GetQueryString('patientUuid');

    getMemberInfo();

    //省市
    cityWrap();
    //出生日期
    birth();

    var theFlag = false;

    $("#del").swipe({
        tap: function() {
            if (theFlag) {
                myalert.tips({
                    txt: "您的家人尚有未完成的服务，不可删除！"
                });
            } else {
                myalert.tips({
                    txt: "该家人病例资料都会被删除",
                    tit: "确认删除",
                    fnok: function() {
                        delHomeMember();
                    }
                });
            }
        }
    });
    getServiceProcess();

    var editFlag = true;
    //点击编辑文字居左

    if(GetQueryString("from")=="familyInfo.html"){
        $("#edit").swipe({
            tap: function() {
                editData();
            }
        });
    }else {
        editFlag = true;
        editData();
        $("#edit").swipe({
            tap: function(){
                if(addMemValidate()){
                    modifyProfile();
                }

            }
        })
    }

    function editData(){
        if (editFlag) {
            $("#edit").text('完成');

            $(".change").removeClass("fr").addClass("fl");
            $(".change").removeClass("tr").addClass("tl");
            $(".data-info li>div").removeClass('no-arrow');
            $(".data-info li>div").eq(1).addClass('no-arrow');
            $(".data-info li>div").eq(2).addClass('no-arrow');
            $(".data-info li>div").eq(4).addClass('no-arrow');
            $(".data-info li>div").eq(5).addClass('no-arrow');
            $('#birth-text').removeClass('disable');
            $('#my-province').removeClass('disable');
            $('#my-city').removeClass('disable');
            $("#name").addClass("dn").next().removeClass("dn");
            $("#relation").addClass("dn").next().removeClass("dn");
            $("#tel").addClass("dn").next().removeClass("dn");
            if($("#name").text()== "暂未填写"){
                $("#name-input").val('');
            }else {
                $("#name-input").val($("#name").text());
            }
            if($("#relation").text() == "暂未填写"){
                $("#relation-input").val('');
            }else {
                $("#relation-input").val($("#relation").text());
            }
            if($("#tel").text() == "暂未填写"){
                $("#tel-input").val('');
            }else{
                $("#tel-input").val($("#tel").text());
            }
            if($("#birth-text").text() == "暂未填写"){
                $("#birth-text").text('请选择');
            }

            $("#province").removeClass('dn');
            $("#city").removeClass('dn');
            $("#bron-year").removeClass('dn');
            popupSth();

            $("#del").addClass('dn');


            $("#back").addClass('dn');
            editFlag = false;
        } else {

            if(addMemValidate()){
                $("#back").removeClass('dn');
                modifyProfile();
                $("#edit").text('编辑');

                $(".change").removeClass("fl").addClass("fr");
                $(".change").removeClass("tl").addClass("tr");
                $(".data-info li>div").addClass('no-arrow');
                //$(".data-info li>div").eq(1).addClass('no-arrow');
                //$(".data-info li>div").eq(2).addClass('no-arrow');
                $("#name").removeClass("dn").next().addClass("dn");
                $("#relation").removeClass("dn").next().addClass("dn");
                $("#tel").removeClass("dn").next().addClass("dn");
                $('#birth-text').addClass('disable');
                $('#my-province').addClass('disable');
                $('#my-city').addClass('disable');
                $("#name").text($("#name-input").val());
                $("#relation").text($("#relation-input").val());
                $("#tel").text($("#tel-input").val());


                $("#province").addClass('dn');
                $("#city").addClass('dn');
                $("#bron-year").addClass('dn');
                $("#del").removeClass('dn');
                editFlag = true;
            }

        }
    }

    clearFun("#name-input");
    clearFun("#relation-input");
    clearFun("#tel-input");
    regPhoneNum("#tel-input","#add-notice");
    nameVali("#name-input","#add-notice");
    function clearFun(id) {
        $(id).on('focus', function() {
            $(this).next().removeClass('dn');
        });
        $(id).on('blur', function() {
            $(this).next().addClass('dn');
        });

    }
    $(".clear-input").swipe({
        tap: function() {
            $(this).prev().val('');
        }
    });

    function popupSth() {
        if (editFlag) {
            $("#avatar").parent().swipe({
                tap: function() {
                    if($("#avatar").hasClass("fl")){
                        myalert.head();
                    }

                }
            });
            $("#sex-text").parent().swipe({
                tap: function() {
                    if($("#sex-text").hasClass("fl")){
                         myalert.sex();
                    }
                }
            });
        }
     }


    /*获取成员资料*/

//获取爸爸基本资料
    function getMemberInfo() {

        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + patientUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {

                if (data.code == 0) {

                    var theRelation = null;
                    if (relation[data.data.relationship] == undefined) {
                        theRelation = data.data.relationship;
                    } else {
                        theRelation = relation[data.data.relationship];
                    }

                    var head_img = 'http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png';
                    if (data.data.avatar) {
                        if(data.data.avatar.indexOf('http')>-1){
                            head_img = data.data.avatar;
                        }else{
                            head_img = 'http://imgcdn.zhaoduiyisheng.com/img/head/' + data.data.avatar;
                        }
                    } else if (data.data.relationship == "me") {
                        head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/n1.png";
                    } else if (data.data.relationship == "father") {
                        head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/m1.png";
                    } else if (data.data.relationship == "mother") {
                        head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/m3.png";
                    }
                    $("#avatar").attr('src', head_img);
                    if(data.data.relationship){
                        $("#relation").text(theRelation);
                        $("#relation-input").val(theRelation);
                    }

                    if (data.data.gender == 'male') {
                        $("#sex-text").text("男");
                        $("#sex-text").attr('data-sex', "male");
                    } else {
                        $("#sex-text").text("女");
                        $("#sex-text").attr('data-sex', "female");
                    }
                    if(data.data.birthDate){
                        $("#birth-text").text(data.data.birthDate.slice(0, 4));
                    }else {
                        $("#birth-text").text("暂未填写");
                    }
                    if (data.data.name) {
                        $("#name").text(data.data.name);
                        $("#name-input").val(data.data.name);
                    } else {
                        $("#name").text("暂未填写");
                    }
                    if (data.data.phone) {
                        $("#tel").text(data.data.phone);
                    } else {
                        $("#tel").text("暂未填写");
                    }
                    console.log(data.data);
                    if (data.data.province) {
                        $("#my-province").attr('data-id',data.data.province);
                    }
                    if(data.data.city){
                        $("#my-city").attr('data-id',data.data.city);
                        $("#my-city").text("");
                    }
                    if (data.data.cityRegion && data.data.cityRegion.description) {
                        $("#my-province").text(data.data.cityRegion.description);
                    }
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "../html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        });

    }
    /*修改成员资料*/
    function modifyProfile() {
        var $avatar = $("#avatar").attr('src'),
            head = null;
        if($avatar.indexOf('http') > -1){
              head =  $avatar ;
        }else {
            head = $avatar.slice(12);
        }
        var config = {
            "uuid": patientUuid,
            "avatar": head,
            "name": $("#name-input").val(),
            "relationship": $("#relation-input").val(),
            "gender": $("#sex-text").attr('data-sex'),
            "birthDate": $("#birth-text").text() + "-01-01",
            "phone": $("#tel-input").val(),
            "province": $("#my-province").attr('data-id'),
            "city": $("#my-city").attr('data-id'),
            "height": "0",
            "weight": "0"
        };

        console.log("修改");
        console.log(config);
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/ModifyPatient?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(config),
            success: function(data) {

                if (data.code == 0) {
                    var from = GetQueryString('from')||'',
                        the_patientUuid = GetQueryString('patientUuid');
                    if (-1 !== from.indexOf('faceDiagnose')) {
                        window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + the_patientUuid+"&caseUuid="+GetQueryString('caseUuid');
                    } else if (-1 !== from.indexOf('telePreDiag')) {
                        window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + the_patientUuid+"&caseUuid="+GetQueryString('caseUuid');
                    } else if (-1 !== from.indexOf('teleDiagnose')) {
                        window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + the_patientUuid+"&caseUuid="+GetQueryString('caseUuid');
                    }
                } else {
                    console.log(data.message);
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "../html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        });
    }

//删除家庭成员
    function delHomeMember() {

        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/DeletePatient?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: patientUuid,
            success: function(data) {
                if (data.code == 0) {
                    myalert.tips({
                        txt: "删除成功！",
                        fnok: function() {
                            window.location.href = 'newFamily.html';
                        },
                        btn: 1
                    });
                } else {
                    myalert.tips({
                        txt: data.message,
                        btn: 1
                    });
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "../html/newLogin.html";
                        },
                        btn: 1
                    });
                }
            }
        });
    }

    function getServiceProcess() {

        $.ajax({
            type: 'GET',
            url: 'http://www-test.zhaoduiyisheng.com/api/Patient/ServiceProcess?sessionId=' + window.localStorage.sessionId + "&patientUuid=" + patientUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    if (data.data.caseUuid) {
                        if (data.data.uploaded.state) {
                            theFlag = true;
                        }
                    }
                }

            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt: "会话超时，请重新登录",
                        fnok: function() {
                            window.location = "../html/newLogin.html";
                        },
                        btn: 1
                    });

                }
            }
        });
    }

    //验证添加成员表单
    function addMemValidate() {
        var avatar = $("#avatar")[0];
        var $name = $("#name-input");
        var $relation = $("#relation-input");
        var $sex = $("#sex-text");
        var $birth = $("#birth-text");
        var $phone = $("#tel-input");
        var $province = $("#my-province");
        var $city = $("#my-city");

        if (!avatar || $relation.val() == '' || $birth.text() == '' || $sex.text() == '' || $phone.val() == '' || $city.text() == '请选择' || $name.val() == '' ||$province.text() =='请选择') {
            $("#add-notice").text("请将信息填写完整");
            return false;
        } else {
            $("#add-notice").text("");
            return true;
        }
    }

});





/*一系列弹窗*/

//验证手机号格式
