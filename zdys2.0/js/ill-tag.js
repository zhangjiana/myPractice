/*
 * @Author: starry
 * @Date:   2016-01-07 21:22:32
 * @Last Modified by:   starry
 * @Last Modified time: 2016-01-13 16:42:07
 */
$(function() {
    var searchBox = $('#search-box'),
        keyWord = $('#key-word'),
        clearKey = $('#clear-key'),
        theIllTag = $('#the-ill-tag'),
        resultScroll = $('#result-scroll'),
        searchResult = $('#search-result'),
        sure = $('#sure'),
        illListPage = $('#ill-list-page'),
        titIllList = $('#tit-ill-list'),
        illList = $('#ill-list'),
        nomsg = $('<div id="no-msg" class="no-msg pr">' +
            '<div class="centerX tc">' +
            '<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/cloud.png" alt="">' +
            '<p class="c-99">您还没有添加疾病标签</p>' +
            '</div>' +
            '</div>');
    // 先获取所有一级标签数据
    function getTag1() {
        if (window.localStorage.illTag) {
            createIllTag1(window.localStorage.illTag);
        } else {
            $.ajax({
                type: "GET",
                url: "http://www-test.zhaoduiyisheng.com/api//Platform/LevelTagList?level=2",
                contentType: "text/plain; charset=UTF-8",
                dataType: 'json',
                success: function(data) {
                    if (data.code === 0) {
                        var data = JSON.stringify(data.data);
                        window.localStorage.illTag = data;
                        createIllTag1(data);
                    }
                },
                error:function(res){
                    if(res.status == 401){
                        myalert.tips({
                            txt:"会话超时，请重新登录",
                            fnok:function(){
                                window.location = "../html/newLogin.html";
                            },
                            btn:1
                        });

                    }
                }
            });
        }
    }
    getTag1();
    // 创建一级标签
    function createIllTag1(data) {
        var data = JSON.parse(data),
            str = '',
            i = 0,
            len = data.length;
        for (; i < len; i++) {
            str += '<li data-id="' + data[i].id + '" class="bcc-b dn">' + data[i].name + '</li>';
        }
        searchResult.append(str);
    }
    // 输入框搜索
    keyWord.on('input', runSearch);
    keyWord.on('propertychange', runSearch);

    function runSearch() {
        var str = $(this).val(),
            ali = searchResult.children(),
            len = ali.length,
            i = 0;
        if (str) {
            clearKey.removeClass('dn');
            searchBox.addClass('bgccc');
            resultScroll.removeClass('dn');
            ali.addClass('dn');
            sure.addClass('dn');
            for (i = 0; i < len; i++) {
                if (ali.eq(i).text().indexOf(str) !== -1) {
                    ali.eq(i).removeClass('dn');
                }
            }
            var resultBox = new IScroll('#result-scroll', {
                scrollX: false,
                scrollY: true,
                checkDOMChanges: true
            });
        } else {
            init();
        }
    }
    // 点击搜索结果
    searchResult.swipe({
        tap: function(e, t) {
            if (t.tagName === 'LI') {
                titIllList.text($(t).text());
                getTag2($(t).data('id'));
            }
        }
    });
    //获取二级标签数据
    function getTag2(id) {
        if (window.sessionStorage['illTag' + id]) {
            createIllTag2(window.sessionStorage['illTag' + id]);
        } else {
            $.ajax({
                type: "GET",
                url: "http://www-test.zhaoduiyisheng.com/api//Platform/ChildTagList?tagId=" + id,
                contentType: "text/plain; charset=UTF-8",
                dataType: 'json',
                success: function(data) {
                    if (data.code === 0) {
                        var data = JSON.stringify(data.data);
                        window.sessionStorage['illTag' + id] = data;
                        createIllTag2(data);
                    }
                },
                error:function(res){
                    if(res.status == 401){
                        myalert.tips({
                            txt:"会话超时，请重新登录",
                            fnok:function(){
                                window.location = "../html/newLogin.html";
                            },
                            btn:1
                        });

                    }
                }
            });
        }
    }
    //创建二级标签
    function createIllTag2(data) {
        var data = JSON.parse(data),
            str = '',
            i = 0,
            len = data.length;
        for (; i < len; i++) {
            str += '<li data-id="' + data[i].id + '" class="bcc-b">' + data[i].name + '</li>';
        }
        keyWord.blur();
        illList.empty().append(str);
        illListPage.removeClass('dn');
        var listBox = new IScroll('#list-scroll', {
            scrollX: false,
            scrollY: true,
            checkDOMChanges: true
        });
    }
    // 返回按钮
    $('#back').swipe({
        tap: function() {
            window.history.back();
        }
    });
    $('#off-ill-list-page').swipe({
        tap: function() {
            illListPage.addClass('dn');
        }
    });
    // 点击输入框X号清空内容
    clearKey.swipe({
        tap: function() {
            init();
        }
    });
    // 选择二级标签
    illList.swipe({
        tap: function(e, t) {
            var ali = theIllTag.children(),
                len = ali.length,
                i = 0;
            if (t.tagName === 'LI') {
                // 判断是否重复
                for (; i < len; i++) {
                    if ($(t).data('id') === ali.eq(i).data('id')) {
                        myalert.tips({txt:'此标签已选',btn:1});
                        return false;
                    }
                }
                // 数量限制
                if (len === 3) {
                    $("#search-box").addClass('dn');
                }
                $('#no-msg').remove();
                theIllTag.append('<li class="tag-gray" data-id=' + $(t).data('id') + '>' + $(t).text() + '<span class="icon fr icon-del-red"></span></li>');
                init();
            }
        }
    });
    // 删除标签
    theIllTag.swipe({
        tap: function(e, t) {
            if ($(t).hasClass('icon-del-red')) {
                $(t).parent().remove();
                $("#search-box").removeClass('dn');
            }
        }
    });
    // 初始化
    function init() {
        illListPage.addClass('dn');
        searchBox.removeClass('bgccc');
        resultScroll.addClass('dn');
        keyWord.val('');
        sure.removeClass('dn');
        clearKey.addClass('dn');
    }
});
$(function () {

    $("#sure").swipe({
        tap: function(){
            addTag();
        }
    });

    if(GetQueryString('patientUuid')){
        $("#no-msg").addClass('dn');
        getHomeMemberDAta(GetQueryString('patientUuid'));
    }else {
        $("#no-msg").removeClass('dn');
    }

});



