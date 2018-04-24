// 校验规则
let checkType=(function(){
    let rules={
        email(str){
            return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        },
        mobile(str){
            return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
        },
        tel(str){
            return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
        },
        number(str){
            return /^[0-9]$/.test(str);
        },
        english(str){
            return /^[a-zA-Z]+$/.test(str);
        },
        text(str){
            return /^\w+$/.test(str);
        },
        chinese(str){
            return /^[\u4E00-\u9FA5]+$/.test(str);
        },
        lower(str){
            return /^[a-z]+$/.test(str);
        },
        upper(str){
            return /^[A-Z]+$/.test(str);
        }
    };
    //暴露接口
    return {
        //校验
        check(str, type){
            return rules[type]?rules[type](str):false;
        },
        //添加规则
        addRule(type,fn){
            rules[type]=fn;
        }
    }
})();
作者：守候i
链接：https://juejin.im/post/5adc8e18518825672b0352a8
// cookie
function setCookie(name, key, oDay) {
    let oTime = new Date();
    let oDate = oTime.getDate()
    oTime.setDate(oDate + oDay);
    document.cookie = `${name}=${value};expires=${oTime};path=/`;
}
function getCookie(name) {
    let str = document.cookie.split('; ');
    for(let i = 0; i < str.length; i++) {
        arr = str[i].split('=');
        if (arr[0] === name) {
            return arr[1]
        }
    }
    return '';
}
function removeCookie(name) {
    setCookie(name, '00', -1)
}










