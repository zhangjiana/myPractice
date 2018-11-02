/*
 * @Author: starry
 * @Date:   2016-01-19 11:22:13
 * @Last Modified by:   starry
 * @Last Modified time: 2016-05-13 20:42:03
 */

if ("micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) {
    $('body').prepend('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
}
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?cf625b2bfcabcb09092d52343055c405";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

window.localStorage.theRelationship = '{"father":"爸爸","mother":"妈妈","me":"我"}';
//设置最小高度,输入框和底部菜单问题
$('body').css('min-height', $(window).height());

//获取地址中的信息
function GetQueryString(name) {
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*返回参数值*/
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }

}

/*cookie*/
function setCookie(name, value, oDay) {
    var oTime = new Date();
    var oDate = oTime.getDate();
    oTime.setDate(oDate + oDay);
    document.cookie = name + '=' + value + ';expires=' + oTime + ';path=/';

}

function getCookie(name) {
    var str = document.cookie.split('; ');

    for (i = 0; i < str.length; i++) {
        arr = str[i];
        arr1 = arr.split('=');
        if (arr1[0] == name)
            return arr1[1];

    }

    return '';

}

function removeCookie(name) {

    setCookie(name, '00', -1);

}

/*价格*/
function formatPrice(s) {
    var pos;
    if (s.indexOf('￥') == -1) {
        if (s.indexOf('.') == -1) {
            return '￥' + s;
        } else {
            pos = s.indexOf('.');
            return '￥' + s.slice(0, pos);
        }
    } else if (s.indexOf('.') == -1) {
        return s;
    } else {
        pos = s.indexOf('.');
        return s.slice(0, pos);
    }
}

//显示价格
function showPrice() {
    var $price = $(".service-price");
    for (var i = 0; i < $price.length; i++) {
        $price.eq(i).text(formatPrice($price.eq(i).text()));
    }
}
showPrice();
$("body").prepend('<div class="dn"><img src="http://imgcdn.zhaoduiyisheng.com/img/logo01.png" /></div>');

function encrypt(s) {
    var seed = Math.floor(Math.random() * 0x7f) + 1;
    setCookie('seed', seed, 30);

    var fnl = "",
        code = 0;
    for (var i = 0; i < s.length; i++) {
        code = s.charCodeAt(i) & 0x7f ^ (seed << 7 - i % 8 | seed >> i % 8 | 0x80) & 0xff;
        fnl += code.toString(16);
    }
    return fnl;
}


