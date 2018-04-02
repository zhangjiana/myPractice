/**
 * Created by zJ on 2016/4/8.
 */
    $(function(){
        var con =  new IScroll('#main', {probeType: 3, mouseWheel: true});
        var flag = false;
        var nowTime = new Date().getHours()*60*60+new Date().getMinutes()*60+new Date().getSeconds();
        var distance = 19*60*60 - nowTime;
        var day = new Date().getDay();
        function time() {
            var oDiv = document.getElementById('count');
            var aImg = oDiv.getElementsByTagName('img');
            var oTime = new Date();
            var hour = 19 - oTime.getHours();
            var minute = 59- oTime.getMinutes();
            var second = 59 - oTime.getSeconds();
            var str = '' + toD(hour) + toD(minute) + toD(second);
            nowTime = oTime.getHours()*60*60+oTime.getMinutes()*60+oTime.getSeconds();
            distance = 19*60*60 - nowTime;
            if(distance <= 0){
                str='000000'
            }

            for (var i = 0; i < aImg.length-2; i++) {
                aImg[i].src = '../img/topicsActivity/' + str[i] + '.png';
            }
            for (var j = 4;j < aImg.length; j++){
                aImg[j].src = '../img/topicsActivity/r' + str[j] + '.png';
            }
            if(distance <= 0){
                flag = true;
            }else {
                flag = false;
                setTimeout(function(){
                    time()
                },1000)
            }

        }
        function toD(obj) {
            if (obj < 10&& obj > 0) {
                return '0' + obj;
            } else if (obj >= 10)  {
                return '' + obj;
            } else{
                return '00';
            }
        }
        if(day == 2){
            time();
        }else {
            flag = false;
        }

        //微信登录
        // weixinLogin();
        $("#act-details").swipe({
            tap: function(e){
                $("#pop-window").removeClass('dn');
                $("#details").removeClass('dn').siblings().not('span').addClass('dn');
                e.preventDefault();
            }
        });
        $("#closeThis").swipe({
            tap: function(e){
                $("#pop-window").addClass('dn');
                e.preventDefault();
            }
        });
        $("#btnStart").swipe({
            tap: function(e){
                console.log(flag);

                    if(getCookie('user')&&getCookie('user').length == 11){
                        if(flag){
                            window.location.href='answer0408.html';
                        }else {
                            myalert.tips({
                                txt:"活动还未开始",
                                btn:1
                            })
                        }

                    }else {
                        $("#pop-window").removeClass('dn');
                        $("#bindPhone").removeClass('dn').siblings().not('span').addClass('dn');
                    }

                e.preventDefault();
            }
        });
        bindPhone();
        function bindPhone() {
            var $getRegCode = $("#getRegNum");
            var $regPhone = $('#regPhone');
            var $regNum = $('#regNum');
            $getRegCode.swipe({
                tap: function() {
                    if ($('#regPhone').triggerHandler('blur')) {
                        if (!$getRegCode.hasClass('disable')) {
                            getRegCodeAjax();
                        }
                    } else {
                        $("#notice").text("请先输入手机号");
                    }
                }
            });
            $("#btnSubmit").swipe({
                tap: function() {
                    if ($regPhone.triggerHandler('blur') && $regNum.val()) {
                        sendMobile();
                    } else if (!$regNum.val()) {
                        $("#notice").text("请输入验证码");
                    } else {
                        $("#notice").text("请先输入手机号");
                    }
                }
            });
        }
        /*绑定手机号*/
        function sendMobile() {
            var data = {
                "mobile": $('#regPhone').val(),
                "verifyCode": $("#regNum").val(),
                "eventName":"HEALTH_MONDAY"
            };
            $.ajax({
                type: "POST",
                url: ajaxUrl + "User/EasyBindMobile?sessionId=" + window.localStorage.sessionId,
                contentType: "text/plain; charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(data),
                success: function(data) {
                    if (data.code == 0) {
                        setCookie('user',$('#regPhone').val(),30);
                        $('#notice').text("绑定成功");
                        return true;
                    } else {
                        $('#notice').text(data.message);
                        return false;
                    }
                },
                error: function(res) {
                    if (res.status == 401) {
                        myalert.tips({
                            txt: "会话超时，请重新登录",
                            fnok: function() {
                                window.location = "/html/newLogin.html";
                            },
                            btn: 1
                        });

                    }
                }
            });
        }
        /*验证手机号码*/
        regPhoneNum("#regPhone", "#notice");

        //获取注册验证码
        function getRegCodeAjax() {
            $.ajax({
                type: "GET",
                url: ajaxUrl + "User/VerifyCode",
                contentType: "text/plain; charset=UTF-8",
                dataType: 'json',
                data: "mobile=" + $("#regPhone").val() + "&type=bind_mobile",
                success: function(data) {
                    if (data.code == 0) {
                        getCodeActive($("#getRegNum"));
                        return true;
                    } else {
                        $('#notice').text(data.message);
                        return false;
                    }
                },
                error: function(res) {
                    if (res.status == 401) {
                        myalert.tips({
                            txt: "会话超时，请重新登录",
                            fnok: function() {
                                window.location = "/html/newLogin.html";
                            },
                            btn: 1
                        });
                    }
                }
            });
        }
        /*验证码倒计时*/
        function getCodeActive(obj) {
            console.log("已发送验证码");
            var $getRegCode = obj;
            if (!$getRegCode.hasClass('disable')) {
                $getRegCode.addClass('disable');
                var iSecond = 60;
                var timer;
                $getRegCode.text(iSecond + "s");
                iSecond--;
                timer = setInterval(function() {
                    if (iSecond < 0) {
                        $getRegCode.text("重新获取");
                        clearInterval(timer);
                        $getRegCode.removeClass('disable');
                    } else {
                        $getRegCode.text(iSecond + "s");
                        iSecond--;
                    }
                }, 1000);
            }
        }

    // shareWeixin("答题抢红包，和找对医生一起健康每周一","千份红包每周一17：00准时开抢哦","../activity/html/topicsActivity.html","../activity/img/topicsActivity/pig.jpg")
    });
