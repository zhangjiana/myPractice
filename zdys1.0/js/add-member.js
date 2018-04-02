/**
 * Created by yxf on 2015/12/8.
 */

var relationShip = null;
$(function(){
    addMemSubmit();


if(window.localStorage.province){
    createProvince(window.localStorage.province);
}else {
    getProvince();
}
$("#call").on("change",function(){
    relationShip = $("#call").val();
    console.log(relationShip);
})
});
//提交添加成员表单
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
    var $btnAddMem=$("#btn-add-member");
    $btnAddMem.swipe({
        tap:function(){
            if(addMemValidate()){
                getAddNumber();

            }
        }
    })
}
//验证添加成员表单
function addMemValidate(){
    var $name=$("#call");
    var $birth=$("#bron-year");
    var $province=$("#province");
    if($name.val()==0||$birth.val()==0||$province.val()==0){
        $("#add-notice").text("请将信息填写完整");
        return false;
    }
    else{
        $("#add-notice").text("");
        return true;
    }
}


/*添加家庭成员 ajax;*/
function getAddNumber(){
    var data = {
        "relationship": relationShip,
        "name":$("#name").val(),
        "gender": $(".selected").attr("data-sex"),
        "birthDate": $("#bron-year").val()+"-01-01",
        "province": $("#province").val(),
        "city": $("#city").val()
    };

    $.ajax({
        type:"POST",
        url:"http://www.zhaoduiyisheng.com/api/Relation/AddPatient?sessionId="+window.localStorage.sessionId,
        contentType: "text/plain; charset=UTF-8",
        dataType:"json",
        data:JSON.stringify(data),
        success: function(data){
            console.log(data);

            if(data.code == 0){
                window.location = "../index.html";
            }
        }
    })
}




/*获取省列表*/
function  getProvince(){

    $.ajax({
        type:'GET',
        url:'http://www.zhaoduiyisheng.com/api/Platform/RegionList?&type=province',
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
        url:"http://www.zhaoduiyisheng.com/api/Platform/RegionList?&regionId="+$cityIndex,
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
