

/*获取省列表*/
function  getProvince(province){
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
                createProvince(data,province);
            }
        }
    })
}
/*获取城市列表*/
function  getCity($cityIndex,city){
    $.ajax({
        type:"GET",
        url:"http://www.zhaoduiyisheng.com/api/Platform/RegionList?&regionId="+$cityIndex,
        contentType: "text/plain; charset=UTF-8",
        dataType:'json',
        success: function(data){

            if( data.code == 0){

                var data = JSON.stringify(data);
                window.localStorage["city"+$cityIndex] = data;
                createCity(data,city);

            }
        }
    })
}

/*创建省市列表*/
function createProvince(data,province){
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
    if(province){
        $province.val(province);
    }
}

/*创建城市列表*/
function  createCity(data,city){
    data = JSON.parse(data);
    var $city = $("#city");
    $city.html("");
    $.each(data.data,function(i){
        var $optionCity = $("<option value=" + data.data[i].id + ">" + data.data[i].name + "</option>");
        $city.append($optionCity);
    });
    if(city){
        $city.val(city);
    }
}