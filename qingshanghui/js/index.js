// JavaScript Document


addEvent(window,'load',function(){

    //login
    var oLogin = document.getElementById('login');
    var oAccount = document.getElementById('account');
    if(document.cookie){
        oLogin.style.display = 'none';
        oAccount.value = getCookie('user');
        oAccount.style.display = 'block'
    }
    else{
        oLogin.style.display = 'block';
        oAccount.style.display = 'none';
    }



    //header头部的nav
    var oHeader_nav = document.getElementById('header_nav');
    var oHeader_nav_li = oHeader_nav.getElementsByTagName('li');
    var oHeader_pop_up = getByClass(oHeader_nav,'pop_up_box');

    var i;
    for(i = 1; i < oHeader_nav_li.length-1; i++) {
        oHeader_nav_li[i].index = i;

        oHeader_nav_li[i].onmouseover = function () {
            for(j=0;j<oHeader_pop_up.length;j++){

                oHeader_pop_up[j].style.display='none';
            }

            oHeader_pop_up[this.index-1].style.display='block';
        };

        oHeader_nav_li[i].onmouseout = function (){
            for(j=0;j<oHeader_pop_up.length;j++){

                oHeader_pop_up[j].style.display='none';
            }


        };

    }

        //手机版
    var oMobile = document.getElementById('mobile');
    var oMobileAPP = document.getElementById('mobileAPP');
    addEvent(oMobile,'mouseover', function () {
        oMobileAPP.style.display = 'block';
    });
    addEvent(oMobile,'mouseout', function () {
        oMobileAPP.style.display = 'none';
    });



    //购物袋
    var oShopping_quantity = document.getElementById('shopping_quantity');
    var oShopping_amount = document.getElementById('shopping_amount');
    var oPop_up_shopping = document.getElementById('pop_up_shopping');
    var oButton_close = document.getElementById('button_close');


    addEvent(oShopping_quantity,'mouseover',function(){
               oPop_up_shopping.style.display = 'block';
    })
    addEvent(oShopping_quantity,'mouseout',function(){
            oPop_up_shopping.style.display = 'none';
    })
    addEvent(oShopping_amount,'mouseout',function(){
        oPop_up_shopping.style.display = 'none';
    })
    addEvent(oShopping_amount,'mouseover',function(){
            oPop_up_shopping.style.display = 'block';
    })

    addEvent(oButton_close,'click',function(){
        oPop_up_shopping.style.display = 'none';
    })
    addEvent(oPop_up_shopping,'mouseover',function(){
        oPop_up_shopping.style.display = 'block';
    })
    addEvent(oPop_up_shopping,'mouseout',function(){
        oPop_up_shopping.style.display = 'none';
    })



    //content右部的smallbanner





    //鼠标滑过,图片放大,有浮层出现
    var oEventlist = document.getElementById('eventList');
    var aEventlist_Li = getByClass(oEventlist,'list_li');

    var aShow_shadow = getByClass(oEventlist,'show_shadow');
    var aShow_shadow_text = getByClass(oEventlist,'show_shadow_text');
    var aEventlist_List_Img = getByClass(oEventlist,'theImg');

    for(var k = 0;k < aEventlist_Li.length;k++){
        aEventlist_Li[k].index = k;
        aEventlist_Li[k].onmouseover = function (){
            aShow_shadow[this.index].style.display = 'block';

            aShow_shadow_text[this.index].style.display = 'block';
            startMove(aEventlist_List_Img[this.index], {width: 340, marginLeft: -10, height: 212, marginTop: -10});

        };
        aEventlist_Li[k].onmouseout = function (){
            aShow_shadow[this.index].style.display = 'none';

            aShow_shadow_text[this.index].style.display = 'none';
            startMove(aEventlist_List_Img[this.index], {width: 320, height: 192,margin:0});

        }
    }

   /*
   var aEventlist_List_Li = oEventlist.getElementsByTagName('li');
    for(var k = 0 ;k < aEventlist_List_Li.length ;k++){

        var aEventlist_List_Img = aEventlist_List_Li[k].getElementsByTagName('img');

        var aShow_shadow = aEventlist_List_Li[k].getElementsByClassName('show_shadow');

        var aShow_shadow_text =aEventlist_List_Li[k].getElementsByClassName('show_shadow_text');
    }


        for(var j = 0 ;j < aShow_shadow.length;j++){

           // var aShow_shadow = aEventlist_List[j].getElementsByClassName('show_shadow')

            aEventlist_List_Img[j].index = j;
            aEventlist_List_Img[j].onmouseover = function() {
                    //alert(this.index)
                    //var aShow_shadow = aEventlist_List_Li[this.index].getElementsByClassName('show_shadow');
                    //alert(aShow_shadow.length);
                    //  var aShow_shadow_text = aEventlist_List_Li[this.index].getElementsByClassName('show_shadow_text');
                   // var aEventlist_List_Img = aEventlist_List_Li[this.index].getElementsByTagName('img');
                    aShow_shadow[this.index].style.display = 'block';

                    aShow_shadow_text[this.index].style.display = 'block';
                    startMove(aEventlist_List_Img[this.index], {width: 340, marginLeft: -10, height: 212, marginTop: -10});

                };


        }
        */

});

