/**
 * Created by Administrator on 15-8-10.
 */




window.onload=function(){
   //辽宁等地区
    var T1=document.getElementById('t1');
    var T1_down=document.getElementById('t1-down');
    var Ticon3=document.getElementById('icon3');



        function sShow(obj1,obj2,attr){
           obj1.style.display='block';
           obj2.style.background=attr;
        }

        function hHide(obj1,obj2,attr){
            obj1.style.display='none';
            obj2.style.background=attr;
        }


   /*var time1=setTimeout(function(){
        sShow(T1_down,Ticon3,'url(img/icon33.png)')},600);
*/
    T1.onmouseover=function(){
       // clearTimeout(time1);
        time1=setTimeout(function(){
            sShow(T1_down,Ticon3,'url(img/icon33.png)')},600);
       // T1_down.style.display='block';
    };


    T1.onmouseout=function(){
       clearTimeout(time1);
        time2=setTimeout(function(){
            hHide(T1_down,Ticon3,'url(img/icon3.png)')},600);
    };
    T1_down.onmouseover=function(){
       clearTimeout(time2);
       T1_down.style.display='block';
        Ticon3.background='url(img/icon33.png)';
    };

    var T2=document.getElementById('t2');
    var T2_down=document.getElementById('t2-down');

    var T2span=document.getElementById('span2');

    T2.onmouseover=function(){
        // clearTimeout(time1);
        time12=setTimeout(function(){

            sShow(T2_down,T2span,'url(img/icon55.png)')},600);

        // T1_down.style.display='block';
    };


    T2.onmouseout=function(){
        clearTimeout(time12);
        time22=setTimeout(function(){
            hHide(T2_down,T2span,'url(img/icon5.png)')},600);
    }
    T2_down.onmouseover=function(){
        clearTimeout(time22)
        T2_down.style.display='block';
        T2span.background='url(img/icon55.png)';
    }


    var T3=document.getElementById('t3');
    var T3_down=document.getElementById('t3-down');

    var T3span=document.getElementById('span3');

    T3.onmouseover=function(){
        // clearTimeout(time1);
        time13=setTimeout(function(){

            sShow(T3_down,T3span,'url(img/icon55.png)')},600);

        // T1_down.style.display='block';
    };


    T3.onmouseout=function(){
        clearTimeout(time12);
        time23=setTimeout(function(){
            hHide(T3_down,T3span,'url(img/icon5.png)')},600);
    }
    T3_down.onmouseover=function(){
        clearTimeout(time23)
        T3_down.style.display='block';
        T3span.background='url(img/icon55.png)';
    }


    var T4=document.getElementById('t4');
    var T4_down=document.getElementById('t4-down');

    var T4span=document.getElementById('span4');

    T4.onmouseover=function(){
        // clearTimeout(time1);
        time14=setTimeout(function(){

            sShow(T4_down,T4span,'url(img/icon55.png)')},600);

        // T1_down.style.display='block';
    };


    T4.onmouseout=function(){
        clearTimeout(time14);
        time24=setTimeout(function(){
            hHide(T4_down,T3span,'url(img/icon5.png)')},600);
    }
    T4_down.onmouseover=function(){
        clearTimeout(time24)
        T4_down.style.display='block';
        T4span.background='url(img/icon55.png)';
    }






//获取当前时间


    time();
    setInterval(time,1000)



    //三级菜单
    //var oMenu=document.getElementById('menu');
    //var oB1=getByClass(oMenu,'h2')[0];

   /* function hide(){
        oSed.style.display='none';
    }
    function show(){
        oTrd.style.display='block';
    }
    time1=setInterval(hide,2000);
    time2=setInterval(show,2000);*/
    //alert(oB1.tagName);//传参失败，换另一种方法；
    //var oB1=oMenu.getElementsByTagName('h2');
    var oSed=document.getElementById('sed');
    var aLi=oSed.getElementsByTagName('li');
    var aBox=document.getElementById('box');
    var oTrd=aBox.getElementsByTagName('div');


    for(i=0;i<aLi.length;i++){
        aLi[i].index=i;
        oTrd[i].index=i;
        aLi[i].onmouseover=function(){

          tabShow2(aLi,oTrd,this,'link','active')

        };
        oTrd[i].onmouseout=aLi[i].onmouseout=function(){

            for(j=0;j<aLi.length;j++){
                oTrd[j].style.display='none';
                aLi[j].className='link';
            }

        };

        oTrd[i].onmouseover=function(){

            tabShow(aLi,oTrd,this)

        }

    }




/*
    //banner下的滑块
    var oHua=document.getElementById('huakuai');
    var bLi=oHua.getElementsByTagName('li');
    var oBox2=document.getElementById('box2');
    var oDiv2=oBox2.getElementsByTagName('div');

    for(i=0;i<bLi.length;i++){
        bLi[i].index=i;
        bLi[i].onmouseover=function(){

            tabShow1(bLi,oDiv2,this,'#CCCCCC','#FF3C3C');


        };

    }
*/

    //nav 覆盖一个滑动块
    var oNav=document.getElementById('nav');
    var oLi=oNav.getElementsByTagName('li');
    var oCover=document.getElementById('cover');
    for(i=0;i<oLi.length;i++){

        oLi[i].index=i;
        oLi[i].onmouseover=function(){
            oCover.style.width=oLi[this.index].offsetWidth+'px';
            var iSpd=0;
            for(j=0;j<oLi.length;j++){
                if(j<this.index){
                    iSpd+=oLi[j].offsetWidth;
                }
            }
        startMove(oCover,{left:iSpd})
        }


    }




  //banner滑块滚动
    bannerShow();



    //话费充值
    var oRight2=document.getElementById('right2');
    var oBox3=document.getElementById('box3');
    var cLi=oRight2.getElementsByTagName('li');
    var oDiv3=oBox3.getElementsByTagName('div');

    for(i=0;i<cLi.length;i++) {
        cLi[i].index = i;
        cLi[i].onmouseover = function () {

            for (j = 0; j < cLi.length; j++) {
                oDiv3[j].style.display = 'none';
                cLi[j].style.color = '#333333';
            }
            oDiv3[this.index].style.display = 'block';
            cLi[this.index].style.color = '#E60012';
        }

    }
}


