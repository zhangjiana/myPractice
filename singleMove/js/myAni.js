

window.onload=function(){
    if(isPortrait("notice")){
        initSlideFun();
        playAudio();
        playMusic("audio","musicPic");
    }
    window.onresize=function(){
        if(isPortrait("notice")){
            initSlideFun();
            playAudio();
            playMusic("audio","musicPic");
        }
    }
};
//滑动屏幕和动画的初始函数
function initSlideFun() {
    var len = document.querySelectorAll('.swiper-slide').length - 1,
        arrow = document.querySelector('.bot-arow'),
        cell = document.querySelector('.cell'),
        txtlist = document.getElementById('txtlist').getElementsByTagName('li');
        len2 = txtlist.length,
        i = 0;
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical', //滑动方向horizontal,vertical
        effect: 'slide', //cube,slide,fade
        onInit: function(swiper) { //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
            for(i=0;i<len2;i++){
                txtlist[i].className ='animated hinge fromSmallToBig d'+(i+3)+'s';
            }
        },
        onSlideChangeEnd: function(swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        },
        onSlideChangeStart: function(swiper) {
            arrow.style.display = swiper.activeIndex === len? 'none': 'block';
            cell.src = swiper.activeIndex === 0? 'img/cell.gif': '#';
            if(swiper.activeIndex === 0){
                for(i=0;i<len2;i++){
                    txtlist[i].className ='animated hinge fromSmallToBig d'+(i+3)+'s';
                    txtlist[i].style.visibility ='visible';
                }
            }else{
                for(i=0;i<len2;i++){
                    txtlist[i].className = '';
                    txtlist[i].style.visibility ='hidden';
                }
            }
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