/*自定义弹窗*/
function Dralert() {
    this.html = $('<div id="alert" class="alert-wrap dn"><div class="center alert pr"></div>');
    var This = this;
    $('body').append(this.html);
    this.sex = function(fn) {
        var str = '';
        if ($("#sex-text").attr('data-sex') == 'female') {
            str = '<div class="alert-question f28 tc"><div class="pt88"><span id="input-m" class="icon-sex icon-man02"></span><span id="input-f" class="icon-sex icon-woman01 active"></span></div></div><ul class="alert-btn-list"><li id="alert-no">取消</li><li id="alert-yes">确认</li></ul><span class="close_window" id="closeWindow"></span>';
        } else {
            str = '<div class="alert-question f28 tc"><div class="pt88"><span id="input-m" class="icon-sex icon-man01 active"></span><span id="input-f" class="icon-sex icon-woman02"></span></div></div><ul class="alert-btn-list"><li id="alert-no">取消</li><li id="alert-yes">确认</li></ul><span class="close_window" id="closeWindow"></span>';
        }
        $('#alert').children().empty().append(str);

        $('#alert').removeClass('dn');
        $('#alert-no').on('touchend', function(e) {
            This.remove();
            e.preventDefault();
        });
        $('#alert-yes').on('touchend', function(e) {
            if ($("#input-m").hasClass('active')) {
                $("#sex-text").text('男').attr('data-sex', 'male');
                $("#sex-text").attr('data-flag', 'true');
            } else {
                $("#sex-text").text('女').attr('data-sex', 'female');
                $("#sex-text").attr('data-flag', 'true');
            }
            if (fn) {
                fn();
            }
            This.remove();
            e.preventDefault();
        });
        $("#input-m").swipe({
            tap: function() {
                $(this).addClass('icon-man01 active').removeClass('icon-man02');
                $(this).siblings().removeClass('icon-woman01 active').addClass('icon-woman02');
            }
        });

        $("#input-f").swipe({
            tap: function() {
                $(this).addClass('icon-woman01 active').removeClass('icon-woman02');
                $(this).siblings().removeClass('icon-man01 active').addClass('icon-man02');
            }
        });

        $("#closeWindow").on('touchend', function(e) {
            This.remove();
            e.preventDefault();
        });
        This.init();
    };
    this.head = function(fn) {
        $('#alert').children().empty().append('<div class="alert-head pl20"><ul class="person-type f28 c-66 tc cbo"><li>正常</li><li>中年</li><li>老年</li><li>小孩</li></ul><ul id="sel-head" class="head-list clearfix"><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/n1.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/m1.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/b1.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/s1.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/n2.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/m2.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/b2.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/s2.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/n3.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/m3.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/b3.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/s3.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/n4.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/m4.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/b4.png"></li><li><img src="http://imgcdn.zhaoduiyisheng.com/img/head/s4.png"></li></ul></div>');
        $('#alert').removeClass('dn');
        $('#sel-head').on('touchend', 'img', function(e) {
            if ($("#avatar")[0]) {
                $("#avatar").attr('src', $(this).attr('src'));
            } else {
                $("#head>div").append('<img src=' + $(this).attr('src') + '  id="avatar" class="add-family-head"/>');
                $("#head-tip").remove();
            }
            if (fn) {
                fn();
            }
            This.remove();
            e.preventDefault();
        });

        This.init();
    };
    this.family = function(fn, fno) {
        if (window.localStorage.allMember) {
            $('#alert').children().empty().append('<div id="alertScroll" class="swiper-container pr"><ul id="sel-peo" class="pr sel-peo bcc-b swiper-wrapper"></ul></div><ul class="alert-btn-list"><li id="alert-no">添加家人</li><li id="alert-yes">确认</li></ul><span class="close_window" id="closeWindow"></span>');
            var data = JSON.parse(window.localStorage.allMember),
                len = data.length,
                i = 0,
                el = $('#sel-peo'),
                str = '',
                gender = '';

            for (; i < len; i++) {
                var head_img = 'http://imgcdn.zhaoduiyisheng.com/img/icon/icon_logo.png';
                if (data[i].avatar) {
                    if (data[i].avatar.indexOf('http') > -1) {
                        head_img = data[i].avatar;
                    } else {
                        head_img = 'http://imgcdn.zhaoduiyisheng.com/img/head/' + data[i].avatar;
                    }
                } else if (data[i].relationship == "me") {
                    head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/n1.png";
                } else if (data[i].relationship == "father") {
                    head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/m1.png";
                } else if (data[i].relationship == "mother") {
                    head_img = "http://imgcdn.zhaoduiyisheng.com/img/head/m3.png";
                }

                var birth = '';
                if (data[i].birthDate) {
                    birth = data[i].birthDate;
                } else if (data[i].relationship == "me") {
                    birth = "1980-01-01";
                } else if (data[i].relationship == "father" || data[i].relationship == "mother") {
                    birth = "1960-01-01";
                }
                var relation = JSON.parse(window.localStorage.theRelationship)[data[i].relationship] || data[i].relationship;

                str += '<li class="clearfix pt30 pb30 swiper-slide"><div class="fl"><img src="' + head_img + '" alt=""></div><p class="fl f30" data-birth="' + birth.slice(0, 4) + '" data-gender="' + data[i].gender + '" data-id1="' + data[i].province + '" data-id2="' + data[i].city + '" data-uuid="' + data[i].uuid + '" data-relationship="' + data[i].relationship + '" data-avatar="' + head_img + '">' + relation + '</p ></li>';
            }
            el.append(str);
            el.find('p').eq(0).addClass('c-cyan');
            $('#alert').removeClass('dn');
            /* var alertScroll = new IScroll('#alertScroll', {
                 probeType: 3,
                 mouseWheel: true
             });*/
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                slidesPerView: 3,
                centeredSlides: true,
                slideToClickedSlide: true,
                onSlideChangeEnd: function() {
                    el.find('p').eq(0).removeClass('c-cyan');
                }
            });
            $('#alert-no').on('touchend', function(e) {

                if (fno) {
                    fno();
                }

                This.remove();
                //alertScroll = null;

                e.preventDefault();
            });
            $('#alert-yes').on('touchend', function(e) {
                /* var p = $(".swiper-slide-active").find("p");
                 if (p.text()) {
                     $("#name").data('uuid', p.data('uuid')).data('avatar', p.data('avatar')).data('relationship', p.data('relationship')).text(p.text());

                     $("#name").attr('data-flag', 'true');
                 } else {
                     $("#name").text('请填写姓名');
                     $("#name").attr('data-flag', 'false');
                 }
                 if (p.data('gender')) {
                     gender = p.data('gender') === 'male' ? '男' : '女';
                     $("#sex-text").text(gender);
                     $("#sex-text").attr('data-flag', 'true');
                 } else {
                     $("#sex-text").text("请选择");
                     $("#sex-text").attr('data-flag', 'false');
                 }
                 if (p.data('birth')) {
                     $("#birth-text").text(p.data('birth'));
                     $("#birth-text").attr('data-flag', 'true');
                 } else {
                     $("#birth-text").text('请选择');
                     $("#birth-text").attr('data-flag', 'false');
                 }
                 if (p.data('id1')) {
                     getLocation(p.data('id1'), p.data('id2'));
                     $("#province-val").attr('data-flag', 'true').attr('data-id', p.data('id1')).attr('city-id', p.data('id2'));
                 } else {
                     $("#province-val").text("请选择");
                     $("#province-val").attr('data-flag', 'false');
                 }
                 $('#name').attr('data-relationship', p.data('relationship'));
                 $('#sex-text').attr('data-sex', p.data('gender'));*/
                if (fn) {
                    fn();
                }
                This.remove();
                e.preventDefault();
            });
            $("#closeWindow").on('touchend', function(e) {
                This.remove();
                e.preventDefault();
            });
        }
    };
    this.changePhone = function(fn) {
        $('#alert').children().empty().append('<div class="alert-change-phone alert-question f28 tc"><h3 class="f34 c-33">修改手机号</h3><div><input id="inp-tel" class="inp-tel" type="tel" placeholder="输入手机号"></div><div class="clearfix"><input id="inp-code" class="fl inp-code" type="tel" placeholder="输入验证码"><span id="getCode" class="fl code-btn c-white">获取验证码</span></div><p class="mb20 c-red" id="input-tip"></p></div><ul class="alert-btn-list"><li id="alert-no">取消</li><li id="alert-yes">确定</li></ul><span class="close_window" id="closeWindow"></span>');
        $('#alert').removeClass('dn');
        $('#input-tel').focus();
        $('#alert-no').on('touchend', function(e) {
            This.remove();
            e.preventDefault();
        });
        regPhoneNum('#inp-tel', '#input-tip');
        $('#getCode').swipe({
            tap: function() {
                if ($('#inp-tel').triggerHandler('blur')) {
                    if (!this.hasClass('disable')) {
                        $.ajax({
                            type: "GET",
                            url: "http://www-test.zhaoduiyisheng.com/api/User/VerifyCode",
                            contentType: "text/plain; charset=UTF-8",
                            dataType: 'json',
                            data: "mobile=" + $("#inp-tel").val() + "&type=modify_mobile",
                            success: function(data) {
                                if (data.code == 0) {
                                    getCodeActive($('#getCode'));
                                    return true;
                                } else {
                                    $('#input-tip').text(data.message);
                                    return false;
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
                }
            }
        });
        $('#alert-yes').on('touchend', function(e) {
            if ($('#inp-tel').triggerHandler('blur')) {
                if ((/^[0-9]{6}$/g).test($('#inp-code').val())) {
                    if (fn) {
                        fn();
                    }
                } else {
                    $('#input-tip').text('请输入六位数字验证码');
                }
                return false;
            }
            e.preventDefault();
        });

        $("#closeWindow").on('touchend', function(e) {
            This.remove();
            e.preventDefault();
        });
        This.init();
    };
    this.chartFile = function(fn, fno) {
        $('#alert').children().empty().append('<div id="chartScroll" class="swiper-container pr"><ul id="chart" class="pr sel-peo swiper-wrapper"></ul></div><ul class="alert-btn-list"><li id="alert-no">添加新的病症</li><li id="alert-yes">确认</li></ul><span class="close_window" id="closeWindow"></span>');
        $('#alert').removeClass('dn');
        var data = JSON.parse(window.localStorage.caseList);
        var len = data.length,
            str = '';

        for (var j = 0; j < len; j++) {
            if (0 === data[j].orderId) {
                str += '<li class="clearfix pt30 swiper-slide tc f30" data-caseuuid="' + data[j].uuid + '">' + data[j].caseName + '</li>';
            }
        }
        $("#chart").append(str);

        var mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            slidesPerView: 3,
            centeredSlides: true,
            onInit: function() {
                var height = parseInt($(".swiper-slide").css("height")) / 2 + 'px';
                console.log(height);
                $(".swiper-slide").css("line-height", height);
            },
            onTap: function(swiper) {
                console.log(swiper);
                window.location = '../html/caseData.html?patientUuid=' + $('#choose-member').attr('data-uuid') + '&caseUuid=' + $('#chart li').eq(swiper.clickedIndex).attr('data-caseuuid') + '&from=' + window.location.pathname.match(/\w+/g)[1] + '&edit=true&clinicService=' + GetQueryString('clinicService');
            }
        });
        /*设置行高*/


        $("#alert-no").on('touchend', function(e) {
            /*需要写传过来人的UUid*/
            if (fno) {
                fno();
            }
            This.remove();

            e.preventDefault();
        });
        $("#alert-yes").on('touchend', function(e) {

            /*需要记下病历的uuid*/

            if (fn) {
                fn();
            }

            This.remove();
            e.preventDefault();
        });


        $("#closeWindow").on('touchend', function(e) {
            This.remove();
            e.preventDefault();
        });
        This.init();
    };


    this.tips = function(set) {
        var opt = {
            tit: '提示',
            txt: '',
            fnno: function() {
                This.remove();
                return false;
            },
            fnok: function() {
                This.remove();
                return false;
            },
            oktxt: '确认',
            notxt: '取消',
            btn: 2
        };
        $.extend(opt, set);
        var ta = opt.txt.length > 11 ? 'tj' : 'tc';
        if (-1 !== opt.txt.indexOf('br')) {
            ta = 'tc';
        }
        var main = $('<div class="alert-question f28"><h3 class="f34 c-33 tc">' + opt.tit + '</h3><p class="f28 ' + ta + ' c-66 mtb40 prl40">' + opt.txt + '</p></div><span class="close_window" id="closeWindow"></span>'),
            btns = $('<ul class="alert-btn-list"></ul>');
        btns.prepend('<li id="alert-yes">' + opt.oktxt + '</li>');
        $('#alert').children().empty();
        $('#alert').children().append(main);
        $('#alert').children().append(btns);
        $('#alert').removeClass('dn');
        $('#alert-yes').on('touchend', function(e) {
            opt.fnok();
            e.preventDefault();
        });

        $("#closeWindow").on('touchend', function(e) {
            This.remove();
            e.preventDefault();
        });
        if (opt.btn === 2) {
            $('#alert-yes').before('<li id="alert-no">' + opt.notxt + '</li>');
            $('#alert-no').on('touchend', function(e) {
                opt.fnno();
                e.preventDefault();
            });
        }
        This.init();
    };
    this.remove = function() {
        $('#alert').addClass('dn').children().empty();
    };
    this.init = function() {
        $('#alert').one('touchend', function(e) {
            This.remove();
            e.preventDefault();
        }).children().children().on('touchend', function(e) {
            e.stopPropagation();
        });
    };
}
//创建弹窗
var myalert = new Dralert();
// 弹窗方法：
// myalert.year()调用选择年份
// myalert.city()调用选择城市
// myalert.relation()调用填写关系
// myalert.sex()调用选择性别
// myalert.name()调用填写姓名
// myalert.head()调用选择头像
// myalert.family()调用选择家人
// myalert.tips()自定义弹窗，参数如下,默认值
// {
//     tit: '提示',//弹窗标题，可不传，默认'提示'
//     txt: '',//内容，必传
//     fnno: function() {//左边按钮点击执行函数，可不传，默认移除弹窗
//         This.remove();
//     },
//     fnok: function() {//右边按钮点击执行函数，可不传，默认移除弹窗
//         This.remove();
//     },
//     oktxt: '确认',//左边按钮内容，可不传，默认'确认'
//     notxt: '取消',//右边按钮内容，可不传，默认'取消'
//     btn: 2//按钮个数，可不传，默认2个
// }


if (!window.localStorage.province) {
    getProvince();
}

/*获取省列表*/
function getProvince() {
    $.ajax({
        type: 'GET',
        url: 'http://www-test.zhaoduiyisheng.com/api/Platform/RegionList?&type=province',
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        //data:"regionId=0",
        success: function(data) {
            if (data.code == 0) {

                var data = JSON.stringify(data.data);
                window.localStorage.province = data;
            }
        }
    });
}
/*获取城市列表 创建省*/
function cityWrap() {
    $('#my-province,#my-city').swipe({
        tap: function() {
            if (!$(this).hasClass('disable')) {
                $('#sel-province').removeClass('dn');
                scrollProvince.refresh();
            }
        }
    });
    var data = JSON.parse(window.localStorage.province),
        the_ul = $('#province-ul'),
        len = data.length,
        str = '',
        i = 0;
    for (; i < len; i++) {
        str += '<li data-id="' + data[i].id + '" class="icon-list">' + data[i].name + '</li>';
    }
    the_ul.append(str);
    var scrollProvince = new IScroll('#scroll-province', {
        probeType: 3,
        mouseWheel: true,
        preventDefault: false
    });
    the_ul.swipe({
        tap: function(e, t) {
            if ('LI' === t.tagName) {
                $('#my-province').text($(t).text()).attr('data-id', $(t).attr('data-id'));
                getCity($(t).attr('data-id'));
            }
            e.preventDefault();
        }
    });
}
/*获取城市列表*/
function getCity($cityIndex, city) {
    if ($cityIndex) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Platform/RegionList?regionId=" + $cityIndex + "&type=city",
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    var data = JSON.stringify(data.data);
                    window.localStorage["city" + $cityIndex] = data;
                    createCity(data, city);
                }
            }
        });
    }
}


