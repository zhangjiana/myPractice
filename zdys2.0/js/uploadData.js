/*
 * @Author: starry
 * @Date:   2016-01-25 19:25:12
 * @Last Modified by:   starry
 * @Last Modified time: 2016-03-11 21:03:40
 */

$(function() {
    var scroll = new IScroll('#scroll-uploadData', {
        probeType: 3,
        mouseWheel: true
    });
    var the_patientUuid = GetQueryString('patientUuid');
    var caseUuid = GetQueryString('caseUuid');
    var filesNum = 0,
        bFlag = true;
    clearInput();
    $("#more").swipe({
        tap: function() {
            $(this).toggleClass('icon-close');
            $('.up-page-smpic').toggleClass('more');
            scroll.refresh();
        }
    });
    $('#go-chartFile').swipe({
        tap: function() {
            var from = GetQueryString('from') || '';
            if (-1 !== from.indexOf('faceDiagnose')) {
                window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + the_patientUuid;
            } else if (-1 !== from.indexOf('telePreDiag')) {
                window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + the_patientUuid;
            } else if (-1 !== from.indexOf('teleDiagnose')) {
                window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + the_patientUuid;
            } else {
                window.location = '../html/chartFile.html?patientUuid=' + the_patientUuid;
            }
        }
    });
    $("#del-pic").swipe({
        tap: function() {
            myalert.tips({
                txt: '真的要删除吗？',
                fnok: function() {
                    var file = $('#big-pic-box').data('file');
                    if (file) {
                        var arr = [];
                        arr.push(file);
                        delCaseData(the_patientUuid, arr);
                    } else {
                        $('.up-page-smpic li').eq($('#big-pic-box').data('id')).remove();
                        $('#big-pic-page').addClass('dn');
                        myalert.remove();
                    }
                }
            });
        }
    });

    regPhoneNum("#contact-tel", "#upload-notice");
    $(".common-foot").swipe({
        tap: function() {
            var fileName = $("#file-name").val().replace(/^\s+|\s+$/g, ''),
                description = $("#description").val().replace(/^\s+|\s+$/g, '');
            if (fileName && description && bFlag) {
                bFlag = false;
                var set = {
                    "caseUuid": caseUuid,
                    "patientUuid": the_patientUuid,
                    //"smoking": 'off',
                    "caseName": fileName,
                    "description": description
                };
                newCase(the_patientUuid, set);
                var This = this,
                    n = 0,
                    str = '';
                setInterval(function() {
                    if (n < 4) {
                        This.text('正在上传' + str);
                        str += '.';
                        n++;
                    } else {
                        str = '';
                        n = 0;
                    }
                }, 500);
            } else if (!fileName) {
                $("#upload-notice").text("请填写病历名称");
            } else if (!description) {
                $("#upload-notice").text("请填写基本状况");
            }

        }
    });



    /*未创建过病例，创建病例*/
    function newCase(objUuid, objData) {
        console.log(objData);
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/AddCase?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(objData),
            success: function(data) {
                console.log(data);
                window.localStorage[objData.patientUuid + 'canorder'] = 1;
                if (data.code == 0) {
                    console.log("病例创建成功");
                    console.log(data);
                    var files = $('.up-page-btn').siblings();
                    files.each(function() {
                        uploadDataCase(this.files[0], data.message);
                    });
                    if (0 === files.length) {
                        var from = GetQueryString('from') || '';
                        if (-1 !== from.indexOf('faceDiagnose')) {
                            window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + the_patientUuid + '&caseUuid=' + data.message;
                        } else if (-1 !== from.indexOf('telePreDiag')) {
                            window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + the_patientUuid + '&caseUuid=' + data.message;
                        } else if (-1 !== from.indexOf('teleDiagnose')) {
                            window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + the_patientUuid + '&caseUuid=' + data.message;
                        } else {
                            window.location = '../html/chartFile.html?patientUuid=' + the_patientUuid;
                        }
                    }
                    setInterval(function() {

                    }, 100);
                } else {
                    $("#upload-notice").text(data.message);
                    bFlag = true;
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

    /*修改病例*/
    function modifyCase(objData) {
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/ModifyCase?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(objData),
            success: function(data) {
                console.log(data);
                if (data.code == 0) {
                    console.log("病例修改成功");
                    window.location.href = 'sumitSucc.html?patientUuid=' + the_patientUuid + '&caseUuid=' + caseUuid;
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

    /*调用相册页*/
    galleryPage();
    /*上传病例资料*/
    function uploadDataCase(file, uuid) {
        var formData = new FormData();
        formData.append("attachment", file);
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/Attachment/Upload?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + the_patientUuid + "&caseUuid=" + uuid,
            contentType: false,
            dataType: 'json',
            data: formData,
            processData: false,
            success: function(data) {
                filesNum += 1;
                console.log(data);
                if (data.code == 0) {
                    console.log("上传资料" + data.message);
                    if ($('.up-page-btn').siblings().length === filesNum) {
                        console.log('完成，可以下一步');
                        var from = GetQueryString('from') || '';
                        if (-1 !== from.indexOf('faceDiagnose')) {
                            window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + the_patientUuid + '&caseUuid=' + uuid;
                        } else if (-1 !== from.indexOf('telePreDiag')) {
                            window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + the_patientUuid + '&caseUuid=' + uuid;
                        } else if (-1 !== from.indexOf('teleDiagnose')) {
                            window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + the_patientUuid + '&caseUuid=' + uuid;
                        } else {
                            window.location = '../html/chartFile.html?patientUuid=' + the_patientUuid;
                        }
                    }
                } else {
                    myalert.tips({
                        txt: data.message,
                        btn: 1,
                        fnok: function() {
                            var from = GetQueryString('from') || '';
                            if (-1 !== from.indexOf('faceDiagnose')) {
                                window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + the_patientUuid + '&caseUuid=' + data.message;
                            } else if (-1 !== from.indexOf('telePreDiag')) {
                                window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + the_patientUuid + '&caseUuid=' + data.message;
                            } else if (-1 !== from.indexOf('teleDiagnose')) {
                                window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + the_patientUuid + '&caseUuid=' + data.message;
                            } else {
                                window.location = '../html/chartFile.html?patientUuid=' + the_patientUuid;
                            }
                        }
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

    /*相册页*/
    function galleryPage() {
        //111111111上传图片按钮
        $('.up-page-btn').on('change', uploadPhoto);
        //33333大图页返回按钮点击//已完成
        $('#big-pic-page .icon-arrowr').swipe({
            tap: function() {
                $('#big-pic-page').addClass('dn');
            }
        });
        //55555预览图点击//已完成
        $('.up-page-smpic').swipe({
            tap: function(e, t) {
                if (t.tagName === 'IMG') {
                    var src = '';
                    if ($(t).data('file')) {
                        var img = new Image();
                        src = "http://www-test.zhaoduiyisheng.com/api/Relation/Attachment/Download?sessionId=" + window.localStorage.sessionId + "&uuid=" + $(t).data('uuid') + "&filename=" + $(t).data('file');
                        img.src = src;
                        $('#big-pic-box').data('file', $(t).data('file'));
                    } else {
                        src = $(t).attr('src');
                    }
                    $('#big-pic-box').css('background-image', 'url(' + src + ')').data('id', $(t).parent().index());
                    $('#big-pic-page').removeClass('dn');
                } else if (t.tagName === 'SPAN') {
                    var theImg = $(t).parent();
                    $('.upload-plus').children().eq(theImg.index()).remove();
                    theImg.remove();
                    e.preventDefault();
                }
            }
        });
        //66666删除按钮点击
        //    $('.del-pic').swipe({
        //        tap: function () {
        //            var galleryol = this.parent().find('ol'),
        //                upol = $('.up-page-smpic'),
        //                html = '';
        //            myalert.run('确定要删除吗？', function () {
        //                var filelist = $('.file-list input'),
        //                    arrImg = [];
        //                galleryol.find('p.checked').each(function () {
        //                    var p = $(this).parent(),
        //                        i = p.index();
        //                    if ($(this).prev().attr('data-file')) {
        //                        arrImg.push($(this).prev().attr('data-file'))
        //                    } else {
        //                        p.remove();
        //                        filelist.eq(i).remove();
        //                    }
        //                });
        //                upol.html('');
        //                galleryol.children().each(function () {
        //                    html = this.outerHTML;
        //                    upol.prepend(html);
        //                });
        //                if (arrImg.length) {
        //                    delCaseData(the_patientUuid, arrImg);
        //                }
        //            },'');
        //        }
        //    });
        //文件改变函数
        function uploadPhoto(e) {
            var can = true,
                This = this.files[0];
            if (This.type.indexOf('image') === 0) {
                $('.up-page-btn').siblings().each(function() {
                    if (This.name === this.files[0].name && This.size === this.files[0].size) {
                        can = false;
                        myalert.tips({
                            txt: "这张照片已传过",
                            btn: 1
                        });
                        return false;
                    }
                });
                if (can) {
                    $("#find-doc-notice").text('');
                    /*上传病例资料*/
                    //uploadDataCase(This);
                    var imgUrl = getObjectURL(This),
                        upol = $('.up-page-smpic');
                    upol.prepend('<li class="pr"><img src=' + imgUrl + '><span class="pa del-pic-2"></span></li>');
                    $(this).removeClass().off('change').parent().append('<input class="up-page-btn" type="file" accept="image/*">');
                    $(this).parent().find('.up-page-btn').on('change', uploadPhoto);
                    $(this).hide();
                    scroll.refresh();
                }
            } else {
                myalert.tips({
                    txt: '请上传图片',
                    btn: 1
                });
            }
        }

        //获取图片地址
        function getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }
    }

    //删除图片文件
    function delCaseData(objUuid, config) {
        $.ajax({
            type: 'POST',
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/DeleteAttachment?sessionId=" + window.localStorage.sessionId + "&uuid=" + objUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(config),
            success: function(data) {
                if (data.code == 0) {
                    $('.up-page-smpic li').eq($('#big-pic-box').data('id')).remove();
                    $('#big-pic-page').addClass('dn');
                    myalert.remove();
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

    //清除输入框内容
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
        clearObj.clearFun("#contact-peo");
        clearObj.clearFun("#contact-tel");

        $(".clear-input").swipe({
            tap: function() {
                $(this).prev().val('');
            }
        });
    }
    $.fn.autoHeight = function() {
        var n = 0;

        function autoHeight(elem) {
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
            if (scroll) {
                scroll.refresh();
                if (n) {
                    scroll.scrollTo(0, scroll.maxScrollY, 0);
                }
                n++;
            }
        }
        this.each(function() {
            autoHeight(this);
            $(this).on('keyup', function() {
                autoHeight(this);
            });
            $(this).on('input', function() {
                autoHeight(this);
            });
            $(this).on('propertychange', function() {
                autoHeight(this);
            });
        });
    }
    $('textarea[autoHeight]').autoHeight();

});
//验证手机号格式
function regPhoneNum(regPhoneNum, regNotice) {
    var $regPhoneNum = $(regPhoneNum);
    var $regNotice = $(regNotice);
    $regPhoneNum.on("blur", function() {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (reg.test($regPhoneNum.val())) {
            $regNotice.text("");
            return true;
        } else {
            $regNotice.text("您输入的手机号无效");
            $regPhoneNum.val('');
            return false;
        }
    });
}
