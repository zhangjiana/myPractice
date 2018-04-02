// JavaScript Document




//兼容，获取非行内样式
	function getStyle(obj,attr){
		if(obj.currentStyle)	
		{
		 return obj.currentStyle[attr]
		}
		else{
			return getComputedStyle(obj,false)[attr]
		}
	}
	
//求和
	function sum(){
		var add=0;
	for(i=0;i<arguments.length;i++){
		
		add+=arguments[i]
		}
	return add;
	}



//改变行内样式
 function setStyle(){
	
	arguments[0].style[arguments[1]]=arguments[2]	
	
}



//通过class来获取对象
	function getByClass(obj,attr){
		var aAll=obj.getElementsByTagName('*');
		var arr=[];
		for(i=0;i<aAll.length;i++){
			if(aAll[i].className==attr){
				arr.push(aAll[i]);
			}
		}
		return arr
		}
//tabShow 三级菜单 的循环

	function tabShow(Li,Trd,obj) {
		for (j = 0; j < Li.length; j++) {
			Trd[j].style.display = 'none';

		}

		Trd[obj.index].style.display = 'block';
	}