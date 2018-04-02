// JavaScript Document
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr]
		}
		else{
			return getComputedStyle(obj,false)[attr]
				}
	
	}
function startMove(obj, json, fnEnd)
{
    var MAX=18;
    //每次调用就只有一个定时器在工作(开始运动时关闭已有定时器)
    //并且关闭或者开启都是当前物体的定时器，已防止与页面上其他定时器的冲突，使每个定时器都互不干扰 
    clearInterval(obj.timer); 
    obj.timer=setInterval(function (){
 
        var bStop=true; // 假设：所有的值都已经到了
 
        for(var name in json)
        {
            var iTarget=json[name];  // 目标点
 
            //处理透明度，不能使用parseInt否则就为0了 
 
            if(name=='opacity')
            {
 
                // *100 会有误差 0000007 之类的 所以要用 Math.round() 会四舍五入
                var cur=Math.round(parseFloat(getStyle(obj, name))*100); 
            }
            else
            {
                var cur=parseInt(getStyle(obj, name));  // cur 当前移动的数值
            }
 
            var speed=(iTarget-cur)/5;  // 物体运动的速度 数字越小动的越慢  /5 : 自定义的数字
 
            speed=speed>0?Math.ceil(speed):Math.floor(speed);
 
            if(Math.abs(speed)>MAX)speed=speed>0?MAX:-MAX;
 
            if(name=='opacity')
            {
                obj.style.filter='alpha(opacity:'+(cur+speed)+')'; //IE
                obj.style.opacity=(cur+speed)/100; //ff chrome
            }
            else
            {
                obj.style[name]=cur+speed+'px';
				document.title=cur
            }
 
            // 某个值不等于目标点 
            if(cur!=iTarget)
            {
                bStop=false;
            }
        }
 
        // 都达到了目标点
        if(bStop)
        {
            clearInterval(obj.timer);
 
            if(fnEnd) //只有传了这个函数才去调用
            {
                fnEnd();
            }
        }
    }, 20);
}