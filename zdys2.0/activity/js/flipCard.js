var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";
$(function() {
    function time() {
        var oDiv = document.getElementById('countdown');
        var aImg = oDiv.getElementsByTagName('img');
        var oTime = new Date();
        var hour = 23 - oTime.getHours();
        var minute = 59 - oTime.getMinutes();
        var second = 59 - oTime.getSeconds();
        var str = '' + toD(hour) + toD(minute) + toD(second);
        for (var i = 0; i < aImg.length; i++) {
            aImg[i].src = 'http://imgcdn.zhaoduiyisheng.com/activity/img/' + str[i] + '.png';
        }
    }

    function toD(obj) {
        if (obj < 10) {
            return '0' + obj;
        } else {
            return '' + obj;
        }
    }
    time();
    setInterval(time, 1000);
    var scroll = new IScroll('#scroll-flip', {
        probeType: 3,
        mouseWheel: true
    });
    var bStart = true;
    var bFlip = true;
    setPosition(0);
    randomPic();
    $('.btn-start-game').swipe({
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
                if (bStart) {

                    getCardUuid();
                    bStart = false;
                }
            }
        }
    });
    //布局
    function setPosition(step) {
        var time = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                time += step;
                (function(i, j) {
                    if (time == 5) {
                        time -= 1.01;
                    }
                    setTimeout(function() {
                        var $card = $("#card-" + i + "-" + j);
                        $card.css("top", 2.46 * i + "rem");
                        $card.css("left", 2.17 * j + "rem");
                    }, time * 500)
                }(i, j));
            }

        }
        scroll.refresh();
    }
    //产生1-8(1-9)随机数
    function generateRandomNum(num) {
        var arr = [];
        if (num == 9) {
            do {
                var m = Math.ceil(Math.random() * 10);
                if (m == 10) {
                    continue;
                }
                m = parseInt(m);
                if (arr.indexOf(m) == -1) {
                    arr.push(m);
                }
            } while (arr.length < 9);
        } else if (num == 8) {
            do {
                var n = Math.ceil(Math.random() * 10);
                if (n == 10 || n == 9) {
                    continue;
                }
                n = parseInt(n);
                if (arr.indexOf(n) == -1) {
                    arr.push(n);
                }
            } while (arr.length < 8);
        }

        return arr;
    }
    //换不同图片
    function randomPic() {
        var arr = generateRandomNum(9);
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            $(".card-ul li").find('.front').eq(i).css("background", "url(http://imgcdn.zhaoduiyisheng.com/activity/img/card0" + arr[i] + ".jpg) no-repeat center").css("background-size","cover");
        }
    }

    function clickCard($this) {
        var arr = generateRandomNum(8);
        $this.find('.front').css("background", "url(http://imgcdn.zhaoduiyisheng.com/activity/img/card0" + arr[0] + ".jpg) no-repeat center").css("background-size","cover");
        $("#alert-card img").attr("src", "http://imgcdn.zhaoduiyisheng.com/activity/img/r" + arr[0] + ".jpg");
        setTimeout(function() {
            $("#alert-card").removeClass("dn");
        }, 1000);
    }

    function getCardUuid() {
        $.ajax({
            type: "GET",
            url: ajaxUrl + "User/LotteryRedeem?sessionId=" + window.localStorage.sessionId,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(res) {
                if (res.code == 0) {
                    $('.btn-start-game').css('background','url(http://imgcdn.zhaoduiyisheng.com/activity/img/btn_try.png) no-repeat center').css("background-size","contain");
                    //可以抽奖
                    var $li = $("#card-ul li");
                    if (res.data) {
                        for (var i in res.data) {
                            $li.eq(i).attr('uuid', res.data[i]);
                        }
                    }
                    $('.front').css({
                        '-webkit-transform': 'rotateY(180deg)',
                        'z-index': '1'
                    });
                    $('.back').css({
                        '-webkit-transform': 'rotateY(0)',
                        'z-index': '2'
                    });
                    setTimeout(function() {
                        $('.card-ul li').css({
                            'left': '2.17rem',
                            'top': '2.46rem'
                        })
                    }, 1000);
                    setTimeout(function() {
                        $(".card-ul li").find('.front').css("background", "#fff");
                        setPosition(1);
                    }, 2000);
                    setTimeout(function() {
                        $('.card-ul li').bind('click', function() {
                            if (bFlip) {
                                var $this = $(this);
                                var $thisUuid = $(this).attr('uuid');
                                $.ajax({
                                    type: "POST",
                                    url: ajaxUrl + "User/LotteryRedeem?sessionId=" + window.localStorage.sessionId,
                                    contentType: "text/plain; charset=UTF-8",
                                    dataType: "json",
                                    data: $thisUuid,
                                    success: function(res) {
                                        if (res.code == 0) {
                                            console.log(res.message);
                                            //alert(res.message);
                                            $this.find('.front').css("background", "url(http://imgcdn.zhaoduiyisheng.com/activity/img/card09.jpg) no-repeat center").css("background-size","cover");
                                            var price = res.data.voucherCash;
                                            setTimeout(function() {
                                                if (parseInt(price) == 480) {
                                                    $("#alert-card img").attr("src", "http://imgcdn.zhaoduiyisheng.com/activity/img/ycz.jpg");
                                                    $("#alert-card").removeClass("dn");
                                                } else if (parseInt(price) == 315) {
                                                    $("#alert-card img").attr("src", "http://imgcdn.zhaoduiyisheng.com/activity/img/dmz.jpg");
                                                    $("#alert-card").removeClass("dn");
                                                }
                                            }, 1000);

                                            $("#alert-card img").swipe({
                                                tap: function() {
                                                    window.location = "/html/discountTicket.html";
                                                }
                                            })
                                        } else if (res.code == 909) {
                                            loginTimeOut();
                                        } else {
                                            //没有中奖
                                            clickCard($this);
                                            console.log(res.message);
                                            //alert(res.message);
                                        }
                                        $this.find('.front').css({
                                            '-webkit-transform': 'rotateY(0)',
                                            'z-index': '2'
                                        });
                                        $this.find('.back').css({
                                            '-webkit-transform': 'rotateY(-180deg)',
                                            'z-index': '1'
                                        });
                                        bFlip = false;

                                    },
                                    error: function(res) {
                                        if (res.status == 401) {
                                            myalert.tips({
                                                txt:"会话超时，请重新登录",
                                                fnok:function(){
                                                    window.location = "/html/newLogin.html";
                                                },
                                                btn:1
                                            });
                                        }
                                    }
                                });

                            }
                        })
                    }, 7000)
                } else if (res.code == 909) {
                    myalert.tips({
                        txt:"会话超时，请重新登录",
                        fnok:function(){
                            window.location = "/html/newLogin.html";
                        },
                        btn:1
                    });
                } else {
                    //机会已用完
                    console.log(res.message);
                    //alert(res.message);
                    $("#alert-card img").attr("src", "http://imgcdn.zhaoduiyisheng.com/activity/img/no_game.jpg");
                    $("#alert-card").removeClass("dn");
                }
            },
            error: function(res) {
                if (res.status == 401) {
                    myalert.tips({
                        txt:"会话超时，请重新登录",
                        fnok:function(){
                            window.location = "/html/newLogin.html";
                        },
                        btn:1
                    });
                }
            }
        });
    }

    $("#alert-card").swipe({
        tap: function() {
            $(this).addClass("dn");
            $('.btn-start-game').remove();
            $("#card-ul").after('<div class="use-out"></div>');
        }
    });
});
