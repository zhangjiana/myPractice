/**
 * Created by zJ on 2015/12/4.
 */




var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?40ebb256813c47bae54469f99360e605";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();


//设置最小高度,输入框和底部菜单问题
$('body').css('min-height',$(window).height());

/*自定义弹窗*/
function Dralert(){
    this.div = $('#alert');
    this.text = $('#alert-text');
    this.ok = $('#alertok');
    this.no = $('#alertno');
    var This = this;
    this.run = function(str,fnok,fnno){
        This.text.text(str);
        This.div.show();
        This.ok.swipe({
            tap:function(){
                This.div.hide();
                if(fnok){
                    fnok();
                }
            }
        });
        This.no.swipe({
            tap:function(){
                This.div.hide();
                if(fnno){
                    fnno();
                }
            }
        });
    }
}
//创建弹窗
var myalert = new Dralert();