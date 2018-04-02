/**
 * Created by zJ on 2016/4/29.
 */
    $(function(){
        var scroll = new IScroll('#main', {probeType: 3, mouseWheel: true});
        setTimeout(function(){
            scroll.refresh();
        },1000);
        $(document).one('touchstart',function(){
            scroll.refresh();
        });
        weixinLogin();
        shareWeixin('最美劳动手一定是我妈哒！快来帮我~','戳戳戳，还可能掉下红包来','http://www-test.zhaoduiyisheng.com/activity/html/May.html','http://imgcdn.zhaoduiyisheng.com/activity/img/MayDay/face.jpg');
        /*返回顶部*/
        $("#backTop").click(function(){
            scroll.scrollTo(0,0,500)
        });

        /*活动详情*/
        $("#actDetail").swipe({
            tap: function(e){
                popDialog(1);
                e.preventDefault();
            }
        });

        var flag = true,//是否有手机号
            upload = false,//是否上传图片
            joinNum = null;//编号
        if(getCookie('user')&&getCookie('user').length == 11){
            //去晒手
            flag = true;
            orInput();
        }else {
            flag = true;
            orInput();

        }
        bindPhone("#regPhone","#regNum","#getRegNum","#btnSubmit","LABOR_HAND",function(){
            flag = true;
            orInput();
        });

        /*查询本人是否上传过图片*/
        orUpload();
        function orInput(){
            if(flag){
                $("#uploadImg").removeClass('vh');
            }else {
                $("#uploadImg").addClass('vh');
            }
        }

        $("#showNow").swipe({
            tap:function(e){
                if(flag == false){
                    popDialog(3);//绑定手机号
                }else if(upload){
                    popDialog(4,joinNum);//提示已经上传过图片
                }
                e.preventDefault();
            }
        });

        $("#uploadImg").one('change',function(){
            uploadDataCase(this.files[0]);
        });
        function uploadDataCase(file) {
            var formData = new FormData();
            formData.append("attachment", file);
            $.ajax({
                type: "POST",
                url: "http://www-test.zhaoduiyisheng.com/api/Promotion/LaborHand/Upload?sessionId=" + window.localStorage.sessionId,
                contentType: false,
                dataType: 'json',
                data: formData,
                processData: false,
                success: function (data) {
                    if(data.code == 0){
                        popDialog(2,data.data.serialString);
                        joinNum = data.data.serialString;
                        flag = true;
                        orInput();
                        upload = true;
                    }else {
                        popDialog(5,data.message);
                    }
                }
            })
        }
        /*查询本人是否上传过*/
        function orUpload(){
            $.ajax({
                type: "GET",
                url: "http://www-test.zhaoduiyisheng.com/api/Promotion/LaborHand/MyPicture?sessionId=" + window.localStorage.sessionId,
                contentType: false,
                dataType: 'json',
                processData: false,
                success: function (data) {
                    if(data.code == 0){
                        if(data.data){
                            joinNum = data.data.serialString;
                            upload = true;
                            $("#uploadImg").addClass('vh');
                        }else {
                            upload = false;
                            joinNum = null;
                            $("#uploadImg").removeClass('vh');
                        }
                    }
                }
            })
        }
        function popDialog(obj,point) {
            $("#pop-window").removeClass('dn');
            switch (obj) {
                case 1:
                    $("#details").removeClass('dn').siblings().not("span").addClass('dn');
                    break;
                case 2:
                    $("#upload").removeClass('dn').siblings().not("span").addClass('dn');
                    $("#upTitle").text("恭喜您上传成功");
                    if(point){
                        $("#serialNum").text(point);
                    }
                    break;
                case 3:
                    $("#bindPhone").removeClass('dn').siblings().not("span").addClass('dn');
                    break;
                case 4:
                    $("#upload").removeClass('dn').siblings().not("span").addClass('dn');
                    $("#upTitle").text("您已经晒过照片");
                    if(point){
                        $("#serialNum").text(point);
                    }
                    break;
                case 5:
                    $("#default").removeClass('dn').siblings().not("span").addClass('dn');
                    if(point){
                        $("#reason").text(point);
                    }
                    break;
                default:
                    $("#pop-upload").addClass('dn');
                    break;
            }
            $("#closeThis").swipe({
                tap: function() {
                    $("#pop-window").addClass('dn');
                    $(".dia-wrap").addClass('dn');
                }
            });
        }
    });
