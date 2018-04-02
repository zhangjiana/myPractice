/**
 * Created by zJ on 2016/1/12.
 */
$(function() {
    var caseUuid = GetQueryString('caseUuid');
    var scroll = new IScroll('#scroll-case-data', {
        probeType: 3,
        mouseWheel: true
    });
    //getHomeMemberDAta(caseUuid);
    var the_patientUuid = GetQueryString('patientUuid');
    var oldfilename;
    var olddescription;
    var oldpic;
    getCaseData(caseUuid);
    $("#more").swipe({
        tap: function() {
            $(this).toggleClass('icon-close');
            $('.up-page-smpic').toggleClass('more');
            scroll.refresh();
        }
    });
    if('true' === GetQueryString('edit')){
        $('#edit').text('完成');
        $('.upload-plus').removeClass('dn');
        $('#file-name').attr('disabled', false);
        $('#description').attr('disabled', false);
        $('.del-pic-2').removeClass('dn');
        $('#no-data').addClass('dn');
    }
    $('#edit').swipe({
        tap: function() {
            if ('编辑' === this.text()) {
                this.text('完成');
                $('.upload-plus').removeClass('dn');
                $('.del-pic-2').removeClass('dn');
                $('#file-name').attr('disabled', false);
                $('#description').attr('disabled', false);
                $('#no-data').addClass('dn');
            } else {
                //ajax modifyCase(objData)
                if ($('.up-page-smpic li p')[0]) {
                    myalert.tips({
                        txt: '请等待图片上传完成',
                        btn: 1
                    });
                } else {

                    var newfilename = $('#file-name').val();
                    var newdescription = $('#description').val();
                    var newpic = $('.up-page-smpic').html().replace(/\s?dn\s?/g,'');
                    if (newfilename !== oldfilename || newdescription !== olddescription || oldpic !== newpic) {
                        var set = {
                            "caseUuid": caseUuid,
                            "patientUuid": the_patientUuid,
                            "caseName": newfilename,
                            "description": newdescription
                        };
                        console.log(set);
                        modifyCase(set);
                        $('#upload-notice').text('');
                        this.text('编辑');
                        $('.upload-plus').addClass('dn');
                        $('.del-pic-2').addClass('dn');
                        $('#file-name').attr('disabled', true);
                        $('#description').attr('disabled', true);
                        if (1 === $('.upload-plus').siblings().length) {
                            $('#no-data').removeClass('dn');
                        }
                    } else if (!newfilename) {
                        $('#upload-notice').text('请填写病历名称');
                    } else if (!newdescription) {
                        $('#upload-notice').text('请输入病情描述');
                    }else if(newfilename == oldfilename && newdescription == olddescription && oldpic == newpic){
                        $('#upload-notice').text('');
                        this.text('编辑');
                        $('.upload-plus').addClass('dn');
                        $('.del-pic-2').addClass('dn');
                        $('#file-name').attr('disabled', true);
                        $('#description').attr('disabled', true);
                        if (1 === $('.upload-plus').siblings().length) {
                            $('#no-data').removeClass('dn');
                        }
                    }
                }
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
                        scroll.refresh();
                    }
                }
            });
        }
    });

    /*查询病历详情*/
    function getCaseData(objUuid) {
        $.ajax({
            type: 'GET',
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/Case?sessionId=" + window.localStorage.sessionId + "&caseUuid=" + objUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    console.log(data.data);
                    if(data.data.orderId == 0){
                        $(".need-doctor").removeClass('dn');
                    }else{
                        $(".need-doctor").addClass('dn');
                    }
                    /* $("#relationship").text(data.data.patient.relationship);

                     /!*判断姓名*!/
                     if (data.data.patient.name) {
                         $("#name").text(data.data.patient.name);
                     } else {
                         $("#name").text('"暂未填写');
                     }
                     //    判断性别
                     if (data.data.patient.gender) {
                         if (data.data.gender == 'male') {
                             $("#sex-text").attr("data-sex", 'male');
                             $("#sex-text").text("男");
                         } else {
                             $("#sex-text").attr("data-sex", 'female');
                             $("#sex-text").text("女");
                         }
                     } else {
                         $("#sex-text").text("暂未填写");
                     }
                     /!*出生日期*!/
                     if (data.data.patient.birthDate) {
                         $("#birth-text").text(data.data.patient.birthDate.slice(0, 4));
                     } else {
                         $("#birth-text").text('暂未填写');
                     }
                     //城市
                     if (data.data.patient.city) {
                         getLocation(data.data.patient.province, data.data.patient.city);
                     } else {
                         $("#province-val").text("暂未填写");
                     }*/
                    $("#file-name").val(data.data.caseName);
                    var galleryol = $('.up-page-smpic');
                    if (data.data.attachList.length) {
                        var fileName = data.data.attachList,
                            j = 0,
                            len = fileName.length,
                            str = '';
                        var dn1 = 'true' === GetQueryString('edit')?'':'dn';
                        for (; j < len; j++) {
                            str += '<li><img data-file="' + fileName[j] + '" data-uuid="' + data.data.patient.uuid + '" data-case="' + objUuid + '" src="' + "http://www-test.zhaoduiyisheng.com/api/Patient/Attachment/Thumbnail/Download?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + data.data.patient.uuid + "&caseUuid=" + objUuid + "&filename=" + fileName[j] + '"><span class="pa del-pic-2 ' + dn1+ '"></span></li>';
                        }
                        galleryol.prepend(str);
                    } else {
                        var dn = 'true' === GetQueryString('edit')?'dn':'';
                        galleryol.prepend('<em id="no-data" class="db tc f28 c-99 '+dn+'">暂无资料</em>');
                    }

                    $("#description").val(data.data.description);
                    $('textarea[autoHeight]').autoHeight();
                    oldfilename = data.data.caseName;
                    olddescription = data.data.description;
                    oldpic = $('.up-page-smpic').html().replace(/\s?dn\s?/g,'');
                    galleryPage();
                    scroll.refresh();
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
                    var from = GetQueryString('from') || '';
                    if (-1 !== from.indexOf('faceDiagnose')) {
                        window.location = '../html/faceDiagnose.html?clinicService=local_face&patientUuid=' + the_patientUuid+'&caseUuid=' + caseUuid;
                    } else if (-1 !== from.indexOf('telePreDiag')) {
                        window.location = '../html/telePreDiag.html?clinicService=remote_conference&patientUuid=' + the_patientUuid+'&caseUuid=' + caseUuid;
                    } else if (-1 !== from.indexOf('teleDiagnose')) {
                        window.location = '../html/teleDiagnose.html?clinicService=remote_face&patientUuid=' + the_patientUuid+'&caseUuid=' + caseUuid;
                    } else {
                        window.location.href = 'sumitSucc.html?patientUuid=' + the_patientUuid + '&caseUuid=' + caseUuid + "&orderId=" + GetQueryString('orderId');
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
    /*上传病例资料*/
    function uploadDataCase(file, i) {
        var formData = new FormData();
        formData.append("attachment", file);
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/Attachment/Upload?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + the_patientUuid + "&caseUuid=" + caseUuid,
            contentType: false,
            dataType: 'json',
            data: formData,
            processData: false,
            success: function(data) {
                if (data.code == 0) {
                    // console.log("上传资料" + data.message);
                    $('.up-page-smpic li[data-num="' + i + '"]').find('p').remove();
                } else {
                    myalert.tips({
                        txt: "上传图片失败",
                        btn: 1,
                        fnok:function(){
                            $('.up-page-smpic li[data-num="' + i + '"]').remove();
                            myalert.remove();
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
                        src = "http://www-test.zhaoduiyisheng.com/api/Patient/Attachment/Download?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + $(t).data('uuid') + '&caseUuid=' + $(t).data('case') + "&filename=" + $(t).data('file');
                        img.src = src;
                        $('#big-pic-box').data('file', $(t).data('file'));
                    } else {
                        src = $(t).attr('src');
                    }
                    $('#big-pic-box').css('background-image', 'url(' + src + ')').data('id', $(t).parent().index());
                    $('#big-pic-page').removeClass('dn');
                } else if (t.tagName === 'SPAN') {
                    var theImg = $(t).prev(),
                        file = theImg.data('file'),
                        index = theImg.parent().index();
                    if (file) {
                        var arr = [];
                        arr.push(file);
                        delCaseData(the_patientUuid, arr, index);
                    } else {
                        theImg.parent().remove();
                        e.preventDefault();
                        scroll.refresh();
                    }
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
                This = this.files[0],
                index = $(this).index();
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
                    uploadDataCase(This, index);
                    var imgUrl = getObjectURL(This),
                        upol = $('.up-page-smpic');
                    upol.prepend('<li class="pr" data-num="' + index + '""><img src=' + imgUrl + '><span class="pa del-pic-2"></span><p></p></li>');
                    $(this).removeClass().off('change').parent().append('<input class="up-page-btn" type="file" accept="image/*">');
                    $(this).parent().find('.up-page-btn').on('change', uploadPhoto);
                    $(this).hide();
                    if(upol.children().length>4){
                        upol.addClass('more');
                    }
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
    function delCaseData(objUuid, config, index) {
        $.ajax({
            type: 'POST',
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/DeleteAttachment?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + objUuid + '&caseUuid=' + GetQueryString('caseUuid'),
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(config),
            success: function(data) {
                if (data.code == 0) {
                    var id = $('#big-pic-box').data('id') || index;
                    $('.up-page-smpic li').eq(id).remove();
                    $('#big-pic-page').addClass('dn');
                    myalert.remove();
                    console.log(data.message);
                    scroll.refresh();
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
});
