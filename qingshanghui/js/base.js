// JavaScript Document

function pay_tab(){
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
}