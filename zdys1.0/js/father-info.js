



$(function(){
    changePage();
    getMemberName();
    selectSex();
    getMemberInfo();
    changeFatherInfo();
});

var patientUuid=GetQueryString("patientUuid");
var relationShip=GetQueryString("thisrelationShip");
//获取家庭成员名字(标题)
function getMemberName(){

    $("#member-name").text(relationShip);

}

//选择性别
function selectSex(){
    $("#select-sex").swipe({
        tap:function(e,target){
            if($(target).hasClass('label-man')){
                $(target).addClass('selected').next().removeClass('selected');
            }else if($(target).hasClass('label-woman')){
                $(target).addClass('selected');
                $(target).addClass('selected').prev().removeClass('selected');
            }
        }
    });
}
//获取爸爸基本资料
function getMemberInfo(){
    console.log(patientUuid);
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId="+window.localStorage.sessionId+"&uuid="+patientUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType:"json",
        success: function(data){
            if (data.code == 0){

                //获取疾病标签
                var $labelContainer=$("#member-label");
                var labelArr=eval(data.data.tagList);
                if(labelArr.length==0){
                    $labelContainer.html('<div class="tc c-yellow">暂无标签</div>');
                }else{
                    for(var i=0;i<labelArr.length;i++){
                        var $span=$('<span>'+labelArr[i].name+'</span>');
                        $labelContainer.append($span);
                    }
                }
                /*姓名*/
                if(data.data.name){
                    $("#name").val(data.data.name)
                }
                /*性别*/
                if(data.data.gender){

                    if(data.data.gender == 'male'){
                        $("#select-sex span").eq(1).addClass('selected').siblings().removeClass('selected');
                    }else {

                        $("#select-sex span").eq(2).addClass('selected').siblings().removeClass('selected');
                    }
                }
                //出生日期
                if(data.data.birthDate){
                    var birthDate=data.data.birthDate;
                    var year=birthDate.slice(0,4);
                    $("#bron-year").val(year);
                }else {
                    $("#bron-year").val(1980);
                }
                //所在城市
                getProvince(data.data.province);
                getCity(data.data.province,data.data.city);

            }

        },
        error:function(status){
            if(status.code == 401){
                alert("会话超时，请重新登录");
                window.location = "../login.html";
            }
        }
    });
}
//修改爸爸信息并提交
function changeFatherInfo(){
    $("#btn-change-info").swipe({
        tap:function(){
            var config={
                uuid:patientUuid,
                name:$("#name").val(),
                gender:$(".selected").attr("data-sex"),
                birthDate:$("#bron-year").val()+"-01-01",
                province:$("#province").val(),
                city:$("#city").val(),
                height:0,
                weight:0
            };

            $.ajax({
                type:"POST",
                url:"http://www.zhaoduiyisheng.com/api/Relation/ModifyPatient?sessionId="+window.localStorage.sessionId,
                contentType: "text/plain; charset=UTF-8",
                dataType:"json",
                data:JSON.stringify(config),
                success: function(data){
                    if (data.code == 0){
                       //console.log(config);
                        window.location.href="father-info.html?thisrelationShip="+relationShip+"&patientUuid="+patientUuid;
                    }else{
                        console.log(data.message);
                    }
                },
                error:function(status){
                    if(status.code == 401){
                        alert("会话超时，请重新登录");
                        window.location = "../login.html";
                    }

                }
            });
        }
    })
}

//获取地址中的信息
function GetQueryString(name){
    /*定义正则，用于获取相应参数*/
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    /*字符串截取，获取匹配参数值*/
    var r = window.location.search.substr(1).match(reg);
    /*返回参数值*/
    if(r!=null){
        return  decodeURI(r[2]);
    }
    else{
        return null;
    }

}
//点击基本资料显示基本资料页面
function changePage(){
    $("#link-basic-info").swipe({
        tap:function(){
            //$("#father-page").css({"-webkit-transform":"translate3d(0,0,0)","transform":"translate3d(0,0,0)"});
            $("#basic-info-page").css({"-webkit-transform":"translate3d(-100%,0,0)","transform":"translate3d(-100%,0,0)"});
        }
    });
    $("#basic-info-back").swipe({
        tap:function(){
            //$("#father-page").css({"-webkit-transform":"translate3d(0,0,0)","transform":"translate3d(0,0,0)"});

            $("#basic-info-page").css({"-webkit-transform":"translate3d(0,0,0)","transform":"translate3d(0,0,0)"});
           /* $("#father-page").css("visibility","visible");
            $("#basic-info-page").css("visibility","hidden");*/
        }
    })
}

