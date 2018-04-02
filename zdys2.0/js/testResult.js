var arr=GetQueryString("arr");
$(function(){
    if(arr){
        arr=GetQueryString("arr").split("");
        $(".score-banner").append('<img id="score" class="score" src="http://imgcdn.zhaoduiyisheng.com/img/0'+(arr.length-1)+'0.png"/>');
        if(arr.indexOf("4")!=-1||arr.indexOf("5")!=-1||arr.indexOf("6")!=-1){
            $("#suggestion").append('<p class="msg-title f30">2个月内，建议到以下科室做对应的检查！ </p>');
            $("#suggestion").append('<ul class="msg-ul f28 c-66 pl20"></ul>');
        }
        if(arr.indexOf("4")!=-1){
            $(".msg-ul").append('<li>需要关注脑血管疾病，建议到神经科进行咨询！</li>');
        }
        if(arr.indexOf("5")!=-1){
            $(".msg-ul").append('<li>需要关注心血管疾病，建议到心内科进行咨询！</li>');
        }
        if(arr.indexOf("5")!=-1&&arr.indexOf("6")!=-1){
            $(".msg-ul").append('<li>需要关注冠心病的风险，建议到心内科就诊！</li>');
        }
        var text;
        switch (arr.length-1)
        {
            case 0:
                text="您的健康状况良好，请继续保持";
                $(".bot-menu li").css("background"," -webkit-linear-gradient(left,#53bca9,#6ec5c1)");
                $(".msg-ul li").addClass("green");
                $(".score-banner").css("background","url(http://imgcdn.zhaoduiyisheng.com/img/test_bg_green.jpg) no-repeat center");
                break;
            case 1:case 2:
                text="TA的健康已经敲响警钟，要加强锻炼哦~";
                $(".bot-menu li").css("background"," -webkit-linear-gradient(left,#53bca9,#6ec5c1)");
                $(".msg-ul li").addClass("green");
                $(".score-banner").css("background","url(http://imgcdn.zhaoduiyisheng.com/img/test_bg_green.jpg) no-repeat center");
            break;
            case 3:case 4:
                text="您需要坐下来，好好反思TA的生活习惯，加强锻炼和营养搭配";
                $(".bot-menu li").css("background"," -webkit-linear-gradient(left,#d38b51,#d9b05d)");
                $(".msg-ul li").addClass("yellow");
                $(".score-banner").css("background","url(http://imgcdn.zhaoduiyisheng.com/img/test_bg_yellow.jpg) no-repeat center");
            break;
            case 5:case 6:
                text="建议TA在2个月内看医生，调整好心理状态，或是好好休息一段时间。 ";
                $(".bot-menu li").css("background"," -webkit-linear-gradient(left,#eb6685,#f1b88b)");
                $(".msg-ul li").addClass("red");
                $(".score-banner").css("background","url(http://imgcdn.zhaoduiyisheng.com/img/test_bg_red.jpg) no-repeat center");
            break;
        }
        $(".score-banner").append('<p class="f28 c-white prl30" id="text">'+text+'</p>');
        $("title").text("60秒健康自测法");
    }

});