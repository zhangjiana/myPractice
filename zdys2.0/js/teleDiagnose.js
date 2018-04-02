/**
 * Created by zJ on 2016/2/24.
 */
$(function() {
    //获取家庭成员;
    getHomeMember();
    /*创建回到首页图标*/
    createDot();
    var con;
    setTimeout(function() {
        con = new IScroll('#scroll', {
            scrollX: false,
            scrollY: true
        });
    }, 500);
    var slideDownFlag = false;

    var memFlag = false, //是否选择家人开关
        caseFlag = false, //是否描述病情
        caseNum = false, //该家人是否 有病例
        memPhone = false,
        chooseMem = false; //该家人是否有手机号

    $("#back").swipe({
        tap: function(e) {
            window.location.href = '../index.html';
            e.preventDefault();
        }
    });

    $("#add-mem").swipe({
        tap: function() {
            judgePage();
            window.location.href = '../html/addMember.html?from=' + page;
        }
    });

    $("#more").swipe({
        tap: function() {

            var height = -($(this).offset().top - $(this).parent().height() / 2 - $('header').height());
            console.log(height);
            if (slideDownFlag) {

                $("#service-instro").slideDown(300);
                $(this).text("收起");
                setTimeout(function() {
                    con.refresh();
                    con.scrollTo(0, height, 300);
                }, 400);
                slideDownFlag = false;
            } else {
                $(this).text("更多");
                $("#service-instro").slideUp(300);
                setTimeout(function() {
                    con.refresh();
                    con.scrollTo(0, 0, 300);
                }, 400);
                slideDownFlag = true;
            }
        }
    });

    var patientUuid = null,
        caseUuid = null,
        cliService = GetQueryString('clinicService'),
        page = null;


    patientJudge();
    caseJudge();

    function judgePage() {
        if (cliService == "remote_face") {
            page = "teleDiagnose.html?clinicService=" + cliService;
        } else if (cliService == "local_face") {
            page = "faceDiagnose.html?clinicService=" + cliService;
        } else if (cliService == "remote_conference") {
            page = "telePreDiag.html?clinicService=" + cliService;
        } else {
            page = null;
        }
    }

    function patientJudge(obj) {
        if (obj) {
            patientUuid = obj.attr('data-uuid');
            if (patientUuid) {
                caseList(patientUuid);
                getMemData(patientUuid);
                memberData(patientUuid); //同上
                memFlag = true;
            } else {
                memFlag = false;
            }
        } else if (GetQueryString('patientUuid')) {

            patientUuid = GetQueryString('patientUuid');
            caseList(patientUuid); //查询此人病历列表
            getMemData(patientUuid); //查询此人是否有手机号
            memberData(patientUuid); //创建家庭成员
            memFlag = true;

        } else {
            memFlag = false;
        }
    }

    function caseJudge(obj) {
        if (obj) {
            caseUuid = obj.attr('data-caseuuid');
            if (caseUuid) {
                console.log(patientUuid);

                caseData(caseUuid);
                caseFlag = true;
            } else {
                caseFlag = false;
            }
        } else if (GetQueryString('caseUuid')) {
            caseUuid = GetQueryString('caseUuid');
            console.log(patientUuid);
            console.log(caseUuid);

            caseData(caseUuid); //创建底部病历列表
            caseFlag = true;
        } else {
            caseFlag = false;
        }
    }

    //选择家人
    if (GetQueryString('patientUuid') && window.localStorage.selMember) {
        var relation = JSON.parse(window.localStorage.theRelationship)[window.localStorage.selMember] || window.localStorage.selMember;
        $("#choose-member h2").html('您选择的家人是<em id="obj" class="c-cyan">' + relation + '</em><em class="family-arrow no-margin"></em>');
        $("#choose-chart h2").html('<em class="c-cyan">' + relation + '</em>的病情描述<em class="family-arrow no-margin"></em>');
    }

    var $selMember;
    $("#choose-member").swipe({
        tap: function() {
            if (!localStorage.openid && (!getCookie('user') || '00' === getCookie('user'))) {
                myalert.tips({
                    txt: "您未登录，请先登录",
                    fnok: function() {
                        window.location.href = '/html/newLogin.html';
                    },
                    notxt: "逛一逛",
                    oktxt: "去登录"
                });
            } else {
                con.refresh();
                myalert.family(function() {
                    //patientUuid = $(".swiper-slide-active").find("p").attr('data-uuid');
                    //var   memData = window.localStorage.allMember;
                    patientJudge($(".swiper-slide-active").find("p"));
                    // $selMember = $(".swiper-slide-active").find("p").text();
                    $("#choose-member").attr('data-uuid', patientUuid);
                    console.log("cho-mem" + patientUuid + ":" + caseUuid);
                    //caseList(patientUuid);
                    //console.log(patientUuid);
                    /*使底部相对应的家人为 显示 状态*/
                    //memberData(patientUuid);
                    //查询家庭成员是否有手机号码;
                    //getMemData(patientUuid);
                    console.log(memFlag);
                    popContent(patientUuid);
                    memFlag = true;
                    caseFlag = false;
                    chooseMem = true;
                    $selMember = $("#sel-peo .swiper-slide-active p").attr('data-relationship');
                    var relation = JSON.parse(window.localStorage.theRelationship)[$selMember] || $selMember;
                    $("#choose-member h2").html('您选择的家人是<em id="obj" class="c-cyan">' + relation + '</em><em class="family-arrow no-margin"></em>');
                    window.localStorage.selMember = $selMember;
                    $("#choose-chart h2").html('<em class="c-cyan">' + relation + '</em>的病情描述<em class="family-arrow no-margin"></em>');
                }, function() {
                    judgePage();
                    window.location.href = '../html/addMember.html?from=' + page;
                });

                if (!getCookie('firstUse')) {
                    setCookie('firstUse', 'abc', 180);
                    $('body').append('<div class="alert-wrap"><img class="centerX add-word" src="http://imgcdn.zhaoduiyisheng.com/img/scrollword.png" alt="" />' +
                        '<img class="scrolltip center" src="http://imgcdn.zhaoduiyisheng.com/img/scrolltip.png" alt="" /><img class="iknow centerX" src="http://imgcdn.zhaoduiyisheng.com/img/iknow.png" alt="" /></div>');
                    $('.iknow').swipe({
                        tap: function() {
                            $('.alert-wrap').last().remove();
                        }
                    });
                }
            }
        }
    });
    //选择病例
    $("#choose-chart").swipe({
        tap: function() {
            if (!localStorage.openid && (!getCookie('user') || '00' === getCookie('user'))) {
                myalert.tips({
                    txt: "您未登录，请先登录",
                    fnok: function() {
                        window.location.href = '/html/newLogin.html';
                    },
                    notxt: "逛一逛",
                    oktxt: "去登录"
                });
            } else {
                con.refresh();
                if (chooseMem) {
                    patientJudge($("#choose-member"));
                } else {
                    patientJudge();
                }
                console.log(memFlag);
                if (memFlag) {
                    if (caseNum) {
                        myalert.chartFile(function() {
                            caseUuid = $(".swiper-slide-active").attr('data-caseuuid');

                            console.log("cho-Chart" + patientUuid + ":" + caseUuid);
                            /*使底部相对应的病历 为显示状态*/
                            caseData(caseUuid);
                            caseFlag = true;

                            var $selCase = $("#chart .swiper-slide-active").text();
                            $("#choose-chart h2").html('您为<em class="c-cyan">' + $("#obj").text() + '</em>描述的病情是<em class="c-cyan">' + $selCase + '</em><em class="family-arrow no-margin"></em>');
                        }, function() {
                            judgePage();
                            window.location.href = 'uploadData.html?patientUuid=' + patientUuid + '&from=' + page;
                        });
                        if (!$("#chart").html()) {
                            myalert.tips({
                                txt: "您没有新的病情要咨询",
                                fnno: function() {
                                    judgePage();
                                    window.location.href = 'uploadData.html?patientUuid=' + patientUuid + '&from=' + page;
                                },
                                notxt: "添加新的病症",
                                oktxt: "先不描述"
                            })
                        }
                        caseNum = false;
                    } else {
                        myalert.tips({
                            txt: "请您描述病情",
                            fnno: function() {
                                judgePage();
                                window.location.href = 'uploadData.html?patientUuid=' + patientUuid + '&from=' + page;
                            },
                            notxt: "添加新的病症",
                            oktxt: "先不描述"
                        })
                    }
                } else {
                    myalert.tips({
                        txt: "请先选择家人",
                        btn: 1
                    })
                }
            }
        }
    });

    //底部弹出 的点击内容
    popContent(patientUuid);

    //底部弹出 的点击内容
    function popContent(objUuid) {

        //立即预约
        $("#appointment").swipe({
            tap: function() {
                if (!localStorage.openid && (!getCookie('user') || '00' === getCookie('user'))) {
                    myalert.tips({
                        txt: "您未登录，请先登录",
                        fnok: function() {
                            window.location.href = '/html/newLogin.html';
                        },
                        notxt: "逛一逛",
                        oktxt: "去登录"
                    });
                } else {
                    //console.log("memFlag:"+memFlag);
                    //console.log("caseFlag:"+caseFlag);
                    //console.log("memPhone:"+memPhone);
                    //console.log(objUuid);
                    con.scrollToElement('#choose-chart', 300);
                    if (memFlag && caseFlag && memPhone) {
                        setTimeout(function() {
                            var foot = new IScroll('#foot-content', {
                                scrollX: false,
                                scrollY: true
                            });

                        }, 300);
                        $("#confirm-appointment").removeClass('dn');
                        setBottom();
                        $(".footer-pop").css({
                            "-webkit-transform": "translateY(0)",
                            "transform": "translateY(0)"
                        });

                        //memFlag = false;
                        //caseFlag = false;
                        //memPhone = false;
                    } else if (memFlag && caseFlag) {
                        myalert.tips({
                            txt: "您的家人信息不完整，请先补全家人信息",
                            btn: 2,
                            oktxt: "先不添加",
                            notxt: "去添加",
                            fnno: function() {
                                judgePage();
                                window.location.href = '../html/basicInfo.html?patientUuid=' + objUuid + '&from=' + page + '&caseUuid=' + caseUuid;
                            }
                        });
                        //memFlag = false;
                        //caseFlag = false;
                    } else if (caseFlag) {
                        myalert.tips({
                            txt: "请先选择家人",
                            btn: 1
                        })
                    } else if (memFlag) {
                        myalert.tips({
                            txt: "请先描述病情",
                            btn: 1
                        })
                    } else {
                        myalert.tips({
                            txt: "请选择一位家人",
                            btn: 1
                        })
                    }
                }
            }
        });
        //确认提交
        $("#confirm-submit").swipe({
            tap: function() {
                /* var patient = null,
                     caseId = null;*/
                patientUuid = $('.family-mem .active').attr('data-uuid');
                caseJudge($('.case-list .active'));

                console.log("confirm" + patientUuid + ":" + caseUuid);
                prepareNow(patientUuid, caseUuid);

            }
        });
        //关闭底部弹窗
        $("#closePop").swipe({
            tap: function() {
                $(".footer-pop").css({
                    "-webkit-transform": "translateY(100%)",
                    "transform": "translateY(100%)"
                });
                setTimeout(function() {
                    $("#confirm-appointment").addClass('dn');
                }, 200);

            }
        });

        /* //选择家人
         $(".family-mem span").swipe({
         tap: function(){
         $(this).addClass('active').siblings().removeClass('active');
         }
         });
         //描述病情
         $(".case-list span").swipe({
         tap: function(){
         $(this).addClass('active').parent().siblings().find('span').removeClass('active');
         }
         });*/


    }

    //获取家庭成员;
    function getHomeMember() {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientList?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    window.localStorage.allMember = JSON.stringify(data.data);
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

    /*查询病例列表*/
    function caseList(patientUuid) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/CaseList?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + patientUuid + "&hash=555",
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    window.localStorage.caseList = JSON.stringify(data.data);
                    console.log(data.data);
                    //caseNum = data.data.length;
                    if (data.data.length !== 0) {
                        caseNum = true;
                    } else {
                        caseNum = false;
                    }
                } else if (data.code == 909) {
                    loginTimeOut();
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    //myalert.tips({
                    //    txt: "会话超时，请重新登录",
                    //    fnok: function() {
                    //        window.location = "../html/newLogin.html";
                    //    },
                    //    btn: 1
                    //});
                    loginTimeOut();
                }
            }
        })
    }
    /*点击确定后立即预约*/
    function prepareNow(objPatient, objCase) {
        var config = {
            "patientUuid": objPatient,
            "caseUuid": objCase,
            "clinicService": GetQueryString('clinicService')
        };
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/Order/Prepare?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            data: JSON.stringify(config),
            success: function(data) {
                console.log(data);
                if (data.code == 0) {
                    console.log(data.data);
                    window.location.href = 'sumitSucc.html?patientUuid=' + objPatient + '&caseUuid=' + objCase + "&orderId=" + data.data.orderId + "&clinicService=" + GetQueryString('clinicService');
                } else if (data.code == 909) {
                    loginTimeOut();
                } else {
                    myalert.tips({
                        txt: data.message,
                        btn: 1,
                        fnok: function() {
                            myalert.remove();
                            $(".footer-pop").css({
                                "-webkit-transform": "translateY(100%)",
                                "transform": "translateY(100%)"
                            });
                            setTimeout(function() {
                                $("#confirm-appointment").addClass('dn');
                            }, 200);
                        }
                    });
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    //myalert.tips({
                    //    txt: "会话超时，请重新登录",
                    //    fnok: function() {
                    //        window.location = "../html/newLogin.html";
                    //    },
                    //    btn: 1
                    //});
                    loginTimeOut();
                }
            }
        })
    }

    /*底部---创建家庭成员*/
    function memberData(objPatient) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientList?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    console.log(objPatient);
                    $('.family-mem').html('');
                    $.each(data.data, function(i) {
                        var relation = JSON.parse(window.localStorage.theRelationship)[data.data[i].relationship] || data.data[i].relationship;
                        var $span = $('<span data-uuid=' + data.data[i].uuid + '>' + relation + '</span>');
                        if (objPatient == data.data[i].uuid) {
                            $span.addClass('active');
                            var relation2 = JSON.parse(window.localStorage.theRelationship)[$selMember] || $selMember;
                            $("#obj").text(relation2);
                        }
                        $('.family-mem').append($span);
                    });
                } else if (data.code == 909) {
                    loginTimeOut();
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    //myalert.tips({
                    //    txt: "会话超时，请重新登录",
                    //    fnok: function() {
                    //        window.location = "../html/newLogin.html";
                    //    },
                    //    btn: 1
                    //});
                    loginTimeOut();
                }
            }

        });
    }
    /*底部---创建病历列表*/
    function caseData(objCase) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Patient/CaseList?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + patientUuid + "&hash=555",
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    $('.case-name').html('');
                    $.each(data.data, function(i) {
                        if (data.data[i].orderId == 0) {
                            var $p = $('<p><span data-caseuuid=' + data.data[i].uuid + '>' + data.data[i].caseName + '</span></p>');
                            if (objCase == data.data[i].uuid) {
                                $p.find('span').addClass('active');
                                $("#choose-chart h2").html('您为<em class="c-cyan">' + $("#obj").text() + '</em>描述的病情是<em class="c-cyan">' + data.data[i].caseName + '</em><em class="family-arrow no-margin"></em>');
                            }
                            $(".case-name").append($p);
                        }

                    });
                } else if (data.code == 909) {
                    loginTimeOut();
                }

            },
            error: function(res) {
                if (res.status == 401) {
                    //myalert.tips({
                    //    txt: "会话超时，请重新登录",
                    //    fnok: function() {
                    //        window.location = "../html/newLogin.html";
                    //    },
                    //    btn: 1
                    //});
                    loginTimeOut();
                }
            }
        });

    }
    //查询家人是否有手机号
    function getMemData(objuuid) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + objuuid,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    if (data.data.name && data.data.phone) {
                        memPhone = true;
                    } else {
                        memPhone = false;
                    }
                } else if (data.code == 909) {
                    loginTimeOut();
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    //myalert.tips({
                    //    txt: "会话超时，请重新登录",
                    //    fnok: function() {
                    //        window.location = "../html/newLogin.html";
                    //    },
                    //    btn: 1
                    //});
                    loginTimeOut();
                }
            }

        })
    }

    function setBottom() {


        if ($(".set-bottom").height() > $("#foot-content").height()) {
            $(".set-bottom").addClass('top0').removeClass('bottom0');
        } else {
            $(".set-bottom").removeClass('top0').addClass('bottom0');
        }
    }
    /*创建回到首页图标*/

    function createDot(){
        var new_element_N=document.createElement("style");
        new_element_N.innerHTML = '#drager {' +
            '     position: fixed;' +
            '     width: .68rem;' +
            '     height: .68rem;' +
            '     background: url(../img/icon/icon_index.png) no-repeat center rgba(0,0,0,.48);' +
            '     background-size: .5rem;' +
            '     z-index: 10000;' +
            '     bottom: 24%;' +
            '     right: 0px;' +
            ' }' +
            ' #drager:hover>div{' +
            '      background-color: rgba(0, 0, 0, 0.6);' +
            ' } ';
        document.body.appendChild(new_element_N);
        new_element_N=document.createElement('div');
        new_element_N.setAttribute("id","drager");
        document.body.appendChild(new_element_N);
        var posX;
        var posY;
        var screenWidth =document.documentElement.clientWidth;
        var screenHeight = document.documentElement.clientHeight;
        var fdiv = document.getElementById("drager");

        function start(e) {
            screenWidth =document.documentElement.clientWidth;
            screenHeight = document.documentElement.clientHeight;
            if(!e){ e = window.event; } //IE
            posX = e.clientX - parseInt(fdiv.style.left);
            posY = e.clientY - parseInt(fdiv.style.top);
        }



        //释放时自动贴到最近位置
        function end(){
            document.onmousemove = null;
            if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(screenHeight/2)){//在上半部分
                if((parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)<=(screenWidth/2)){//在左半部分
                    if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)){//靠近上方
                        fdiv.style.top="0px";
                    }else{//靠近左边
                        fdiv.style.left="0px";
                    }
                }else{//在右半部分
                    if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(screenWidth-(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)) ){//靠近上方
                        fdiv.style.top="0px";
                    }else{//靠近右边
                        fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
                    }
                }
            }else{ //下半部分
                if((parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)<=(screenWidth/2)){//在左半部分
                    if( (screenHeight-(parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2))<=(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)){//靠近下方
                        fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
                    }else{//靠近左边
                        fdiv.style.left="0px";
                    }
                }else{//在右半部分
                    if( (screenHeight-(parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2))<=(screenWidth-(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)) ){//靠近上方
                        fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
                    }else{//靠近右边
                        fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
                    }
                }
            }
        }

        window.onload =  window.onresize = function() { //窗口大小改变事件
            screenWidth =document.documentElement.clientWidth;
            screenHeight = document.documentElement.clientHeight;
            if( (parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight))>screenHeight){//窗口改变适应超出的部分
                fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
            }
            if( (parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth))>screenWidth){//窗口改变适应超出的部分
                fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
            }
        };
        fdiv.addEventListener('touchstart',  function (e) {
            screenWidth =document.documentElement.clientWidth;
            screenHeight = document.documentElement.clientHeight;
            if(!e){ e = window.event; } //IE
            posX = e.clientX - parseInt(fdiv.style.left);
            posY = e.clientY - parseInt(fdiv.style.top);
        }, false);
        fdiv.addEventListener('touchmove', function(event){
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                event.preventDefault();// 阻止浏览器默认事件，重要
                var touch = event.targetTouches[0];
                if((touch.pageY)<=0){//超过顶部
                    fdiv.style.top="0px";
                }else if(touch.pageY>(screenHeight-parseInt(fdiv.clientHeight))){//超过底部
                    fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
                }else{
                    fdiv.style.top = (touch.pageY-parseInt(fdiv.clientHeight)/2) + "px";
                }

                if(touch.pageX<=0){//超过左边
                    fdiv.style.left="0px";
                }else if( touch.pageX >(screenWidth-parseInt(fdiv.clientWidth))){//超过右边
                    fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
                }else{
                    fdiv.style.left = (touch.pageX-parseInt(fdiv.clientWidth)/2) + "px";
                }
            }
        }, false);
        fdiv.addEventListener('touchend',end,false);
        fdiv.onclick=function(){
            window.location.href = '../index.html';
        }

    }
});