/*获取标签*/
function getHomeMemberDAta(objUuid) {
    $.ajax({
        type: 'GET',
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/PatientProfile?sessionId=" + window.localStorage.sessionId + "&uuid=" + objUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                console.log(data.data.tagList.length);
                if(data.data.tagList.length){
                    if(4 === data.data.tagList.length){
                        $("#search-box").addClass('dn');
                    }
                    for( var j = 0 ;j< data.data.tagList.length; j++){
                        var $li = $('<li class="tag-gray" data-id="'+data.data.tagList[j].id+'">'+data.data.tagList[j].name+'<span class="icon fr icon-del-red"></span></li>');
                        $("#the-ill-tag").append($li);
                    }
                }else {
                    $("#the-ill-tag").append('<div id="no-msg" class="no-msg pr">'+
                        '<div class="centerX tc">'+
                        '<img src="http://imgcdn.zhaoduiyisheng.com/img/icon/cloud.png" alt="">'+
                        '<p class="c-99">您还没有添加疾病标签</p>'+
                        '</div>'+
                        '</div>');
                }
            }
        },
        error:function(res){
            if(res.status == 401){
                myalert.tips({
                    txt:"会话超时，请重新登录",
                    fnok:function(){
                        window.location = "../html/newLogin.html";
                    },
                    btn:1
                });

            }
        }
    });
}


/*添加标签*/
function addTag(){
    var patientUuid = GetQueryString('patientUuid');

   var tags = getIllTag($("#the-ill-tag li"));
    $.ajax({
        type: "POST",
        url: "http://www-test.zhaoduiyisheng.com/api/Relation/ModifyTags?sessionId="+window.localStorage.sessionId+"&uuid="+patientUuid,
        contentType: "text/plain; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify(tags),
        success: function (data) {
            if(data.code == 0){
                console.log(data.message);
                 window.location = '/html/newFamily.html';
            }
        },
        error:function(res){
            if(res.status == 401){
                myalert.tips({
                    txt:"会话超时，请重新登录",
                    fnok:function(){
                        window.location = "../html/newLogin.html";
                    },
                    btn:1
                });

            }
        }
    });
}

function getIllTag(obj){

    var illTag = [];
    for ( var j= 0 ;j< obj.size(); j++){
        illTag.push(parseInt(obj[j].getAttribute('data-id')).toString());
    }
    return illTag;
}
