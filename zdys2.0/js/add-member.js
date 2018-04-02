/**
 * Created by zJ on 2016/1/7.
 */

$(function() {
    clearInput();
    alertSth();

    //省市
    cityWrap();
    //出生日期
    birth();
    if (!window.localStorage.province) {
        getProvince();
    }
    regPhoneNum("#tel", "#add-notice");

    var scroll = new IScroll('#scroll', {
        probeType: 3,
        mouseWheel: true,
        preventDefault: false
    });
    $(".common-foot").swipe({
        tap: function() {
            if (addMemValidate()) {
                getAddNumber();
            }
        }
    });
  /*  var $provinceVal=$("#province-val");
    if($provinceVal.text()=='请选择'){
        $provinceVal.removeClass().addClass('c-99');
    }else{
        $provinceVal.removeClass().addClass('c-66');
    }*/
});


/*添加家庭成员 ajax;*/
function getAddNumber() {


    var data = {
        "avatar": $("#avatar").attr('src').slice(12),
        "relationship": $("#relation").val(),
        "gender": $("#sex-text").attr("data-sex"),
        "birthDate": $("#birth-text").text() + "-01-01",
        "name": $("#name").val(),
        "phone": $("#tel").val(),
        "province": $("#my-province").attr('data-id'),
        "city": $("#my-city").attr('data-id')
    };

    $.ajax({
        type: "POST",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/AddPatient?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function(data) {
            console.log(data);
            var from = GetQueryString('from') || '',
                the_patientUuid = GetQueryString('patientUuid');
            if (data.code == 0) {
                var str = '恭喜您，10积分到手！<br>继续病情描述，将再获得5积分！';
                myalert.tips({
                    tit: '添加成功！',
                    txt: str,
                    fnno: function() {
                        if (-1 !== from.indexOf('faceDiagnose')) {
                            window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + data.message;
                        } else if (-1 !== from.indexOf('telePreDiag')) {
                            window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + data.message;
                        } else if (-1 !== from.indexOf('teleDiagnose')) {
                            window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + data.message;
                        } else {
                            window.location.href = "../html/newFamily.html";
                        }
                        myalert.remove();
                    },
                    fnok: function() {
                        window.location.href = "../html/uploadData.html?patientUuid=" + data.message + "&from=" + from;
                    },
                    notxt: "完成",
                    oktxt: "病情描述"
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

//验证添加成员表单
function addMemValidate() {
    var avatar = $("#avatar")[0];
    var $relation = $("#relation");
    var $birth = $("#birth-text");
    var $sex = $("#sex-text");
    var $phone = $("#tel");
    var $province = $("#my-province");
    var $city = $("#my-city");
    var $name = $("#name");
    if (!avatar || $relation.val() == '' || $birth.text() == '' || $sex.text() == '' || $phone.val() == '' || $city.text() == '请选择' || $name.val() == '' ||$province.text() == '请选择') {
        $("#add-notice").text("请将信息填写完整");
        return false;
    } else {
        $("#add-notice").text("");
        return true;
    }
}


/*页面中的弹窗*/
function alertSth() {

    $("#head").swipe({
        tap: function() {
            myalert.head();
        }
    });

    $("#sex").swipe({
        tap: function() {
            myalert.sex();
        }
    });
 /*   $("#birth-date").swipe({
        tap: function() {
            myalert.year();
        }
    });*/

   /* $("#location").swipe({
        tap: function() {
            myalert.city(function(){
                var $provinceVal=$("#province-val");
                if($provinceVal.text()=='请选择'){
                    $provinceVal.removeClass().addClass('c-99');
                }else{
                    $provinceVal.removeClass().addClass('c-66');
                }
            });
        }
    });*/
    $("#addMem-back").swipe({
        tap: function() {
            myalert.tips({
                tit: "<b>提&nbsp;&nbsp;示</b>",
                txt: "确定要退出吗？<br>" +
                    "(退出资料将不会被保存)",

                fnok: function() {
                    var from = GetQueryString('from') || '';
                    if (-1 !== from.indexOf('faceDiagnose')) {
                        window.location = '../html/faceDiagnose.html?clinicService=local_face';
                    } else if (-1 !== from.indexOf('telePreDiag')) {
                        window.location = '../html/telePreDiag.html?clinicService=remote_conference';
                    } else if (-1 !== from.indexOf('teleDiagnose')) {
                        window.location = '../html/teleDiagnose.html?clinicService=remote_face';
                    } else {
                        window.location.href = "newFamily.html";
                    }
                    This.remove();
                },
                notxt: "取消",
                oktxt: "确定"
            });
        }
    });
}


//输入框清除
function clearInput() {
    var clearObj = {
        clearFun: function(id) {
            $(id).on('focus', function() {
                $(this).next().removeClass('dn');
            });
            $(id).on('blur', function() {
                $(this).next().addClass('dn');
            });
        }
    };
    clearObj.clearFun("#relation");
    clearObj.clearFun("#name");
    clearObj.clearFun("#tel");
    $(".clear-input").swipe({
        tap: function() {
            $(this).prev().val('');
        }
    });
}
/*验证手机号格式*/
function regPhoneNum(PhoneNum, regNotice) {
    var $regPhoneNum = $(PhoneNum);
    var $regNotice = $(regNotice);
    $regPhoneNum.on("blur", function() {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (reg.test($regPhoneNum.val())) {
            $regNotice.text(" ");
            return true;
        } else {
            $regNotice.text("您输入的手机号无效");
            $regPhoneNum.val('');
            return false;
        }
    });
}
