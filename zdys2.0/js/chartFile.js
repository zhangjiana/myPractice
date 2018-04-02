/**
 * Created by zJ on 2016/2/24.
 */
$(function() {
    caseList();
    $("#add").swipe({
        tap: function() {
            window.location.href = "uploadData.html?patientUuid=" + GetQueryString("patientUuid");
        }
    });
    $("#back").swipe({
        tap: function(e) {
            window.location.href = '../html/familyInfo.html?patientUuid=' + GetQueryString("patientUuid");
            e.preventDefault();
        }
    });
});


/*查询病例列表*/
function caseList() {
    $.ajax({
        type: "GET",
        url: "http://www-test.zhaoduiyisheng.com/api/Patient/CaseList?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + GetQueryString("patientUuid"),
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        success: function(data) {
            if (data.code == 0) {
                console.log(data.data);
                if (data.data.length !== 0) {
                    $("#caseList").html('');
                    $.each(data.data, function(i) {
                        var $Li = '<li class="f30 c-33 case pr" data-orderId="'+data.data[i].orderId+'" data-caseUuid="' + data.data[i].uuid + '">' + data.data[i].caseName;
                            if(data.data[i].orderId){
                                $Li += '<span class="fr c-66" style="margin-right: .5rem;">订单号:' + data.data[i].orderId + '</span>';
                            }
                            $Li+= '<p class="del-chart pa tc prl30 transX100">删除</p></li>';
                        /* $Li.swipe({
                             tap: function(){
                                 window.location.href = "uploadData.html?patientUuid="+GetQueryString("patientUuid")+"&caseUuid="+data.data.uuid;
                             }
                         });*/

                        $("#caseList").append($Li);
                    });

                    $(".case").swipe({
                        tap: function() {
                            window.location.href = "caseData.html?patientUuid=" + GetQueryString("patientUuid") + "&caseUuid=" + $(this).attr('data-caseUuid')+"&orderId="+$(this).attr('data-orderId');
                        }
                    });

                    $('#caseList>li').each(function() {
                        $(this).swipe({
                            swipeLeft: function() {
                                this.children().last().removeClass('transX100');
                                this.siblings().children().last().addClass('transX100');
                            },
                            swipeRight: function() {
                                this.children().last().addClass('transX100');
                            }
                        });
                    });
                    $("#caseList").append('<p class="c-red pt20 pb20 f28 tc" id="tips"></p>');
                    $('.del-chart').swipe({
                        tap: function(e) {
                            var This = this;
                            $.ajax({
                                type: "POST",
                                url: "http://www-test.zhaoduiyisheng.com/api/Patient/DeleteCase?sessionId=" + window.localStorage.sessionId,
                                contentType: "text/plain; charset=UTF-8",
                                dataType: 'json',
                                data: this.parent().data('caseuuid'),
                                success: function(data) {
                                    if (0 === data.code) {
                                        This.parent().remove();
                                        $('#tips').text('');
                                    } else {
                                        myalert.tips({
                                            txt: data.message,
                                            btn: 1
                                        });
                                    }
                                }
                            });
                            e.stopPropagation();
                        }
                    });
                    if (!getCookie('delChart')) {
                        setCookie('delChart', 'on', 180);
                        $('body').append('<div class="alert-wrap"><img class="deltip centerX" src="http://imgcdn.zhaoduiyisheng.com/img/deltip.png" alt="" /><img class="iknow center" src="http://imgcdn.zhaoduiyisheng.com/img/iknow.png" alt="" /></div>');
                        $('.iknow').swipe({
                            tap: function() {
                                $('.alert-wrap').remove();
                            }
                        });
                    }
                    var scroll = new IScroll('.section-main', {
                        probeType: 3,
                        mouseWheel: true
                    });
                    setTimeout(function() {
                        scroll.refresh();
                    }, 500);
                } else if (!getCookie('addChart')) {
                    setCookie('addChart', 'on', 180);
                    $('body').append('<div class="alert-wrap"><img class="addtip fr" src="http://imgcdn.zhaoduiyisheng.com/img/addtip.png" alt="" /><img class="iknow center" src="http://imgcdn.zhaoduiyisheng.com/img/iknow.png" alt="" /></div>');
                    $('.iknow').swipe({
                        tap: function() {
                            $('.alert-wrap').remove();
                        }
                    });
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
