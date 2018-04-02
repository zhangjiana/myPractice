function setfont() {
    var clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
    if (clientWidth > 750) {
        clientWidth = 750;
    }
    document.documentElement.style.fontSize = clientWidth / 7.5 + 'px';
}
setfont();
window.addEventListener('resize', setfont);
function Loading(){
    this.loadHtml=document.createElement('div');
    this.loadHtml.innerHTML= '<div></div>'+
    '<div></div>'+
    '<div></div>'+
    '<div></div>'+
    '<div></div>';
    this.loadHtml.setAttribute('id','loading');
    this.loadHtml.setAttribute('class','load');
    this.loadHtml.setAttribute('class','center');
    this.remove=function(){
        var div = document.querySelector("#loading");
        if(div){
            div.remove();
        }
    };
}
Loading.prototype.init=function(){
    document.querySelector("body").appendChild(this.loadHtml);
};
var load=new Loading();
load.init();
window.addEventListener('load',load.remove);