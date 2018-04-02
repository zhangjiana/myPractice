/**
 * Created by Administrator on 15-9-12.
 */


addEvent(window,'load',function(){
    var oPacity_banner = document.getElementById('opacity_banner');
    var oPacity_Ul = document.getElementById('opacity_ul');

    var aPacity_Li = oPacity_Ul.getElementsByTagName('li');

    //鼠标点击，停止透明度切换；鼠标放上去，开始透明度切换
    oPacity(oPacity_Ul,aPacity_Li,oPacity_banner)

})


addEvent(window,'load',function(){
    setInterval(function(){
        ShowCountDown(2016,1,1,'spanTime')
    },1000);
    //window.setInterval(ShowCountDown(2016,1,1,'spanTime'),1000)
})