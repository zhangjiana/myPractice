
$(function(){
    var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";
    var scroll = new IScroll('#scroll-order', { probeType: 3, mouseWheel: true });
    //获取订单信息ajax
    function getMyOrderAjax(){
        var url;
        if(!GetQueryString('patientUuid')){
            url=ajaxUrl+"User/OrderList?sessionId="+window.localStorage.sessionId;
        }else{
            url=ajaxUrl+"User/OrderList?sessionId="+window.localStorage.sessionId+"&patientUuid="+GetQueryString('patientUuid');
        }
        $.ajax({
            type:"GET",
            url:url,
            contentType: "text/plain; charset=UTF-8",
            dataType:"json",
            success: function(data){
                if (data.code == 0){
                    $("#my-order-box").html("");
                    if(data.data.length){
                        for(var i=0;i<data.data.length;i++){
                            createOrderList(data.data[i]);
                        }
                    }else{
                        $("#my-order-box").append('');
                        $(".no-order-wrap").removeClass("dn");
                    }
                    myOrderTab();
                    showPrice();
                }else if(data.code == 909){
                    loginTimeOut();
                }

            },
            error:function(status){
                if(status.code == 401){
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
        }).success(function(){
            scroll.refresh();
        })
    }
    //创建订单结构
    function createOrderList(data){
        var orderTime='';
        var date=new Date();
        var today=date.getFullYear()+'-';
        if((date.getMonth()+1)<10){
            today+='0'+(date.getMonth()+1)+'-'+date.getDate();
        }else{
            today+=(date.getMonth()+1)+'-'+date.getDate();
        }
        if(data.createTime.indexOf(today)==-1){
            orderTime=data.createTime.slice(0,10);
        }else{
            orderTime=data.createTime.slice(11,16);
        }

        var $divWrap=$('<div class="order-item pr"  data-patientUuid="'+data.patientUuid+'" data-orderId="'+data.orderId+'"></div>');
        var $div1=$('<div class="cbo">'+
        '<span class="fl f28 order-label">'+data.subject+'</span>'+
        '<em class="fl c-red service-price">'+data.currentPriceStr+'</em>'+
        '<em class="fr f20 c-99" id="order-time">'+orderTime+'</em>'+
        '</div>');
        var $div2=$('<div class="cbo">'+
        '<span class="order-label fl"><em class="spacing-ask">咨询</em>者</span>'+
        '<em class="c-66">'+data.patientName+'</em>'+
        '</div>');
        var $div3=$('<div class="cbo">'+
        '<span class="order-label fl">'+
        '<em class="spacing-order">订单编</em>号'+
        '</span>'+
        '<em class="c-66">'+data.orderId+'</em>'+
        '</div>');
        var $case=$('<div class="cbo">'+
        '<span class="order-label fl">'+
        '<em class="spacing-order">病症名</em>称'+
        '</span>'+
        '<em class="c-66">'+data.patientCaseName+'</em>'+
        '</div>');
        var $btn=$('<span class="order-btn fr f20 pa"><a class="c-99" href="serviceProcess.html?patientUuid='+data.patientUuid+'&caseUuid='+data.patientCaseUuid+'&patientName='+data.patientName+'">订单跟踪</a></span>');
        var $img;
        if(data.finished){
            $img=$('<img order-status="finish" class="pa order-status" src="http://imgcdn.zhaoduiyisheng.com/img/icon/order_finish.png"/>');
        }else{
            $img=$('<img order-status="unfinish" class="pa order-status" src="http://imgcdn.zhaoduiyisheng.com/img/icon/order_unfinish.png"/>');
        }
        $divWrap.append($div1);
        $divWrap.append($div2);
        $divWrap.append($case);
        $divWrap.append($div3);
        $divWrap.append($btn);
        $divWrap.append($img);
        $("#my-order-box").append($divWrap);
    }
    //个人中心订单tab切换
    function myOrderTab(){
        /*全部订单*/
        $("#my-order-nav li").eq(0).swipe({
            tap:function(){
                $(this).addClass("selected").siblings().removeClass("selected");
                $(".order-item").removeClass("dn");
                if($("#my-order-box").children().length){
                    $(".no-order-wrap").addClass("dn");
                }
                scroll.refresh();
            }
        });
        //完成订单
        $("#my-order-nav li").eq(1).swipe({
            tap:function(){
                $(this).addClass("selected").siblings().removeClass("selected");
                if($(".order-item")){
                    $(".order-item").addClass("dn");
                    $(".order-status[order-status='finish']").parent().removeClass("dn");
                }
                if($(".order-status[order-status='finish']").length==0){
                    $(".no-order-wrap li").eq(1).text("您还没有完成订单");
                    $(".no-order-wrap").removeClass("dn");
                }else{
                    $(".no-order-wrap").addClass("dn");
                }
                scroll.refresh();
            }
        });
        //未完成订单
        $("#my-order-nav li").eq(2).swipe({
            tap:function(){
                $(this).addClass("selected").siblings().removeClass("selected");
                if($(".order-item")){
                    $(".order-item").removeClass("dn");
                    $(".order-status[order-status='finish']").parent().addClass("dn");
                }
                if($(".order-status[order-status='unfinish']").length==0){
                    $(".no-order-wrap li").eq(1).text("您还没有未完订单");
                    $(".no-order-wrap").removeClass("dn");
                }else{
                    $(".no-order-wrap").addClass("dn");
                }
                scroll.refresh();
            }
        });
    }
    //函数调用
    getMyOrderAjax();

});

