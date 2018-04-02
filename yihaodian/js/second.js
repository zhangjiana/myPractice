/**
 * Created by Administrator on 15-8-19.
 */
window.onload=function(){
    var oBtn=document.getElementById('bnt');
    var oGoods=document.getElementById('goods');
    var aDl=oGoods.getElementsByTagName('dl');



    oBtn.onclick=function(){
        var arr=[];//如果数组定义为全局变量，排序后再点击时，会重复。
    for(i=0;i<aDl.length;i++){
        arr.push(aDl[i]);
    }

        arr.sort(function(num1,num2){
            return parseInt(num1.children[1].children[0].children[0].innerHTML)-parseInt(num2.children[1].children[0].children[0].innerHTML);
        });

        numSort(arr);




    }

}

function numSort(arr){
    var oGoods=document.getElementById('goods');
    var aDl=oGoods.getElementsByTagName('dl');
   // var aB=oGoods.getElementsByTagName('b');
	var j=aDl.length-1;

    for(i=j;i>=0;i--){

        oGoods.removeChild(aDl[i]);


    }


    for(i=0;i<arr.length;i++){
        var oDl=document.createElement('dl');

                oDl.innerHTML=arr[i].innerHTML;
                oDl.className='goods';
        oGoods.appendChild(oDl);
    }
}