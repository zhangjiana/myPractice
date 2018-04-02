/**
 * Created by zJ on 2016/1/10.
 */
$(function() {
    var patientUuid = GetQueryString("patientUuid"),
        caseUuid = GetQueryString("caseUuid"),
        orderId = GetQueryString('orderId');
    getHomeMemberDAta(patientUuid);
    $("#orderNum").text(orderId);
    /*定义订单下拉的开关*/
    var orderFlag = true;
    //getServiceProcess(patientUuid,caseUuid);
    var goDocFlag = true;

    if (goDocFlag) {
        $(".go-btn").swipe({
            tap: function(e) {
                window.location.href = '../index.html';
                e.preventDefault();
            }
        });
    }
    $(".chartFile").swipe({
        tap: function() {

            window.location.href = "chartFile.html?patientUuid=" + patientUuid;
            e.preventDefault();
        }
    });
    $("#back").swipe({
        tap: function(e) {
            window.location.href = '../html/newFamily.html';
            e.preventDefault();
        }
    });
    $("#order").swipe({
        tap: function(e) {
            if (orderFlag) {
                $(".order-wrap").removeClass('dn');
                orderFlag = false;
                $("#order-list").slideDown(300, function() {
                    var mySwiper = new Swiper('.swiper-container', {
                        direction: 'vertical',
                        slidesPerView: 3,
                        centeredSlides: true,
                        slideToClickedSlide: true,
                        onSlideChangeEnd: function() {
                            //el.find('p').eq(0).removeClass('c-cyan');
                            var _this = $(".swiper-slide-active");
                            //  console.log(_this.attr('data-case'));
                            $(".process-item").attr('data-caseuuid', _this.attr('data-case'));
                            getServiceProcess(GetQueryString('patientUuid'), _this.attr('data-case'));
                            $("#orderNum").text(_this.attr('data-order'));

                        }
                    });
                }).swipe({
                    tap: function(e) {
                        e.stopPropagation();
                    }
                });
                e.stopPropagation();
            } else {
                $("#order-list").slideUp(300, function() {
                    setTimeout(function() {
                        $(".order-wrap").addClass('dn');
                    }, 10);
                });
                orderFlag = true;
                e.stopPropagation();
            }
        }
    });
    /* $("#scroll-family-info").swipe({
         tap: function(){

             $("#order").css("background",'url("http://imgcdn.zhaoduiyisheng.com/img/icon/list_arrow_down.png") no-repeat right center/0.44rem');
             $("#order-list").slideUp(300,function(){
                 setTimeout(function(){
                     $(".order-wrap").addClass('dn');
                 },10);
             });
             orderFlag = true;
         }
     });*/
    caseList();

    var relation = JSON.parse(window.localStorage.theRelationship);
    /*查询家庭成员资料*/
    var the_head = null,
        the_patientName = null;

    function getHomeMemberDAta(objUuid) {
        $.ajax({
            type: 'GET',
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + objUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    console.log(data.data);


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

                    the_head = head_img;
                    the_patientName = theRelation;

                    $(".mem-head").attr('src', head_img);
                    $("#name").text(theRelation);
                    $("#name").attr('data-name', data.data.name);
                    if (data.data.phone) {
                        $("#tel").text(data.data.phone);
                    } else {
                        $("#tel").text("暂无");
                    }
                    $(".goBasic").swipe({
                        tap: function(e) {
                            window.location.href = "basicInfo.html?patientUuid=" + data.data.uuid + "&from=familyInfo.html";
                            e.preventDefault();
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
        })
    }
    /*查询找对医生的服务流程*/
    function getServiceProcess(patientUuid, caseUuid) {
        $.ajax({
            type: 'GET',
            url: 'http://www-test.zhaoduiyisheng.com/api/Patient/ServiceProcess?sessionId=' + window.localStorage.sessionId + "&patientUuid=" + patientUuid + "&caseUuid=" + caseUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    console.log(data.data);
                    //console.log(data.data.caseUuid);
                    if (data.data.selected.state) {
                        $(".process-item").swipe({
                            tap: function() {
                                window.location.href = "serviceProcess.html?patientUuid=" + patientUuid + "&caseUuid=" + $(this).attr('data-caseuuid') + "&patientName=" + $("#name").attr('data-name');
                                e.preventDefault();
                            }
                        });
                        goDocFlag = false;
                        $(".choose").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_xzfw_on.png)");
                        $(".choose").next().addClass("c-cyan");

                        //以下图标恢复原状
                        $(".upload").next().removeClass("c-cyan");
                        $(".process-arrow").eq(0).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");
                        $(".upload").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_sczl_off.png)");

                        $(".match").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jzpp_off.png)");
                        $(".match").next().removeClass("c-cyan");
                        $(".process-arrow").eq(1).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");


                        $(".pay").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_pay_off.png)");
                        $(".pay").next().removeClass("c-cyan");
                        $(".process-arrow").eq(2).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                        $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_off.png)");
                        $(".consult").next().removeClass("c-cyan");
                        $(".process-arrow").eq(3).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                        $(".go-btn-wrap").html('<a class="go-btn-check" href="../html/caseData.html?&patientUuid=' + patientUuid + '&caseUuid=' + caseUuid + '&orderId=' + $("#orderNum").text() + '&edit=true">请上传资料</a><br><br><span class="c-red">如果暂时无法上传资料,我们的医学专员会联系您</span>');


                        if (data.data.uploaded.state) {
                            goDocFlag = false;

                            $(".choose").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_xzfw_on.png)");
                            $(".choose").next().addClass("c-cyan");
                            $(".upload").next().addClass("c-cyan");
                            $(".process-arrow").eq(0).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_on.png)");
                            $(".upload").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_sczl_on.png)");
                            //以下图标恢复原状
                            $(".match").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jzpp_off.png)");
                            $(".match").next().removeClass("c-cyan");
                            $(".process-arrow").eq(1).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");


                            $(".pay").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_pay_off.png)");
                            $(".pay").next().removeClass("c-cyan");
                            $(".process-arrow").eq(2).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                            $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_off.png)");
                            $(".consult").next().removeClass("c-cyan");
                            $(".process-arrow").eq(3).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                            $(".go-btn-wrap").html("找对医生正在查看您上传的病历，以便精准匹配大专家！");

                        }

                        if (data.data.matched.state) {
                            $(".match").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jzpp_on.png)");
                            $(".match").next().addClass("c-cyan");
                            $(".process-arrow").eq(1).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_on.png)");



                            $(".pay").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_pay_off.png)");
                            $(".pay").next().removeClass("c-cyan");
                            $(".process-arrow").eq(2).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                            $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_off.png)");
                            $(".consult").next().removeClass("c-cyan");
                            $(".process-arrow").eq(3).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");


                            $(".go-btn-wrap").html('恭喜您！精准匹配成功!<span class="go-btn-check">查看</span>');
                            caseDetails(data.data.caseUuid);

                        }
                        if (data.data.paid.state) {
                            $(".pay").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_pay_on.png)");
                            $(".pay").next().addClass("c-cyan");
                            $(".process-arrow").eq(2).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_on.png)");

                            $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_off.png)");
                            $(".consult").next().removeClass("c-cyan");
                            $(".process-arrow").eq(3).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");



                            $(".go-btn-wrap").html("您已成功支付，我们正在为您预约大专家！");
                        }
                        if (data.data.appointed.state) {
                            $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_on.png)");
                            $(".consult").next().addClass("c-cyan");
                            $(".process-arrow").eq(3).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_on.png)");
                            $(".go-btn-wrap").html('恭喜您！预约名医成功!<span class="go-btn-check success">查看</span>');
                            /*  $(".go-btn-wrap").swipe({
                                  tap: function(e){

                                      e.preventDefault();
                                  }
                              })*/
                        }
                        if (data.data.finished.state) {

                            goDocFlag = true;

                            $(".choose").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_xzfw_off.png)");
                            $(".upload").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_sczl_off.png)");
                            $(".match").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jzpp_off.png)");
                            $(".pay").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_pay_off.png)");
                            $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_off.png)");


                            $(".choose").next().removeClass("c-cyan");
                            $(".upload").next().removeClass("c-cyan");
                            $(".match").next().removeClass("c-cyan");
                            $(".pay").next().removeClass("c-cyan");
                            $(".consult").next().removeClass("c-cyan");

                            $(".process-arrow").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                            $(".go-btn-wrap").html('<span class="go-btn centerX">找对医生</span>');

                            $(".go-btn").swipe({
                                tap: function(e) {
                                    window.location.href = '../index.html';
                                    e.preventDefault();
                                }
                            });
                        }
                    }else{
                        //以下图标恢复原状
                        $(".choose").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_xzfw_off.png)");
                        $(".choose").next().removeClass("c-cyan");

                        $(".upload").next().removeClass("c-cyan");
                        $(".process-arrow").eq(0).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");
                        $(".upload").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_sczl_off.png)");

                        $(".match").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jzpp_off.png)");
                        $(".match").next().removeClass("c-cyan");
                        $(".process-arrow").eq(1).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");


                        $(".pay").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_pay_off.png)");
                        $(".pay").next().removeClass("c-cyan");
                        $(".process-arrow").eq(2).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                        $(".consult").css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_zxdzj_off.png)");
                        $(".consult").next().removeClass("c-cyan");
                        $(".process-arrow").eq(3).css("background-image", "url(http://imgcdn.zhaoduiyisheng.com/img/icon/icon_jt_off.png)");

                        $(".go-btn-wrap").html('<span class="go-btn centerX">找对医生</span>');
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
                        window.localStorage.caseList = JSON.stringify(data.data);
                        $("#orderNum").text(data.data[0].orderId);
                        $(".process-item").attr('data-caseuuid', data.data[0].uuid);

                        createOrderList(data.data);
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
        })
    }

    function createOrderList(data) {
        $("#swiper-wrapper").html('');
        var n = 0;
        $.each(data, function(i) {

            if(data[i].orderId){
                if (!n) {
                    getServiceProcess(GetQueryString('patientUuid'), data[i].uuid);
                    $('#orderNum').text(data[i].orderId);
                    n++;
                    $("#order").removeClass('dn');
                }
                var $Li = $('<li class="swiper-slide f28" data-case=' + data[i].uuid + ' data-order=' + data[i].orderId + '><span class="c-33 f28">' + data[i].caseName + '</span>' + '<span class="c-66 f24">订单号:<em>' + data[i].orderId + '</em></span></li>');
            $("#swiper-wrapper").append($Li);
            }
        });
    }

    function caseDetails(objCaseUuid) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/Case?sessionId=" + window.localStorage.sessionId + "&caseUuid=" + objCaseUuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    $(".go-btn-check").swipe({
                        tap: function(e) {
                            if ($(this).hasClass('success')) {
                                window.location.href = "../html/serveNotice.html?patientUuid=" + GetQueryString('patientUuid') + "&caseUuid=" + objCaseUuid + "&patientName=" + $("#name").attr('data-name') + "&orderId=" + data.data.orderId;
                                $(".go-btn-check").removeClass('success');
                            } else {
                                window.location.href = "../html/selectService.html?patientUuid=" + GetQueryString('patientUuid') + "&caseUuid=" + objCaseUuid + "&clinicService=" + data.data.clinicService + "&orderId=" + data.data.orderId;
                            }
                            e.preventDefault();
                        }
                    })
                }
            }
        })

    }
});
