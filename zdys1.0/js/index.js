/**
 * Created by zJ on 2015/12/4.
 */
    window.localStorage.url = "http://www.zhaoduiyisheng.com/api/";
   var ajaxUrl = window.localStorage.url;


var the_patientUuid = null;

var peopleName = null;
var peopleGender = null;
var peoplefAge = null;

var peopleTags = null;

var xmlHttpRequest;


  if(window.XMLHttpRequest){

    xmlHttpRequest=new XMLHttpRequest();

  }else{

    xmlHttpRequest=new ActiveXObject("Microsoft.XMLHTTP");

  }
$(function(){


  var myScroll;
  function loaded() {
    myScroll = new iScroll('member-wrap');
  }

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  document.addEventListener('DOMContentLoaded', loaded, false);







  //微信登录
  if(hrefCode) {
    removeCookie('user');
    removeCookie('pwd');
    returnCode(hrefCode);
  }else if(window.localStorage.openid){
    removeCookie('user');
    removeCookie('pwd');
    weixinUserReg(window.localStorage.openid);
  }







  /*传过去code*/
  function returnCode(hrefCode){
    $.ajax({
      type:"GET",
      url:"http://www.zhaoduiyisheng.com/api/Weixin/OauthAccessToken?code="+hrefCode,
      contentType: "text/plain; charset=UTF-8",
      dataType:"json",
      success:function(data){
        if(data.code==0){

          if(data.data.openid == null){
            weixinUserReg(window.localStorage.openid);
          }else{
            window.localStorage.openid=data.data.openid;
            var openid = data.data.openid;
            var access_token = data.data.access_token;
            weixinUserReg(openid,access_token);
          }
        }
      },
      error:function(a){
        alert(JSON.stringify(a));
      }
    });
  }

  //微信用户登录
  function weixinUserReg(openid,access_token){
    var data;
    if(access_token){
      data={
        "openid":openid,
        "accessToken":access_token
      }
    }else{
      data={
        "openid":openid
      }
    }

    $.ajax({
      type:"POST",
      url:"http://www.zhaoduiyisheng.com/api/User/WeixinLogin",
      contentType: "text/plain;charset=UTF-8",
      dataType:"json",
      data:JSON.stringify(data),
      success:function(data){

        if(data.code==0){

          window.localStorage.sessionId = data.data.sessionId;
          window.localStorage.selfUuid = data.data.uuid;

          getHomeMember(data.data.sessionId);
        }else{
          window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7d672dee4e236a9f&redirect_uri="+encodeURI("http://www.zhaoduiyisheng.com/index.html")+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
      },
      error: function(a){
        alert(JSON.stringify(a).replace(/<[^>]*>/g,'').replace(/^{".+k.web.s/g,''));
        alert('go2');
        //window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7d672dee4e236a9f&redirect_uri="+encodeURI("http://www.zhaoduiyisheng.com/index.html")+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      }
    })
  }


  //自动登录
  if(getCookie('user')&&getCookie('pwd')){
   autoLogin();
  }

  /*点击找对预防知识*/
  clickKnowledge();


  /*家庭成员点击*/
  //homeMemberClick();

  //设置member-wrap高度
  setMemberWrapHeight();

  //服务选中框
  chooseService();

  //删除成员按钮
  delMemberBtn();

  /*tab切换*/
  tabTurn();

  //基本资料页面跳转
  pageJump();

  //服务流程动画
  aniServiceProcess();



 /*基本资料验证*/
  addMemSubmit();




  /*创建病例*/
  getCreateCase();



  //分享按钮
  atricleShare();

/*刷新服务流程*/
  //每5秒刷新

 /* setInterval(function(){
    getServiceProcess()
  },5000)
*/

/*暂时不能体检，弹窗提醒*/
  healthAlert();
});


var seed = getCookie('seed');

function autoLogin(){
  var user = getCookie('user');
  var pwd = getCookie('pwd');
  var  data = {
    "mobile":user,
    "password":decrypt(pwd)
  };
  $.ajax({
    type:"POST",
    url:"http://www.zhaoduiyisheng.com/api/User/Login",
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    data:JSON.stringify(data),
    success:function(data){

      if( data.code === 0){
        window.localStorage.sessionId = data.data.sessionId;
        window.localStorage.selfUuid = data.data.uuid;

        /*获取家庭成员列表*/
        getHomeMember(data.data.sessionId);

        return true;
      }else{
        console.log('no');

        return false;
      }
    }
  });
}


/*查询家庭成员资料*/

function getHomeMemberDAta(objUuid){
  $.ajax({
    type: 'GET',
    url:"http://www.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId+"&uuid="+objUuid,
    contentType: "text/plain; charset=UTF-8",
    dataType: 'json',
    success: function (data) {
      if(data.code == 0){
        console.log("家庭成员资料");
        console.log(data);

        peopleName = data.data.name;
        peopleGender = data.data.gender;
        var   aDate = new   Date().getFullYear();
        if(data.data.birthDate){
          var birth = data.data.birthDate.slice(0,4);

          peoplefAge = parseInt(aDate - birth);
          console.log(peoplefAge);
          console.log(data.data.uuid);

          peopleTags = data.data.tagList;
        }else {
          peoplefAge = null;
        }
        $("#getIllTag").html('');
        if(data.data.tagList){
          var theTags = eval(data.data.tagList);

          for( var i = 0 ; i < theTags.length; i++){
            var $tagLi = $('<li id='+theTags[i].id+'>'+theTags[i].name+'</li>');
            $("#getIllTag").append($tagLi);
          }
        }

        if(data.data.attachList){
          var fileName = eval(data.data.attachList),
              j = 0,
              len = fileName.length,
              str = '',
              html = '',
              galleryol = $('#gallery-page1').find('ol'),
              upol = $('#find-doc-page').find('ol');
          upol.html('');
          galleryol.find('li').last().siblings().remove();
          for( ; j < len; j++){
            //console.log(fileName[i]);
            str+='<li><img data-file="'+ fileName[j] + '" data-uuid="' + objUuid +'" src="'+"http://www.zhaoduiyisheng.com/api/Relation/Attachment/Thumbnail/Download?sessionId=" + window.localStorage.sessionId+"&uuid="+objUuid+"&filename="+fileName[j]+'"><p class="dn"></p></li>';
            //downLoadData(objUuid,fileName[j]);
          }
          galleryol.find('.add-more-li').before(str);
          galleryol.children().each(function () {
            html = this.outerHTML;
            upol.prepend(html);
          });
        }
        if(data.data.description!="null"){
          $("#description").val(data.data.description);
        }else{
          $("#description").val('');
        }

      }
    }
  })
}

/*下载病例资料*/
function downLoadData(obj_patientUuid,filename){
  /*小图*/
  $.ajax({
    type: "GET",
    url: "http://www.zhaoduiyisheng.com/api/Relation/Attachment/Thumbnail/Download?sessionId=" + window.localStorage.sessionId+"&uuid="+obj_patientUuid+"&filename="+filename,
    contentType: "text/plain; charset=UTF-8",
    dataType: 'json',
    success: function (data) {
      console.log(data);
        if(data.code == 0){


        }
    }
  });
  /*大图*/
  $.ajax({
    type: "GET",
    url: "http://www.zhaoduiyisheng.com/api/Relation/Attachment/Download?sessionId=" + window.localStorage.sessionId+"&uuid="+obj_patientUuid+"&filename="+filename,
    contentType: "text/plain; charset=UTF-8",
    dataType: 'json',
    success: function (data) {
      console.log(data);
      if(data.code == 0){
        /*大图下载成功*/
        console.log(data);
      }
    }
  })
}

//删除成员按钮
function delMemberBtn(){
  $('#del-menber-btn').swipe({
    tap: function(){
      console.log(the_patientUuid);
      if(the_patientUuid){
        //调用方法
        var theli = $("#family-member .active").parent();
        if(theli.index() == 0){
          myalert.run("不可以删除自己哦")
        }else if(!theli.attr('data-uuid')){
          myalert.run('您还未添加家庭成员，确定添加吗？', function() {
            window.location = "html/add-member.html";
          },function(){
            console.log('cancel');
          });
        }else {
          myalert.run('亲，确定要删除吗？', function() {
            /*执行 DelMEMber*/
            delHomeMember();
          },function(){
            console.log('cancel');
          });
        }
      }
    }
  });
}

//删除家庭成员
function delHomeMember(){

  $.ajax({
    type:"POST",
    url:"http://www.zhaoduiyisheng.com/api/Relation/DeletePatient?sessionId="+window.localStorage.sessionId,
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    data:the_patientUuid,
    success: function(data){
      if(data.code == 0){
        console.log("delMember"+data.message);
        var theli = $("#family-member .active").parent(),
            index = theli.index();
        theli.remove();
        $("#family-member li").first().find("em").addClass('active');
        $("#service-obj").text("");
        $("#subscribe-box").children().first().css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'}).end().eq(index).remove();
        $("#service-people").children().first().addClass('active').end().eq(index).remove();
        $("#service-ul").children().first().css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'}).end().eq(index).remove();
        overflowWidth('#service-people');
      }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "../login.html";
      }

    }
  })
}


//基本资料页面跳转
function pageJump(){
  var $baseFoot = $('#basic-info-page footer'),
      $docSer = $('#doctor-service'),
      $checkSer = $('#check-service');
  $('#service-sure').swipe({
    tap:function(){
      //判断照度医生服务选择状态
      conditionJump();
      /*获取 省 和 城市列表*/
      getProvince();
    }
  });


  /*服务流程页，点击跳转到找对医生服务*/

  $("#service-ul").swipe({
    tap:function(e,t){

      if( $(t).hasClass('serviceTip-btn')){
        if($(t).hasClass('go-get-doctor')){
          var $this_peo = $("#service-people li.active");
          var this_index = $this_peo.index();
          if(this_index == 0 && !peoplefAge){
            $("#basic-info-page").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
          }else{
            $('#find-doc-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
          }
        }else if($(t).hasClass('inServiceBtn')){
          $("#find-doc-page .data-frame").eq(0).css("display","none");
          $("#find-doc-page .data-frame").eq(1).css("display","none");
          $('#find-doc-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'})
        }

      }else if($(t).hasClass('go-check')){
        if($(t).hasClass('go-get-check')){
          var $this_peo = $("#service-people li.active");
          var this_index = $this_peo.index();
          console.log(peoplefAge);
          if(this_index == 0 && !peoplefAge){
            getProvince();

            $("#basic-info-page").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});

          }else{
            checkHealth();
            $('#check-health').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
          }
        }

      }
    }
  });





  /*依据不同的情况，页面进行不同的跳转*/
  function conditionJump(){
    if($docSer.hasClass('checked')){
      $baseFoot.attr('doctor-service','true');
    }else{
      $baseFoot.attr('doctor-service','false');
    }
    //判断体检服务选择状态
    if($checkSer.hasClass('checked')){
      $baseFoot.attr('check-service','true');
    }else{
      $baseFoot.attr('check-service','false');
    }
    //判断，如果这个人的姓名存在，则认为这个人填写过基本资料，不用填写资料，直接进行下一步；

    //判断data-uuid
    var $thisLi = $("#family-member .active").parent();
     var th_index = $thisLi.index();
    console.log(peoplefAge);

    if(peoplefAge){
      if($baseFoot.attr("check-service")== 'false' &&$baseFoot.attr('doctor-service') =='false'){
        /*进入 找对预防服务*/
        $('#care-ill-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
      }else if($baseFoot.attr('doctor-service') =='true'){
       /*进入找对医生*/
        askCaseList();
        $('#find-doc-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
      }else {
        if(peopleTags){
          checkHealth();
          $("#check-health").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
        }else {
          $('#care-ill-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
          $("#care-complete").css("display","none");
          $("#care-ill-next").css("display","block");
          $("#care-ill-next").swipe({
            tap:function(){
              $('#care-ill-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
              $('#check-health').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'})
              $("#care-ill-next").css("display","none");
              $("#care-complete").css("display","block");
            }
          })
        }
        //进入找对体检服务
        //判断对应的套餐

      }
    }else/* if(peopleGender){
      //填写基本资料
      $("#select-sex").css("display","none");
      $(".selected").attr('data-sex',peopleGender);
      $("#basic-info-page").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});

    }else */ {
      /*$("#select-sex").css("display","block");*/
      $("#basic-info-page").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
    }

    /*if((index === 0 && selfMobile) || (index!==0 && $thisLi.attr("data-uuid"))){
      if($baseFoot.attr("check-service")== 'false' &&$baseFoot.attr('doctor-service') =='false'){
        /!*进入 找对预防服务*!/
        $('#care-ill-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
      }else if($baseFoot.attr('doctor-service') =='true'){
        // the_patientUuid = $thisLi.attr("data-uuid");
        //进入找对医生服务
        //查询病例服务;
        askCaseList();
        $('#find-doc-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
      }else {
        //进入找对体检服务
        //判断对应的套餐
        checkHealth();
        $("#check-health").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});

      }
    }else if(index === 0){
      //填写基本资料
      $("#basic-info-page").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});

    }else {
      /!*跳到添加成员页*!/
      window.location = 'html/add-member.html'
    }*/

    /*//判断是否第一次填资料
    if($('#base-service-item').is(":hidden")){
      console.log('没有基本服务');
      //$('#basic-info-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
    }else if($baseFoot.attr('doctor-service')==='true'){
      //$('#find-doc-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
    }else if($baseFoot.attr('check-service')==='true'){
      //$('#care-ill-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
    }*/
  }


  //关注的疾病页跳转/* 查询病例列表*/
  $baseFoot.swipe({
    tap:function(){
      if(addMemValidate()){
        var $thisLi = $("#family-member .active").parent();
        if($thisLi.attr('data-relationship')){
          console.log(the_patientUuid);
          modifyMemData();
          /*成员资料修改成功*/
        }else {
          getUSerData();
          /*个人资料添加成功*/
        }
        $('#basic-info-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
        $('#name').val('');
        $('#bron-year').val(0);
        $('#province').val(1);
        if($baseFoot.attr('doctor-service')==='true'){
          //跳转到找对医生
          $('#find-doc-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});

        }else if($baseFoot.attr('check-service')==='true') {

          //跳转到找对体检

          $("#check-health").css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
        }else {

          /*跳转到关注的疾病*/

          $('#care-ill-page').css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)'});
        }
      }
    }
  });

  //返回上一页

  $('#basic-info-back').swipe({
    tap:function(){
      $('#basic-info-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
    }
  });
  $('#care-ill-back').swipe({
    tap:function(){
      $('#care-ill-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
    }
  });
  $('#find-doc-back').swipe({
    tap:function(){
      setTimeout(function(){
        $("#find-doc-page .data-frame").css("display","block");
      },500);
      $('#find-doc-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
    }
  });
  $("#check-health-back").swipe({
    tap: function(){
      $('#check-health').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'})
    }
  })
}



//服务流程动画
function  aniServiceProcess(){
  var oldindexser = 0;
  $('#service-people').swipe({
    tap: function(e,t){
      if(t.tagName === 'LI'){
        getHomeMemberDAta($(t).attr('data-uuid'));
        var newindex = $(t).index();
        console.log(newindex);
        $(t).addClass('active').siblings().removeClass('active');
        $('#family-member li').eq(newindex).find('em').addClass('active').end().siblings().find('em').removeClass('active');
        aniLeftRight($('#service-ul').children(),newindex,oldindexser);
        aniLeftRight($('#subscribe-box').children(),newindex,oldindexser);
        oldindexser = newindex;

        the_patientUuid = $(t).attr('data-uuid');
        getServiceProcess();
      }
    }
  });
}


//设置高度,ios8
function setHeight(){
  $('.parent-height').each(function(){
    $(this).height($(this).parent().height());
  });
}
//计算宽度,需要在删除成员和ajax之后
function overflowWidth(id){
  var el = $(id),
      elc = el.children();
  el.width(elc.size()*elc.eq(0).outerWidth(true));
}
  overflowWidth('#service-people');
  overflowWidth('#family-member');


//左右动画
  function aniLeftRight(obj,Numnew,Numold){
  if(Numnew > Numold){
    obj.eq(Numold).css({'-webkit-transform':'translate3d(-200%,0,0)','transform':'translate3d(-200%,0,0)'});
    obj.eq(Numnew).css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)','z-index':9});
    obj.eq(Numnew).nextAll().css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)','z-index':8});
    obj.eq(Numnew).prevAll().css({'-webkit-transform':'translate3d(-200%,0,0)','transform':'translate3d(-200%,0,0)','z-index':8});
  }else if(Numnew < Numold){
    obj.eq(Numold).css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
    obj.eq(Numnew).css({'-webkit-transform':'translate3d(-100%,0,0)','transform':'translate3d(-100%,0,0)','z-index':9});
    obj.eq(Numnew).nextAll().css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)','z-index':8});
    obj.eq(Numnew).prevAll().css({'-webkit-transform':'translate3d(-200%,0,0)','transform':'translate3d(-200%,0,0)','z-index':8});
  }
}


  window.localStorage.theRelationship='{"father":"爸爸","mother":"妈妈","law_father":"岳父","law_mother":"岳母","brother":"兄弟","sister":"姐妹","child":"孩子","other":"其他","husband":"丈夫","wife":"妻子","maternal_grandmother":"外婆","maternal_grandfather":"外公","grandfather":"爷爷","grandmother":"奶奶","husband_mother":"婆婆","husband_father":"公公"}';

/*获取家庭成员列表*/
  function getHomeMember(objsessionId){

  $.ajax({
    type:"GET",
    url:"http://www.zhaoduiyisheng.com/api/Relation/PatientList?sessionId="+objsessionId,
    contentType: "text/plain; charset=UTF-8",
    dataType:"json",
    success: function(data){

      if(data.code == 0){

        $("#family-member li").eq(0).attr('data-uuid',window.localStorage.selfUuid);
        //window.localStorage.HomeMember = data;
          createHomeMember(data);

        overflowWidth('#family-member');
        overflowWidth('#service-people');

        //判断data-uuid
        var $thisLiMember = $("#family-member .active").parent();
          the_patientUuid = $thisLiMember.attr('data-uuid');
        console.log(the_patientUuid);

          /*查询家庭成员基本资料，主要是我 的基本资料*/
        getHomeMemberDAta(the_patientUuid);
      }
    },
    error:function(status){
      alert(JSON.stringify(status));
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "../login.html";
      }
    }
  })
}


/*创建家庭成员结构*/
function createHomeMember(data){

  the_patientUuid = window.localStorage.selfUuid;

  //设置服务流程的“我”的uuid
  $("#service-people li").eq(0).attr('data-uuid',window.localStorage.selfUuid);

  var relation = JSON.parse(window.localStorage.theRelationship);

  $.each(data.data,function(i){
    if( i>0){
      var $MemLi = $('<li data-uuid=' + data.data[i].uuid + ' data-sex='+data.data[i].gender+'  data-relationship='+data.data[i].relationship+'><em class="head ' + data.data[i].relationship + '"></em>' +
          '<span class="tc f20 db">' + relation[data.data[i].relationship] + '</span></li>');
      var $subscribe = $('<div class="personal-subscribe">'+
          '<h3 class="fl f32 c-33">找准知识&nbsp;&nbsp;守护健康</h3>'+
          '<span class="clock fr f24 c-99">10:35</span>'+
          '<div class="clb"></div>'+
          '<p class="subscribe-content">'+
          '  为您的家人填写关注的疾病资料，获取精准匹配的健康预防及愈后康复知识。'+
          '</p>'+
          '<p class="f24 subscribe-tips">温馨提示'+
          '<span class="c-99">:已有<code>96%</code>的用户转发给了自己的亲人</span>'+
          '<span class="fr turn btn-share"></span>'+
          '</p>'+
          '</div>');
      var $serviceli = '<li data-uuid='+data.data[i].uuid+'>'+relation[data.data[i].relationship]+'</li>';
      var $servicelist = '<div class="service-list">'+
          '<div class="service-flow">'+
          '<h2 class="tit">找对医生服务流程</h2>'+
          '<div class="doc-flow-icon flex">'+
          '<figure>'+
          '<img class="center" src="img/icon_upload.png" alt="">'+
          '</figure>'+
          '<div class="doctor-line"></div>'+
          '<figure>'+
          '<img class="center" src="img/icon_hand.png" alt="">'+
          '</figure>'+
          '<div class="doctor-line"></div>'+
          '<figure>'+
          '<img class="center" src="img/icon_tel.png" alt="">'+
          '</figure>'+
          '<div class="doctor-line"></div>'+
          '<figure>'+
          '<img class="center" src="img/icon_done.png" alt="">'+
          '</figure>'+
          '</div>'+
          '<div class="icon-text icon-text01 flex">'+
          '<p>上传资料<br>等待沟通</p><div></div>'+
          '<p>选择服务</p><div></div>'+
          '<p>等待邀约</p><div></div>'+
          '<p>完成服务</p>'+
          '</div>'+
          '<div class="serviceTip cbo">'+
          '<p class="serviceTipText dn">资料已上传，等待“医疗编辑”与患者取得联系</p>'+
          '<span class="serviceTip-btn go-get-doctor" >去找对医生</span>'+
          '<p class="service-doctor-wrap tc dn">'+
          '<img class="db service-doctor" src="img/doctor_head_03.jpg">'+
          '<span>刘强东</span>'+
          '</p>'+
          '<div class="service-doctorInfo dn">'+
          '<p>地点：<span class="service-doctor-location">北京市人民医院</span></p>'+
          '<p class="mb40">时间：<span class="service-doctor-time">7月15日下午3点</span></p>'+
          '<span class="go-check serviceCom">完成服务</span>'+
          '</div>'+
          '</div>'+
          '</div>'+
          '<!--找对体检-->'+
          '<div class="service-flow">'+
          '<h2 class="tit">找对体检服务流程</h2>'+
          '<div class="check-flow-icon flex">'+
          '<figure>'+
          '<img class="center" src="img/icon_upload.png" alt="">'+
          '</figure>'+
          '<div class="check-line"></div>'+
          '<figure>'+
          '<img class="center" src="img/icon_hand.png" alt="">'+
          '</figure>'+
          '<div class="check-line"></div>'+
          '<figure>'+
          '<img class="center" src="img/icon_done.png" alt="">'+
          '</figure>'+
          '</div>'+
          '<div class="icon-text icon-text02 flex">'+
          '<p>上传资料<br>等待沟通</p><div></div>'+
          '<p>选择服务</p><div></div>'+
          '<p>完成服务</p>'+
          '</div>'+
          '<div class="serviceTip cbo">'+
          '<p class="check-serviceTipText dn fl">患者资料已提交，开始进行体检服务</p>'+
          '<span class="go-check go-get-check" id="go-get-check">去找对体检</span>'+
          '</div>'+
          '</div>'+
          '</div>';
      $("#subscribe-box").append($subscribe);
      $("#family-member li").last().before($MemLi);
      $("#service-people").append($serviceli);
      $("#service-ul").append($servicelist);

    }
  });

  clickKnowledge();
  homeMemberClick();
}


/*家庭成员点击*/
function homeMemberClick(){
  var $headli = $("#family-member li"),
      oldindexsub = 0,
      $subscribe = $('#subscribe-box');
  $headli.each(function(i){
    this.flag = true;
    if(i === 0){this.flag = false;}
  });
  $headli.swipe({
    tap:function() {
      var $thisLi = $("#family-member .active").parent();
      var $this = this.find("em"),
          str = $this.next().text(),
          newindex = this.index();
      if($this.hasClass('add')){return window.location = 'html/add-member.html'}
      this.siblings().each(function(){
        this.flag = true;
      });
      if(this[0].flag){
        this[0].flag = false;
        $this.addClass('active').parents().siblings().find("em").removeClass('active');
        //推荐内容左右动画
        if($subscribe.children().size() !== 1){
          //console.log('newindex:'+newindex+',oldindexsub:'+oldindexsub);
          aniLeftRight($subscribe.children(),newindex,oldindexsub);
          $("#service-people li").eq(newindex).addClass('active').siblings().removeClass('active');
          aniLeftRight($('#service-ul').children(),newindex,oldindexsub);
        }
        oldindexsub = newindex;
        if(str === '我'){
          $('#service-obj').text('');
        }else{
          $('#service-obj').text(str);
        }
      }else if($thisLi.attr('data-uuid')){
        /*var   the_patientUuid = $thisLi.attr('data-uuid');
        console.log(the_patientUuid);*/
        var thisTitle = $(this).find("span").text();
        window.location = "html/father-info.html?thisrelationShip="+encodeURI(thisTitle)+"&patientUuid="+the_patientUuid;
      }else {
        window.location = "html/add-member.html"
      }


      //判断data-uuid
      if(this.attr('data-uuid')){
        the_patientUuid = this.attr('data-uuid');
        console.log(the_patientUuid);
        //获取家庭成员资料
        getHomeMemberDAta(the_patientUuid);
        console.log(peoplefAge);
      }

    }
  });
}

/*点击找对预防知识  点击分享 */
function clickKnowledge(){
  $(".subscribe-content").swipe({
    tap: function () {
      window.location = "html/help.html";
    }
  });

}




//基本资料表单验证
function addMemValidate(){
  var $name=$("#name");
  var $birth=$("#bron-year");
  var $province=$("#province");
  if($name.val()== ""||$birth.val()==0||$province.val()==0){
    $("#add-notice").text("请将信息填写完整");
    return false;
  }
  else{
    $("#add-notice").text("");
    return true;
  }
}

/*完善用户基本资料  ajax 传服务器*/
function getUSerData(){
  var data = {
    "name": $("#name").val(),
    "gender": $(".selected").attr("data-sex"),
    "birthDate": $("#bron-year").val()+"-01-01",
    "province": $("#province").val(),
    "city": $("#city").val()
  };
  $.ajax({
    type:"POST",
    url:"http://www.zhaoduiyisheng.com/api/User/ModifyProfile?sessionId="+window.localStorage.sessionId,
    contentType: "text/plain; charset=UTF-8",
    dataType:"json",
    data:JSON.stringify(data),
    success: function(data){
      if(data.code == 0){
        alert('个人资料成功');
        console.log(data.message);
      }else{
        console.log(data.message);
      }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "../login.html";
      }
    }

  })
}


/*修改家庭成员资料 ajax;*/
function modifyMemData(){
  var data = {
    "uuid":the_patientUuid,
    "name":$("#name").val(),
    "birthDate": $("#bron-year").val()+"-01-01",
    "province": $("#province").val(),
    "city": $("#city").val()
  };
console.log(data);
  $.ajax({
    type:"POST",
    url:"http://www.zhaoduiyisheng.com/api/Relation/ModifyPatient?sessionId="+window.localStorage.sessionId,
    contentType: "text/plain; charset=UTF-8",
    dataType:"json",
    data:JSON.stringify(data),
    success: function(data){
      if(data.code == 0){
        console.log('修改成员资料成功');
      }
    }
  });
}




var the_CaseUuid = null;

/*查询病例列表*/
function askCaseList(){
  $.ajax({
    type: "GET",
    url:"http://www.zhaoduiyisheng.com/api/Patient/CaseList?sessionId=" + window.localStorage.sessionId + "&patientUuid=" + the_patientUuid,
    contentType: "text/plain; charset=UTF-8",
    dataType: 'json',
    data: {"description": $("#description").val()},
    success: function (data) {
      if( data.code == 0){
        console.log("查询病例成功"+data.message);
        console.log(data);
        $.each(data.data,function(i){
          the_CaseUuid = data.data[i].uuid;
          console.log(the_CaseUuid);
        });
      }
    }
  });
}

/*创建病例 和修改病例*/

function getCreateCase(){
  // 大图返回；
  bigPicBack();

  var sendData = null;
  /*是否抽烟*/
  var smoke = 'off';

  $('#fire-checkbox>span').swipe({
    tap: function () {

      $(this).children().addClass('checked').end().siblings().children().removeClass('checked');
      smoke =  $(this).attr('data-smoke');
      if(smoke == "on"){
        $("#smokeAGE").css("display","block");
        $("#smokeNUM").css("display","block");

      }else {
        $("#smokeAGE").css("display","none");
        $("#smokeNUM").css("display","none");
        $("#smokeages").val('0');
        $("#smokenumber").val('0');
      }

    }
  });

  $("#find-doctor-footer").swipe({
    tap:function(){
      var smokeages = parseInt($("#smokeages").val()),
          smokenumber = parseInt($("#smokenumber").val());

     var sendData = {
        "patientUuid":the_patientUuid,
        "smoking":smoke,
        "smokingAge": smokeages,
        "smokingNum": smokenumber,
        "description":$("#description").val()
      };
      console.log(smokeages);
      console.log(smokenumber);

      if($("#find-doc-page .file-list").html()&&(smokeages==0||smokeages)&&(smokenumber==0||smokenumber)){
        $("#find-doc-notice").text('');
        $("#fire-tip").text('');

        /*这里判断是否有过病例。如果没有则创建，如果有，则修改病例*/

        /*创建过病例，修改病例*/
         if(the_CaseUuid){
           //getCaseDetail();
           sendData.caseUuid = the_CaseUuid;

            modifyCase(sendData);
        }else{
            newCase(sendData);
         }
      }else if(isNaN(smokeages)||isNaN(smokenumber)){
        $("#fire-tip").text('仅可输入数字。');
        $("#find-doc-notice").text('');
      }else {
        $("#fire-tip").text('');
        $("#find-doc-notice").text('请补充资料，以便为您匹配合适的医生。');
      }
    }
  });
}
//清空找对医生
function emptyFindDoc(){
  $("#description").val('');
  $("#fire-checkbox").find('i').removeClass('checked').eq(1).addClass('checked').parent().parent().siblings().hide();
  $(".file-list").eq(0).html('');
  $("#smokeages").val(0);
  $("#smokenumber").val(0);
  $(".up-page-smpic").eq(0).html('');
  $("#gallery-page1").find('ol li').last().siblings().remove();
  $('#find-doc-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
  $('#basic-info-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
}
/*未创建过病例，创建病例*/
function newCase(objData){
  $.ajax({
    type:"POST",
    url:"http://www.zhaoduiyisheng.com/api/Patient/AddCase?sessionId="+window.localStorage.sessionId,
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    data:JSON.stringify(objData),
    success: function(data){

      if(data.code == 0){
        myalert.run("病例上传成功",function(){
          emptyFindDoc();
        },function(){
          emptyFindDoc();
        });



        /*查询服务流程*/
        getServiceProcess();
      }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "login.html";
      }
    }
  });
}

/*修改病例*/
function modifyCase(objData){
  $.ajax({
    type:"POST",
    url:"http://www.zhaoduiyisheng.com/api/Patient/ModifyCase?sessionId="+window.localStorage.sessionId,
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    data:JSON.stringify(objData),
    success: function(data) {

      if( data.code == 0){
        myalert.run("病例上传成功",function(){
          emptyFindDoc();
        },function(){
          emptyFindDoc();
        });
        /*查询服务流程*/
        getServiceProcess();
      }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "login.html";
      }
    }
  });
}


/*查询服务流程*/

/*查询找对医生的服务流程*/
function  getServiceProcess(){

  $.ajax({
    type:'GET',
    url:'http://www.zhaoduiyisheng.com/api/Patient/ServiceProcess?sessionId='+window.localStorage.sessionId+"&patientUuid="+the_patientUuid,
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    success: function(data){
      console.log(data);
      if( data.code == 0){
        //console.log("查询服务流程"+data.data);
        var thepatientUUID = data.data.patientUuid;
        var theCaseUuid = data.data.caseUuid;
        //console.log("theCaseuuid"+theCaseUuid);
        //console.log(data.data.uploaded);
        var $this_MEM = $("#service-people li.active");
        var this_index = $this_MEM.index();
        //console.log(this_index);
        if(data.data.uploaded){
          $(".doc-flow-icon").eq(this_index).find("figure").eq(0).addClass('active').siblings().remove("active");
          $(".service-doctor-wrap").eq(this_index).css("display","none");
          $(".service-doctorInfo").eq(this_index).css("display","none");

          $(".serviceTipText").eq(this_index).css("display","block");
          $(".serviceTip-btn").eq(this_index).css("display","block");

          $(".serviceTipText").eq(this_index).text('资料已上传，等待“医疗编辑”与患者取得联系');

          $(".serviceTip-btn").eq(this_index).addClass('inServiceBtn').removeClass('go-get-doctor').text("补充资料");
        }
        if(data.data.selected){
          $(".doc-flow-icon").eq(this_index).find("figure").eq(1).addClass('active');

          $(".service-doctor-wrap").eq(this_index).css("display","none");
          $(".service-doctorInfo").eq(this_index).css("display","none");

          $(".serviceTipText").eq(this_index).css("display","block");
          $(".serviceTip-btn").eq(this_index).css("display","block");

          $(".serviceTip-btn").eq(this_index).addClass('inServiceBtn').removeClass('go-get-doctor');

          $(".serviceTipText").eq(this_index).text('根据“医疗编辑”配属的医师，请选择服务种类');

          $(".inServiceBtn").eq(this_index).text("选择服务");

          //跳转到选择服务页
          $(".inServiceBtn").swipe({
            tap: function(){
              console.log('去找医生');
              window.location = "html/select-service.html?selectPatientUuid="+thepatientUUID+"&selectCase="+theCaseUuid;
            }
          }).on('click',function(){
            window.location = "html/select-service.html?selectPatientUuid="+thepatientUUID+"&selectCase="+theCaseUuid
          });
        }
        if(data.data.appointed){
          $(".doc-flow-icon").eq(this_index).find("figure").eq(2).addClass('active');

          $(".serviceTip-btn").eq(this_index).css("display","none");
          $(".service-doctor-wrap").eq(this_index).css("display","none");
          $(".service-doctorInfo").eq(this_index).css("display","none");

          $(".serviceTipText").css("display","block");

          $(".serviceTipText").eq(this_index).text('“医疗编辑”正在紧张地为患者配属医师');

        }
        if(data.data.completed){
          $(".doc-flow-icon").eq(this_index).find("figure").eq(3).addClass('active');
          $(".serviceTipText").eq(this_index).css("display","none");
          $(".serviceTip-btn").eq(this_index).css("display","none");
          $(".service-doctor-wrap").eq(this_index).css("display","block");
          $(".service-doctorInfo").eq(this_index).css("display","block");
          $(".serviceCom").swipe({
            tap:function(){

              $(".index-footer .home").children().addClass('active').end().siblings().children().removeClass('active');
              $("#index-page>header>h1").html("健康家庭");
              $("#tabs-container").css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
            }
          })
        }
      }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "../login.html";
      }

    }

  })
}


/*体检的判断条件*/
function checkHealth(){
  var $iframe = $("#health-meal");
    if(peopleGender == 'male'){
    $("#check-sex").text('男性');
    if(peoplefAge>15&&peoplefAge<50){
      $iframe.attr('src','html/health-maleAmeal.html');
    }else {
      $iframe.attr('src','html/health-maleBmeal.html');
    }
  }else if(peopleGender == 'female'){
    $("#check-sex").text('女性');
    if(peoplefAge>15&&peoplefAge<50){
      $iframe.attr('src','html/health-femaleAmeal.html');
    }else  if(peoplefAge<80){
      $iframe.attr('src','html/health-femaleBmeal.html');
    }else {
      $iframe.attr('src','html/health-femaleCmeal.html');
    }
  }
  //设置iframe字体大小
  /*setTimeout(function(){
    $iframe[0].contentWindow.document.getElementsByTagName('html')[0].style.fontSize = document.getElementsByTagName('html')[0].style.fontSize;
  },100);*/
  /*价格自动分三位*/
  $("#check-health-price").text(formatPrice($("#check-health-price").text()));
}

/*体检弹窗提醒*/

function healthAlert(){
  $("#check-health-now").swipe({
    tap: function(){
      myalert.run('您所在的地区暂未开通体检服务，请继续关注。', function() {
       var mobileNum = getCookie('user');

      },function(){

      });
    }
  })
}


//基本资料页选择性别 男女
function addMemSubmit(){
  $("#select-sex").swipe({
    tap:function(e,target){
      if($(target).hasClass('label-man')){
        $(target).addClass('selected').next().removeClass('selected');
      }else if($(target).hasClass('label-woman')){
        $(target).addClass('selected');
        $(target).addClass('selected').prev().removeClass('selected');
      }
    }
  });

  /*称呼*/
  $("#call").on("change",function(){
    relationShip = $("#call").val();
  });

}

//服务选中框

function  chooseService(){
  $(".choose-item li").swipe({
    tap:function(){
      this.find("span").toggleClass("checked")
    }
  });
}

/*调用相册页*/
galleryPage();
/*上传病例资料*/
function uploadDataCase(file){
  var formData = new FormData();
  formData.append("attachment",file);
  $.ajax({
    type: "POST",
    url: "http://www.zhaoduiyisheng.com/api/Patient/Attachment/Upload?sessionId=" + window.localStorage.sessionId+"&caseType=doc&patientUuid="+the_patientUuid,
    contentType: false,
    dataType: 'json',
    data: formData,
    processData : false,
    success: function (data) {
      console.log(data);
        if(data.code == 0){
          console.log("上传资料"+data.message);
        }
      else {
          myalert.run("上传图片失败")
        }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "../login.html";
      }
    }
  })

}


/*大图页 返回*/
function bigPicBack(){


  $('#big-pic-page-back').swipe({
    tap:function(){
      $('#big-pic-page').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'})
    }
  });
}



/*查询病例详情*/
function getCaseDetail(){

  $.ajax({
    type:"GET",
    url:"http://www.zhaoduiyisheng.com/api/Patient/Case?sessionId="+window.localStorage.sessionId+"&caseUuid="+the_CaseUuid,
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    success: function(data){
      if(data.code == 0){
        console.log(data.data);
        $("#description").val(data.data.description);
      }
    },
    error:function(status){
      if(status.code == 401){
        alert("会话超时，请重新登录");
        window.location = "../login.html";
      }
    }
  })
}


/*相册页*/
function galleryPage(){
  //111111111上传图片按钮
  $('.up-page-btn').on('change', uploadPhoto);
  $('.gallery-page-btn').on('change', uploadPhoto);

//22222上传页图片点击//已完成
  $('.up-page-smpic').swipe({
    tap: function (e, t) {
      if (t.tagName === 'IMG') {
        $($(t).parent().parent().attr('data-to')).css({
          '-webkit-transform': 'translate3d(-100%,0,0)',
          'transform': 'translate3d(-100%,0,0)'
        });
      }
    }
  });
//33333相册页返回按钮点击//已完成
  $('.gallery-page .back').swipe({
    tap: function () {
      this.parent().parent().css({
        '-webkit-transform': 'translate3d(0,0,0)',
        'transform': 'translate3d(0,0,0)'
      }).find('footer').addClass('dn').end().find('p').addClass('dn').removeClass('checked').end().find('.add-more-li').removeClass('dn');
      $(".gallery-del-notice").text('');
    }
  });
//444444相册页管理项点击//已完成
  $('.manage-pic').swipe({
    tap: function () {


      var footer = this.parent().parent().children('footer');
      if (footer.hasClass('dn')) {
        footer.removeClass('dn');
        $(".gallery-del-notice").text('点选以删除图片，可多选');
        $('.gallery-page .add-more-li').addClass('dn');
        $('.gallery-page-smpic').find('p').each(function () {
          $(this).removeClass('dn');
        });
      } else {
        footer.addClass('dn');
        $(".gallery-del-notice").text('');
        $('.gallery-page .add-more-li').removeClass('dn');
        $('.gallery-page-smpic').find('p').each(function () {
          $(this).addClass('dn');
        });
      }
    }
  });
//55555相册页预览图点击//已完成
  $('.gallery-page .data-upload').swipe({
    tap: function (e, t) {
      if (t.tagName === 'IMG') {
        var src = '';
        if($(t).attr('data-file')){
          var img =new Image();
          src = "http://www.zhaoduiyisheng.com/api/Relation/Attachment/Download?sessionId=" + window.localStorage.sessionId+"&uuid="+$(t).attr('data-uuid')+"&filename="+$(t).attr('data-file');
          img.src = src;
        }else{
          src = $(t).attr('src');
        }
        console.log(src);
        $('#big-pic-box').css('background-image','url(' + src + ')');
        $('#big-pic-page').css({
          '-webkit-transform': 'translate3d(-100%,0,0)',
          'transform': 'translate3d(-100%,0,0)'
        });
      } else if (t.tagName === 'P') {
        $(t).toggleClass('checked');
      }
    }
  });
//66666删除按钮点击
  $('.del-pic').swipe({
    tap: function () {
      var galleryol = this.parent().find('ol'),
          upol = $('.up-page-smpic').eq(galleryol.attr('data-galleryid')),
          html = null;
      myalert.run('亲，确定要删除吗？', function () {
        galleryol.find('p.checked').each(function () {
          var p = $(this).parent(),
              i = p.index(),
              filelist = $('.file-list input');
          p.remove();
          filelist.eq(i).remove();
        });
        upol.html('');
        galleryol.children().each(function () {
          html = this.outerHTML;
          upol.prepend(html);
        });
      });
    }
  });
//文件改变函数
  function uploadPhoto(e) {
    var can = true,
        This = this.files[0];
    if (This.type.indexOf('image') === 0) {
      $('.file-list input').each(function () {
        if (This.name === this.files[0].name && This.size === this.files[0].size) {
          can = false;
          myalert.run('亲，这张照片传过了哦');
          return false;
        }
      });
      if (can) {
        $("#find-doc-notice").text('');
        /*上传病例资料*/
        uploadDataCase(This);
        var imgUrl = getObjectURL(This),
            theli = null,
            upol = null,
            galleryol = null,
            html = null;
        //如果是上传页的上传按钮
        if ($(this).hasClass('up-page-btn')) {
          upol = $(this).parent().parent().prev();
          galleryol = $(upol.attr('data-to')).find('ol');
          theli = galleryol.find('.add-more-li');
          $(this).removeClass().off('change').parent().append('<input class="up-page-btn" type="file">');
          $(this).parent().find('.up-page-btn').on('change', uploadPhoto);
          $(this).parent().next().append($(this).hide());
          //如果是相册页的上传按钮
        } else if ($(this).hasClass('gallery-page-btn')) {
          theli = $(this).parent();
          galleryol = theli.parent();
          $(this).removeClass().off('change').parent().append('<input class="gallery-page-btn" type="file">');
          $(this).parent().find('.gallery-page-btn').on('change', uploadPhoto);
          upol = $('.up-page-smpic').eq($(this).parent().parent().attr('data-galleryid'));
          upol.next().children().last().append($(this).hide());
        }
        theli.before('<li><img src=' + imgUrl + '><p class="dn"></p></li>');
        //两边同步
        upol.html('');
        galleryol.children().each(function () {
          html = this.outerHTML;
          upol.prepend(html);
        });
      }
    } else {
      myalert.run('请上传图片');
    }
  }

//获取图片地址
  function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }
}

//设置member-wrap高度

function setMemberWrapHeight(){
  setHeight();
  window.addEventListener('resize',function(){
    setHeight();
    overflowWidth('#service-people');
  });
  //左右滑动
  //$('.member-wrap').swipe( {
  //  swipeStatus:function(e, phase, direction, distance) {
  //    if(direction === 'left'){
  //      this.scrollLeft(this.scrollLeft()+distance);
  //    }else if(direction === 'right'){
  //      this.scrollLeft(this.scrollLeft()-distance);
  //    }
  //  },
  //  threshold:30
  //});
}

/*tab 切换*/
function tabTurn(){
  $(".index-footer .home").swipe({
    tap:function(){
      this.children().addClass('active').end().siblings().children().removeClass('active');
      $("#index-page>header>h1").html("健康家庭");
      $("#tabs-container").css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});

    }
  });
  $(".index-footer .service").swipe({
    tap:function(){
      this.children().addClass('active').end().siblings().children().removeClass('active');
      $("#index-page>header>h1").html("服务流程");
      $("#tabs-container").css({'-webkit-transform':'translate3d(-50%,0,0)','transform':'translate3d(-50%,0,0)'});

      // 执行查询病例服务流程;
     getServiceProcess();
    }
  });
}



