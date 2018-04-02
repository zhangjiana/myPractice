// JavaScript Document


window.onload=function(){

        var oUl=document.getElementById('nav');
        var aLi=oUl.getElementsByTagName('li');
        var aBox=document.getElementById('box');
        var oBanner=aBox.getElementsByTagName('div');
		var oCover=document.getElementById('cover');
	//首页导航nav		
        for(i=0;i<aLi.length;i++){
                aLi[i].index=i;
            aLi[i].onclick=function(){

                    for(j=0;j<aLi.length;j++){
                        oBanner[j].style.filter='alpha(opacity:0)'
						oBanner[j].style.opacity='0';

                    }
                oBanner[this.index].style.filter='alpha(opacity:100)'
				oBanner[this.index].style.opacity='1';
            }

        }
	//nav cover
		

			for(i=0;i<aLi.length;i++){
				aLi[i].index=i;

			aLi[i].onmouseover=function(){
				var iSpeed=0;
				oCover.style.width=aLi[this.index].offsetWidth+'px';
				for(j=0;j<aLi.length;j++){

					if(j<this.index){
						iSpeed+=aLi[j].offsetWidth;

					}



				}
				startMove(oCover,{left:iSpeed})
					//iSpeed=0
				//iSpeed+=aLi[this.index-1].offsetWidth;

				}
			}

	//中英文切换
	
	var oLanguage=document.getElementById('language');
	var oHuan=document.getElementById('huan');
	
	oHuan.onmouseover=oLanguage.onclick=function(){
		oHuan.style.display='block';

		}
	oHuan.onmouseout=function(){
			oHuan.style.display='none';
		}
		
		



		
		//banner下面的小圆圈 circle	
		
		var oNav2=document.getElementById('nav2');
		var bLi=oNav2.getElementsByTagName('li');
		



		//在此处本可再引用新的一个盒子来实现banner的效果，因为上面的首页已经用上了，所有此处直接引用上面
		//	的盒子，效果是一样的，只是控件不同。	


	/*
	for(i=0;i<bLi.length;i++){
			bLi[i].index=i;
		bLi[i].onmouseover=function(){
			
			for(j=0;j<bLi.length;j++){
				bLi[j].style.background='url(img/icon3.png) no-repeat';
				oBanner[j].style.display='none';
			}
			bLi[this.index].style.background='url(img/icon4.png) no-repeat';
			oBanner[this.index].style.display='block';
			
			
		}
		
		}
	 */














		//人物介绍部分
		var oPerson=document.getElementById('person');
		var cLi=oPerson.getElementsByTagName('li');
	
		var arr=['url(img/1.png) no-repeat  center center',
				'url(img/2.png) no-repeat  center center',
				'url(img/3.png) no-repeat  center center',
				'url(img/4.png) no-repeat  center center',
				'url(img/5.png) no-repeat  center center'];
		
		var arr1=['url(img/11.png) no-repeat  center center',
				'url(img/22.png) no-repeat  center center',
				'url(img/33.png) no-repeat  center center',
				'url(img/44.png) no-repeat  center center',
				'url(img/55.png) no-repeat  center center'];

		var arr2=['url(img/1d.png) no-repeat  center center',
		'url(img/2d.png) no-repeat  center center',
		'url(img/3d.png) no-repeat  center center',
		'url(img/4d.png) no-repeat  center center',
		'url(img/5d.png) no-repeat  center center'];
		var oDiv1=document.getElementById('div1');
		var	oP=oDiv1.getElementsByTagName('div');
	
		
	
		for(i=0;i<cLi.length;i++){
			cLi[i].index=i;
			//oA[i].index=i;
			
			cLi[i].onmouseover=function(){
			
				for(j=0;j<cLi.length;j++){
					
					cLi[j].style.background=arr[j];
					oP[j].style.display='none';
					}
					
			cLi[this.index].style.background=arr1[this.index];
			oP[this.index].style.display='block';
		
			}

			cLi[i].onclick=function(){

				for(j=0;j<cLi.length;j++){

					cLi[j].style.background=arr[j];
					oP[j].style.display='none';
				}

				cLi[this.index].style.background=arr2[this.index];
				oP[this.index].style.display='block';

			}


		}

	oPacity()
}

//banner透明度切换
	function oPacity(){
		var oBox=document.getElementById('box');
		var aDiv=oBox.getElementsByTagName('div');

		var oNav2=document.getElementById('nav2');
		var aBtn=oNav2.getElementsByTagName('li');
		oBox.innerHTML+=oBox.innerHTML;

		var j=0;
		var Index=1;
		for(i=0;i<aDiv.length;i++){

			if(i==j){continue;}
			aDiv[i].style.filter='alpha(opacity:0)';
			aDiv[i].style.opacity='0';
		}

		for(i=0;i<aBtn.length;i++){
			aBtn[i].index=i;
			aBtn[i].onclick= function () {
				clearInterval(timer);
				j=this.index-1;
				opacityShow();
			}
		}


		timer=setInterval(opacityShow,2000);

		function opacityShow(){
			if(j==aDiv.length/2){j=0;}
			j++;
			Index++;
			for(i=0;i<aBtn.length;i++){
				aBtn[i].style.background='url(img/icon3.png) no-repeat';
			}
			if(j==aDiv.length/2){
				aBtn[0].style.background='url(img/icon4.png) no-repeat';
			}
			else{
				aBtn[j].style.background='url(img/icon4.png) no-repeat';
			}

			aDiv[j].style.zIndex=Index;
			startMove(aDiv[j],{opacity:100},hide)

		}

		function hide(){
			for(i=0;i<aDiv.length;i++){
				if(i==j){continue;}
				aDiv[i].style.opacity='0';
				aDiv[i].style.filter='alpha(opacity:0)';
			}
		}//透明换图






	}