/*创建城市列表*/
function createCity(data, city) {
    data = JSON.parse(data);
    var the_ul = $('#city-ul'),
        len = data.length,
        str = '',
        i = 0;
    the_ul.html('');
    for (; i < len; i++) {
        str += '<li data-id="' + data[i].id + '" data-description="' + data[i].description + '">' + data[i].name + '</li>';
    }
    the_ul.append(str);
    $('#sel-city').removeClass('dn');
    var scrollCity = new IScroll('#scroll-city', {
        probeType: 3,
        mouseWheel: true,
        preventDefault: false
    });
    the_ul.swipe({
        tap: function(e, t) {
            if ('LI' === t.tagName) {
                $('#my-city').attr('data-id', $(t).attr('data-id')).text($(t).attr('data-description'));
                $('#my-province').text($(t).attr('data-description'));
                $('#sel-province').addClass('dn');
                $('#sel-city').addClass('dn');
            }
            e.preventDefault();
        }
    });
}
/*城市由ID 到 城市名字*/
/*function getLocation(id1, id2) {
    var data;
    if (window.localStorage['city' + id1]) {
        data = JSON.parse(window.localStorage['city' + id1]);
        get(data, id2);
    } else {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Platform/RegionList?&regionId=" + id1,
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    data = data.data;
                    window.localStorage["city" + id1] = JSON.stringify(data);
                    get(data, id2)
                }
            }
        })
    }

    function get(data, id2) {
        var len = data.length,
            i = 0;
        for (; i < len; i++) {
            if (data[i].id == id2) {
               console.log(i)
            }
        }
        return false;
    }
}*/
//验证输入的中文名
function nameVali(id, notice) {
    $(id).bind("blur", function() {
        var reg = /^[\u4E00-\u9FFF]{2,5}$/;
        if (reg.test($(id).val())) {
            $(notice).text("");
            return true;
        } else {
            $(id).val('');
            $(notice).text("请正确输入中文名称(2-5个字)");
            return false;
        }

    });
}

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
//验证密码格式
function regPwd(regPwd, regNotice) {
    var $regPwd = $(regPwd);
    var $regNotice = $(regNotice);
    $regPwd.on("blur", function() {
        var reg = /^\w{6,20}$/;
        if (reg.test($regPwd.val())) {
            $regNotice.text("");
            return true;
        } else {
            $regNotice.text("密码长度应为6~20个字符（数字、字母、下划线）");
            return false;
        }
    });
}
/*点击获取验证码 ，验证码开始倒计时*/
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

