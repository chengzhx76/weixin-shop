/*
$(function() {
    var counter = 0;
    // 每页展示4个
    var num = 10;
    var pageStart = 0, pageEnd = 0;
    var page = 1;

    $('.weui_panel').dropload({
        scrollArea: window,
        autoLoad: true,
        domUp: {//下拉
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh"><i class="icon icon-12 xz180"></i>上拉加载更多</div>',
            domUpdate: '<div class="dropload-load f15"><i class="icon icon-12"></i>释放更新...</div>',
            domLoad: '<div class="dropload-load f15"><span class="weui-loading"></span>正在加载中...</div>'
        },
        loadDownFn: function (me) {
            console.log("jiazai===========");
            ajaxHttpRequest('order/v1/orders', {
                data :{
                    page: page
                },
                success: function (data, status) {
                    if (status != "success") {
                        console.log("Fail");
                        return;
                    }


                    console.log(data);


                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();



                    var main = template('main-temp', data);
                    $('.weui_panel_bd').html(main);









                    me.resetload();
                },
                error: function (errorType, error) {
                    me.resetload();
                }
            });
        }
    });
});*/
$(function () {
    var counter = 0;
    var num = 10;
    var pageStart = 0, pageEnd = 0;
    var page = 1;
    $('.weui_panel').dropload({
        scrollArea: window,
        autoLoad: true,
        domUp: {//下拉
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh"><i class="icon icon-12 xz180"></i>上拉加载更多</div>',
            domUpdate: '<div class="dropload-load f15"><i class="icon icon-12"></i>释放更新...</div>',
            domLoad: '<div class="dropload-load f15"><span class="weui-loading"></span>正在加载中...</div>'
        },
        loadDownFn: function (me) {
            console.log("===========>加载更多");
            ajaxHttpRequest('order/v1/orders', {
                jsonpCallback: 'callback',
                data :{
                    pageNum: page,
                    pageSize: 10
                },
                success: function (data, status) {
                    if (status != "success") {
                        console.log("Fail");
                        return;
                    }
                    console.log(data);


                },
                error: function (errorType, error) {
                    me.resetload();
                }
            });


            /*$.ajax({
                type: 'GET',
                url: 'more.json',
                dataType: 'json',
                data: {page: page},
                success: function (data) {
                    console.log(data);
                    var result = '';
                    counter++;
                    pageEnd = num * counter;
                    pageStart = pageEnd - num;
                    page++;
                    for (var i = pageStart; i < pageEnd; i++) {
                        result += '<div class="weui_media_box weui_media_text weui-updown"><p class="weui_media_desc">' + data.lists[i].link + data.lists[i].title + '</p></div>';
                        if ((i + 1) >= data.lists.length) {
                            me.lock();
                            me.noData();
                            break;
                        }
                    }
                    setTimeout(function () {
                        $('.weui_panel_bd').append(result);
                        me.resetload();
                    }, 1000);
                },
                error: function (xhr, type) {
                    alert('Ajax error!');
                    me.resetload();
                }
            });*/
        }
    });
});