

window.onload=function(){

    if(isPortrait("notice")){
        initSlideFun();

        playMusic("audio","musicPic");
    }
    window.onresize=function(){
        if(isPortrait("notice")){
            initSlideFun();

            playMusic("audio","musicPic");
        }
    };
    unlock();
};
//滑动屏幕和动画的初始函数
function initSlideFun() {
    var len = document.querySelectorAll('.swiper-slide').length - 1,
        arrow = document.querySelector('.bot-arow');
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical', //滑动方向horizontal,vertical
        effect: 'slide', //cube,slide,fade
        onInit: function(swiper) { //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function(swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        },
        onSlideChangeStart: function(swiper) {
            arrow.style.display = swiper.activeIndex === len? 'none': 'block';
        }
    });
}
//判断是否竖屏
function isPortrait(notice){
    var oNotice=document.getElementById(notice);
    var clientWidth=document.body.clientWidth;
    var clientHeight=document.body.clientHeight;
    if(clientWidth<clientHeight){
        oNotice.style.display="none";
        return true;
    }
    else{
        oNotice.style.display="block";
        return false;
    }
}
//播放音乐
function playMusic(audio,musicPic){
    var oAudio=document.getElementById(audio);

    var oMusicPic=document.getElementById(musicPic);
    oMusicPic.addEventListener("touchstart",function(){
        if(oAudio.paused){
            oAudio.play();
            oMusicPic.setAttribute("src","img/musicBtn.png");
        }
        else{
            oAudio.pause();
            oMusicPic.setAttribute("src","img/musicBtnOff.png");
        }
    })

}
function playAudio() {
    var audio=document.getElementById("audio");
    if (audio.getAttribute("src") == undefined) {
        audio.setAttribute("src",audio.dataset.src);
    }
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
            network = e.err_msg.split(":")[1];  //结果在这里
            playAudio("audio");
        });
    }, false);
}

/*解锁动画*/
function unlock(){

    var $lock = $('.lock');
    var dis = $(".lock-box").width() - $lock.width()-$(".unlock").width();

    $lock.on('touchmove',function(){
        var touch = event.targetTouches[0];
        //lock.style.left = parseInt(touch.pageX-110) + 'px';
        $(this).css({"left":parseInt(touch.pageX-110) + 'px',"top":"0"});

        $(this).removeClass('bounce animated');
        $(this).removeClass('bounceLeft animated');
        $(this).next().next().fadeOut(500);


    });

    $lock.on("touchend",function(){

        $(this).next().next().fadeIn(500);

        if(parseInt($(this).css("left"))<0){
            $(this).css({"left":0});
            $(this).addClass('bounceLeft animated').removeClass('bounce');
        } else if(parseInt($(this).css("left"))<dis||parseInt($(this).css("left"))> parseInt(dis+110)){
            $(this).css({"left":0});
            $(this).addClass('bounce animated').removeClass('bounceLeft');
        }else {
            $(this).css({"left":0});
            $(this).parent().parent().parent().addClass('dn');
            $(".bot-arow").removeClass('dn');
            $('.fir-bg').removeClass('dn');
            $(".music").removeClass('dn');
            playAudio();
        }
    });
}