//获取当前时间；
function time(){
    var oDiv1=document.getElementById('div1');
    var oDate=new Date;
    year=oDate.getFullYear();
    mon=oDate.getMonth()+1;
    day=oDate.getDate();
    hour=oDate.getHours();
    min=oDate.getMinutes();
    sec=oDate.getSeconds();

    oDiv1.innerHTML=''+year+'-'+toD(mon)+'-'+toD(day)+' '+toD(hour)+':'+toD(min)+':'+toD(sec);

}
function toD(obj){
    if(obj<10){
      return  '0'+obj
    }
    else{
       return ''+obj;
    }
}



//bannner左右滑动
function bannerShow(){


    var oUl=document.getElementById('ul1');
    var dLi=oUl.getElementsByTagName('li');

    var oBtn=document.getElementById('huakuai');
    var aBtn=oBtn.getElementsByTagName('li');
    oUl.innerHTML+=oUl.innerHTML;

    var iWidth=dLi[0].offsetWidth;

    oUl.style.width=(iWidth*dLi.length)+'px';

    var iSpeed=0;
    var j=0;

    var Pre=document.getElementById('pre');
    var Next=document.getElementById('next');

    Pre.onclick=function(){
        j=j-2;
        if(j<-1){
            j=aBtn.length-2;
        }
        clearInterval(timer);
        autotab();
    };

    Next.onclick=function(){
        if(j==aBtn.length-2){
            j=0;
        }
        clearInterval(timer);
        autotab();
    }




    for(i=0;i<aBtn.length;i++){
        aBtn[i].index=i;
        aBtn[i].onmouseover=function(){

            j=this.index-1;
            clearInterval(timer);
            autotab();

        }
    }


    function autotab(){

        clearInterval(timer);
        j++;

        for(i=0;i<aBtn.length;i++){
            aBtn[i].style.background='#CCCCCC';
        }

        if(j==dLi.length/2){
            aBtn[0].style.background='#FF3C3C';
        }

        else {
            aBtn[j].style.background='#FF3C3C';
        }
        iSpeed=-iWidth*j;

        startMove(oUl,{left:iSpeed},clear)
    }

    var timer=setInterval(autotab,3000);

    function clear(){

        timer=setInterval(autotab,3000);
        if(j==dLi.length/2){
            j=0;
            oUl.style.left=0;
        }
    }
}







//getByClass
function getByClass(obj,attr){
    var arr=[];
    var aAll=obj.getElementsByTagName('*');
    for(i=0;i<aAll.length;i++) {
        if (aAll[i].className == attr) {
            arr.push(aAll[i]);
        }

    }

     return arr;
}



//三级菜单的tab切换
function tabShow2(Li,Trd,obj,attr1,attr2){
    for(j=0;j<Li.length;j++){
        Trd[j].style.display='none';
        Li[j].className=attr1;
    }

    Trd[obj.index].style.display='block';
    Li[obj.index].className=attr2;
}




//banner下的滑块滑过切换
  //  tabShow1
/*
function tabShow1(li,div,obj,attr1,attr2){

    for(j=0;j<li.length;j++){
        div[j].style.display='none';
        li[j].style.background=attr1;
    }
    div[obj.index].style.display='block';
   li[obj.index].style.background=attr2;


}
*/