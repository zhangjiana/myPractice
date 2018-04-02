
var ajaxUrl="http://www-test.zhaoduiyisheng.com/api/";
$(function(){
    exchangeScore();
});

function exchangeScore(){
    $("#btn-exchange").swipe({
        tap:function(){
            $.ajax({
                type:"POST",
                url:ajaxUrl+"User/PointsRedeem?sessionId="+window.localStorage.sessionId,
                contentType: "text/plain; charset=UTF-8",
                dataType:"json",
                data:"e1a3aad0-be72-11e5-b811-00163e0012bb",
                success: function(data){
                    if (data.code == 0){
                        console.log("兑换成功");
                        $("#notice").text("兑换成功");
                    }else{
                        $("#notice").text(data.message);
                    }
                },
                error:function(res){
                    if(res.status == 401){
                        myalert.tips({
                            txt:"会话超时，请重新登录",
                            fnok:function(){
                                window.location = "../html/newLogin.html";
                            },
                            btn:1
                        });

                    }
                }
            });
        }
    })
}