/*获取省列表*/
function  getProvince(){

  $.ajax({
    type:'GET',
    url:'http://www.zhaoduiyisheng.com/api/Platform/RegionList?type=province',
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    //data:"regionId=0",
    success: function(data){
      if(data.code == 0){
        var data = JSON.stringify(data);
        window.localStorage.province = data;
        createProvince(data);
      }
    }
  })
}


/*获取城市列表*/
function  getCity($cityIndex){
  $.ajax({
    type:"GET",
    url:"http://www.zhaoduiyisheng.com/api/Platform/RegionList?regionId="+$cityIndex,
    contentType: "text/plain; charset=UTF-8",
    dataType:'json',
    success: function(data){

      if( data.code == 0){

        var data = JSON.stringify(data);
        window.localStorage["city"+$cityIndex] = data;
        createCity(data);

      }
    }
  })
}

/*创建省市列表*/
function createProvince(data){
  data = JSON.parse(data);
  var $province = $("#province");
  $.each(data.data,function(i){
    var $option = $('<option value='+data.data[i].id+'>'+data.data[i].name+'</option>');
    $province.append($option);
  });
  $province.on("change",function(){
    var $cityIndex = $(this).val();
    if(window.localStorage.city){
      createCity(window.localStorage.city)
    }else {
      getCity($cityIndex);
    }
  });
}