function bindPhone(mobile, code, btnCode, submit, channel, fn) {
    /*验证手机号码*/
    regPhoneNum(mobile, "#notice");
    var $getRegCode = $(btnCode);
    var $regPhone = $(mobile);
    var $regNum = $(code);
    $getRegCode.swipe({
        tap: function() {
            if ($(mobile).triggerHandler('blur')) {
                if (!$getRegCode.hasClass('disable')) {
                    getRegCodeAjax(mobile, btnCode);
                }
            } else {
                $("#notice").text("请先输入手机号");
            }
        }
    });
    $(submit).swipe({
        tap: function() {
            if ($regPhone.triggerHandler('blur') && $regNum.val()) {
                sendMobile(mobile, code, channel, fn);
            } else if (!$regNum.val()) {
                $("#notice").text("请输入验证码");
            } else {
                $("#notice").text("请先输入手机号");
            }
        }
    });
}
/*绑定手机号*/
function sendMobile(mobile, code, channel, fn) {
    var data = {
        "mobile": $(mobile).val(),
        "verifyCode": $(code).val()
    };
    if (channel.length) {
        data.eventName = channel;
    }
    $.ajax({
        type: "POST",
        url: ajaxUrl + "User/EasyBindMobile?sessionId=" + window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(data) {
            if (data.code == 0) {
                $('#notice').text("绑定成功");
                setCookie('user', $(mobile).val(), 30);
                setTimeout(function() {
                    $("#pop-window").addClass('dn');
                }, 2000);
                if (fn) {
                    fn();
                }
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


//获取注册验证码
function getRegCodeAjax(mobile, btnCode, stype) {
    var type = stype || "bind_mobile";
    $.ajax({
        type: "GET",
        url: ajaxUrl + "User/VerifyCode",
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: "mobile=" + $(mobile).val() + "&type=" + type,
        success: function(data) {
            if (data.code == 0) {
                getCodeActive($(btnCode));
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

function birth() {
    $('#birth-text').swipe({
        tap: function() {
            if (!$(this).hasClass('disable')) {
                $('#sel-year').removeClass('dn');
                scrollYear.refresh();
                scrollYear.scrollToElement('li:nth-child(70)', 0);
            }
        }
    });
    var the_ul = $('#year-ul'),
        i = 1911, //开始年份在这里设置
        str = '',
        now = new Date().getFullYear() + 1;
    for (; i < now; i++) {
        str += '<li>' + i + '</li>';
    }
    the_ul.append(str);
    var scrollYear = new IScroll('#scroll-year', {
        probeType: 3,
        mouseWheel: true,
        preventDefault: false
    });
    the_ul.swipe({
        tap: function(e, t) {
            if ('LI' === t.tagName) {
                $('#birth-text').text($(t).text());
                $('#sel-year').addClass('dn');
            }
        }
    });
    // 返回按钮
    $('.back-dn').swipe({
        tap: function() {
            $(this).parent().parent().addClass('dn');
        }
    });
}

if (!window.sessionStorage.historyNum || isNaN(parseInt(window.sessionStorage.historyNum))) {
    window.sessionStorage.historyNum = 0;
    var historyNum = parseInt(window.sessionStorage.historyNum);
    window.sessionStorage['prevPage' + historyNum] = window.location.href;
}
var historyNum = parseInt(window.sessionStorage.historyNum) || 0;
if ('true' === window.sessionStorage.history) {
    window.sessionStorage.history = 'false';
} else if (window.sessionStorage['prevPage' + historyNum] !== window.location.href) {
    historyNum++;
    window.sessionStorage.historyNum = historyNum;
    window.sessionStorage['prevPage' + historyNum] = window.location.href;
}
$('.go-back').swipe({
    tap: function(e) {
        var historyNum = parseInt(window.sessionStorage.historyNum);
        historyNum--;
        var href = window.sessionStorage['prevPage' + historyNum] || '/index.html';
        window.sessionStorage.history = 'true';
        window.sessionStorage.historyNum = historyNum;
        if (href === window.location.href) {
            href = '/index.html';
        }
        window.location = href;
        e.preventDefault();
    }
});
$('.goback').swipe({
    tap: function(e) {
        window.history.go(-1);
        e.preventDefault();
    }
});

function commonLink() {
    if (-1 === window.location.href.indexOf('index.html')) {
        $('.index').swipe({
            tap: function(e) {
                window.location = '/index.html';
                e.preventDefault();
            }
        });
    }
    if (-1 === window.location.href.indexOf('newFamily.html')) {
        $('.family').swipe({
            tap: function(e) {
                window.location = '/html/newFamily.html';
                e.preventDefault();
            }
        });
    }
    if (-1 === window.location.href.indexOf('doctorInfo.html')) {
        $('.doctor').swipe({
            tap: function(e) {
                window.location = '/html/doctorInfo.html';
                e.preventDefault();
            }
        });
    }
    if (-1 === window.location.href.indexOf('my.html')) {
        $('.me').swipe({
            tap: function(e) {
                window.location = '/html/my.html';
                e.preventDefault();
            }
        });
    }
}
if (-1 === window.location.href.indexOf('index.html')) {
    commonLink();
}
$(document).on('touchmove', function(e) {
    e.preventDefault();
});
(function($) {
    // Determine if we on iPhone or iPad
    var isiOS = false;
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        isiOS = true;
    }

    $.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay) {
        var eventName, action;
        delay = delay == null ? 500 : delay;
        eventName = isiOS == true ? 'touchend' : 'click';

        $(this).bind(eventName, function(event) {
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */ ;
            var delta = now - lastTouch;
            clearTimeout(action);
            if (delta < 500 && delta > 0) {
                if (onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function') {
                    onDoubleTapCallback(event);
                }
            } else {
                $(this).data('lastTouch', now);
                action = setTimeout(function(evt) {
                    if (onTapCallback != null && typeof onTapCallback == 'function') {
                        onTapCallback(evt);
                    }
                    clearTimeout(action); // clear the timeout
                }, delay, [event]);
            }
            $(this).data('lastTouch', now);
        });
    };
})(jQuery);

//usage:
$(document).doubletap(
    /** doubletap-dblclick callback */
    function(e) {
        e.preventDefault();
    },
    /** touch-click callback (touch) */
    function(event) {});

//加载动画
//Loading.prototype.init = function() {
//    document.querySelector("body").appendChild(load.loadHtml);
//    $(document).ajaxComplete(function() {
//        $("#loading").remove();
//    });
//};
//加密
var seed = getCookie('seed');

function decrypt(s) {
    var fnl = "",
        code = 0;
    for (var i = 0; i < s.length >> 1; i++) {
        code = new Number("0x" + s.substr(i * 2, 2));
        fnl += String.fromCharCode((code ^ (seed << 7 - i % 8 | seed >> i % 8 | 0x80)) & 0x7f);
    }
    return fnl;
}
var ajaxUrl = "http://www-test.zhaoduiyisheng.com/api/";

function loginTimeOut() {
    if (localStorage.openid) {
        console.log('微信自动登录');
        //weixinTimeOut();
    } else if (getCookie('user') && '00' !== getCookie('user')) {
        console.log('手机号密码自动登录');
        //mobileTimeOut();
    }
    //myalert.tips({
    //    txt: "会话超时，请重新登录",
    //    fnok: function() {
    //        window.location = "../html/newLogin.html";
    //    },
    //    btn: 1
    //});
    // else {
    //     myalert.tips({
    //         txt: "您未登录，请先登录",
    //         fnok: function() {
    //             window.location.href = '/html/newLogin.html';
    //         },
    //         notxt: "逛一逛",
    //         oktxt: "去登录"
    //     });
    // }
}

function mobileTimeOut() {
    var data = {
        "mobile": getCookie('user'),
        "password": decrypt(getCookie('pwd'))
    };
    $.ajax({
        type: "POST",
        url: ajaxUrl + "User/Login",
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(data) {
            console.log(data);
            if (data.code == 0) {
                console.log('yes');
                window.localStorage.sessionId = null;
                window.localStorage.selfUuid = null;
                window.localStorage.sessionId = data.data.sessionId;
                window.localStorage.selfUuid = data.data.uuid;
                window.localStorage.removeItem('openid');
                window.location.reload();
            } else {
                console.log(data.message);
            }
        },
        error: function(res) {
            if (res.status == 401) {
                myalert.tips({
                    txt: "请重新登录",
                    fnok: function() {
                        window.location = "../html/newLogin.html";
                    },
                    btn: 1
                });

            }
        }
    })
}

function weixinTimeOut() {
    function weixinUserReg(openid) {
        var data = {
            "openid": openid
        };
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/User/WeixinLogin",
            contentType: "text/plain;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function(data) {

                if (data.code == 0) {

                    window.localStorage.sessionId = data.data.sessionId;
                    window.localStorage.selfUuid = data.data.uuid;
                    setCookie('user', data.data.mobile, 30);
                    window.location.reload();
                    //window.localStorage.bootstrap = data.data.bootstrap;
                    //getHomeMember();
                } else {
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx14da7f3cb2e1b8ff&redirect_uri=" + encodeURI("http://www-test.zhaoduiyisheng.com/index.html") + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
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
    weixinUserReg(window.localStorage.openid);
}
$('head').prepend('<meta name="format-detection" content="telephone=no"/>');
if (top.location != location) {
    top.location.href = location.href;
}
/*分享*/
function shareWeixin(shareTitle, shareDet, shareUrl, shareImg) {
    var u = window.navigator.userAgent.toLocaleLowerCase();
    if (u.indexOf("micromessenger") > -1) {
        $.ajax({
            type: 'GET',
            url: "http://www.zhaoduiyisheng.com/api/Weixin/Signature?url=" + encodeURIComponent(window.location.href),
            contentType: "text/plain; charset=UTF-8",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    var dataB = data.data,
                        config = {
                            appId: dataB.appId,
                            timestamp: dataB.timestamp,
                            nonceStr: dataB.nonceStr,
                            signature: dataB.signature,
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                        };
                    setTimeout(function() {
                        wx.config(config);
                        wx.ready(function() {
                            wx.onMenuShareAppMessage({
                                title: shareTitle, // 分享标题
                                desc: shareDet, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImg // 分享图标
                            });
                            wx.onMenuShareTimeline({
                                title: shareTitle, // 分享标题
                                desc: shareDet, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImg // 分享图标
                            });
                            wx.onMenuShareQQ({
                                title: shareTitle, // 分享标题
                                desc: shareDet, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImg // 分享图标
                            });
                            wx.onMenuShareWeibo({
                                title: shareTitle, // 分享标题
                                desc: shareDet, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImg // 分享图标
                            });
                            wx.onMenuShareQZone({
                                title: shareTitle, // 分享标题
                                desc: shareDet, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImg // 分享图标
                            });
                        });
                    }, 500);
                }
            }
        });
    }
}

function weixinLogin(fn) {
    //微信登录
    var hrefCode = GetQueryString('code');
    if (window.localStorage.openid) {
        openid = window.localStorage.openid;
        weixinUserReg(openid);
    } else if (hrefCode) {
        returnCode(hrefCode);
    }

    /*传过去code*/
    function returnCode(hrefCode) {
        $.ajax({
            type: "GET",
            url: "http://www-test.zhaoduiyisheng.com/api/Weixin/OauthAccessToken?code=" + hrefCode,
            contentType: "text/plain; charset=UTF-8",
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    if (data.data.openid == null) {
                        weixinUserReg(window.localStorage.openid);
                    } else {
                        window.localStorage.openid = data.data.openid;
                        var openid = data.data.openid;
                        var access_token = data.data.access_token;
                        weixinUserReg(openid, access_token);
                    }
                }
            }
        });
    }
    //微信用户登录
    function weixinUserReg(openid, access_token) {
        var data;
        if (access_token) {
            data = {
                "openid": openid,
                "accessToken": access_token
            };
        } else {
            data = {
                "openid": openid
            };
        }
        $.ajax({
            type: "POST",
            url: "http://www-test.zhaoduiyisheng.com/api/User/WeixinLogin",
            contentType: "text/plain;charset=UTF-8",
            dataType: "json",
            async:false,
            data: JSON.stringify(data),
            success: function(data) {
                if (data.code == 0) {
                    window.localStorage.sessionId = data.data.sessionId;
                    setCookie('user', data.data.mobile, 30);
                    if (fn) {
                        fn()
                    }
                }
            },
            error: function(res) {
                $('#loading').addClass('dn');
                myalert.tips({
                    txt: "网络错误，请稍后重试",
                    btn: 1
                });
            }
        });
    }
}
var indexKind=['tele','pre','face'];
function indexA(sel,link){
    $(sel).swipe({
        tap: function(){
            window.location = link+'?kind='+indexKind[$('#bar>.t10').index()];
        }
    });
}
$('.go-index').swipe({
    tap: function(){
        if (GetQueryString('kind')) {
            window.location = '/index.html?kind='+GetQueryString('kind');
        }else{
            window.location = '/index.html?wx';
        }
    }
});
