// JavaScript Document



//购物数量
addEvent(window,'load',function(){
    //尺寸表格隔行变色
   tR_changecolor('size_table');



    var oProduct_size_choose = document.getElementById('product_size_choose');
    var oProdcut_choose_span = oProduct_size_choose.getElementsByTagName('span');
    var oProduct_number_choose = document.getElementById('product_number_choose');

    var oProduct_number_choose_span =  oProduct_number_choose.getElementsByTagName('span');
    var oQuantity_number = document.getElementById('quantity_number');
    for(var j = 0; j < oProdcut_choose_span.length;j++) {
        oProdcut_choose_span[j].index = j;
        oProdcut_choose_span[j].onclick = function () {
            for( var k = 0; k < oProdcut_choose_span.length ; k++) {

                oProdcut_choose_span[k].className = 'not_change';
            }
                oProdcut_choose_span[this.index].className = 'change';
        }
    }


    //按钮控制数量增加
    oProduct_number_choose_span[0].onclick =function() {

        if(oQuantity_number.value == 1){
            oQuantity_number.value = 1;
        }
        else{
            oQuantity_number.value--;
        }
    }
    oProduct_number_choose_span[2].onclick =function() {
            oQuantity_number.value++;
    };






});


//弹出登录对话框
addEvent(window,'load',function(){

    var oShopping_now = document.getElementById('shopping_now');
    var oClose_dialog = document.getElementById('close_dialog');
    var oShow_big_div = document.getElementById('show_big_div');
    var oLogin_dialog = document.getElementById('login_dialog');

    var a = getCookie('user');
    var b = getCookie('pwd');
    oShopping_now.onclick = function(){
        if(a&&b){
            window.open('ordering.html','_blank')
        }
        else{
        oShow_big_div.style.display = 'block';
        oLogin_dialog.style.display = 'block';
        }
    };
    oClose_dialog.onclick = function () {
        oShow_big_div.style.display = 'none';
        oLogin_dialog.style.display = 'none';
    }



})

addEvent(window,'load',function(){
    setInterval(function(){
        ShowCountDown(2016,1,1,'spanTime')
    },1000);
    //window.setInterval(ShowCountDown(2016,1,1,'spanTime'),1000)
})