/*创建城市列表*/
function  createCity(data){
  data = JSON.parse(data);
  var $city = $("#city");
  $city.html(" ");
  $.each(data.data,function(i){
    var $optionCity = $("<option value=" + data.data[i].id + ">" + data.data[i].name + "</option>");
    $city.append($optionCity);
  });
}


/*cookie*/
function setCookie(name,value,oDay){
  var oTime=new Date();
  var oDate=oTime.getDate();
  oTime.setDate(oDate+oDay);
  document.cookie=name+'='+value+';expires='+oTime;

}

function getCookie(name){
  var str=document.cookie.split('; ');

  for(i=0;i<str.length;i++){
    arr=str[i];
    arr1=arr.split('=');
    if(arr1[0]==name)
      return arr1[1];

  }

  return '';

}
function removeCookie(name){

  setCookie(name,'00',-1);

}

/*价格自动 分三位*/
function formatPrice(s){
  if(/[^0-9\.]/.test(s)) return "invalid value";
  s=s.replace(/^(\d*)$/,"$1.");
  s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
  s=s.replace(".",",");
  var re=/(\d)(\d{3},)/;
  while(re.test(s))
    s=s.replace(re,"$1,$2");
  s=s.replace(/,(\d\d)$/,".$1");
  return "￥" + s.replace(/^\./,"0.")
}

function decrypt(s)
{
  var fnl = "", code = 0;
  for(var i = 0; i < s.length >> 1; i++){
    code = new Number("0x" + s.substr(i * 2, 2));
    fnl += String.fromCharCode((code ^ (seed << 7 - i % 8 | seed >> i % 8 | 0x80)) & 0x7f);
  }
  return fnl;
}

//分享按钮
function atricleShare(){
  $("#btn-cancel-share").swipe({
    tap: function (event) {
      event.stopPropagation();
      $("#share-list").addClass("dn");
    }
  });

}

