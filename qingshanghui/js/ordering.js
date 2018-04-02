/**
 * Created by Administrator on 15-9-11.
 */
addEvent(window,'load',function(){

    var oSend_time = document.getElementById('send_time');

    var aSend_time_choose = oSend_time.getElementsByTagName('input');

   for(var k = 0;k < aSend_time_choose.length;k++ ) {
       aSend_time_choose[k].onclick = function () {

               for(var m = 0; m <  aSend_time_choose.length ;m++){
                   aSend_time_choose[m].checked = false;
               }
               this.checked = true;
       }
   }
    /*
    var oFapiao =document.getElementById('fapiao');
    var aFapiao_choose = oFapiao.getElementsByTagName('label');

    for(var n = 0;n < aFapiao_choose.length;n++ ) {
        aFapiao_choose[n].onclick = function () {

            for(var l = 0; l <  aFapiao_choose.length ;l++){
                aFapiao_choose[l].checked = false;
            }

            this.checked = true;
        }
    }
*/
});


addEvent(window,'load',function(){
    var oPay_ways = document.getElementById('pay_ways');
    var oPay_box = document.getElementById('pay_box');
    var oPay_ways_Li = oPay_ways.getElementsByTagName('li');
    var oPay_box_Ul = oPay_box.getElementsByTagName('ul');

    for(var i = 0;i < oPay_ways_Li.length;i++){
        oPay_ways_Li[i].index = i;
        oPay_ways_Li[i].onclick = function(){
            for( var j = 0; j< oPay_box_Ul.length;j++){
                oPay_box_Ul[j].style.display = 'none';
                oPay_ways_Li[j].className = 'not_change';
            }
            oPay_box_Ul[this.index].style.display = 'block';
            oPay_ways_Li[this.index].className = 'changed';
        }
    }
})