//content右部的smallbanner

addEvent(window,'load',function(){
    var oRight_banner = document.getElementById('right_banner');
    var oSmallBanner = document.getElementById('smallbanner');
    var oSmallBannerLi = oSmallBanner.getElementsByTagName('li');
    var oPage = document.getElementById('page');
    var aPage_btn = oPage.getElementsByTagName('a');
    var oPre = document.getElementById('pre');
    var oNext = document.getElementById('next');
    var oArrow = document.getElementById('arrow');

    oRight_banner.onmouseover = function(){
        oArrow.style.display = 'block'
    };
    oRight_banner.onmouseout = function(){
        oArrow.style.display = 'none'
    };

    bannerTab(oSmallBanner,oSmallBannerLi,aPage_btn,oPre,oNext);
})

//回到顶部

addEvent(window,'load',function(){
    var oBackTop = document.getElementById('backTop');
    backTop(oBackTop)
})

//最新活动列表 弹出阴影浮层
addEvent(window,'load',function(){

    var oActivity_title = document.getElementById('activity_title');
    var oActivity_Box = document.getElementById('activity_box');
    var oActivity_title_a = oActivity_title.getElementsByTagName('a');
    var oActivity_Box_ul = oActivity_Box.getElementsByTagName('ul');

    for(i = 0;i <oActivity_title_a.length;i++){
        oActivity_title_a[i].index = i;
        oActivity_title_a[i].onmouseover = function(){
            tabShow(oActivity_Box_ul,this)
        }
    }




    var oActivity_Box_li =  oActivity_Box.getElementsByTagName('li');

    var oShadow_small =  getByClass(oActivity_Box,'shadow_small');
    var oShadow_small_text =  getByClass(oActivity_Box,'shadow_small_text');
    for( var n = 0;n < oActivity_Box_li.length; n++){
        oActivity_Box_li[n].index = n;
        oActivity_Box_li[n].onmouseover = function (){

            oShadow_small[this.index].style.display = 'block';
            oShadow_small_text[this.index].style.display ='block';
        }
        oActivity_Box_li[n].onmouseout = function (){
            oShadow_small[this.index].style.display = 'none';
            oShadow_small_text[this.index].style.display ='none';
        }
    }

})


//滚动条事件，滚动式nav固定在顶部；

addEvent(window,'scroll',function(){
    //nav fixed 在顶部
    var oNavBarId = document.getElementById('navBarId');
    var a = document.documentElement.scrollTop||document.body.scrollTop;
    if(a >= 162){
        oNavBarId.className = 'nav_container nav_container_top'
    }
    else{
        oNavBarId.className = 'nav_container'
    }


    //当滚动条滚动时 content缓缓上滑
    var oContent = document.getElementById('content_bg');
    var iSpeed = -10-a;
    startMove(oContent,{marginTop:iSpeed});



});
//banner透明度切换
addEvent(window,'load',function(){
    var oIndex_banner = document.getElementById('index_banner');
    var oBigBanner_Ul = document.getElementById('bigBanner');
    var oBigBanner_Li = oBigBanner_Ul.getElementsByTagName('li');
    oPacity(oBigBanner_Ul,oBigBanner_Li,oIndex_banner)

})




