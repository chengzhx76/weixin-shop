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
            /*ajaxHttpRequest('order/v1/orders', {
                jsonpCallback: 'callback',
                data :{
                    pageNum: page,
                    pageSize: 10
                },
                success: function (data, status) {
                    console.log(data);
                },
                error: function (errorType, error) {
                    console.log("eeeeeeeeeee");
                }
            });

            $.ajax({
                type: 'get',
                async: false,
                url: 'http://localhost/moblie/order/v1/orders',
                data: {
                    pageNum: page,
                    pageSize: 10
                },
                contentType: 'application/json',
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'callback',
                success: function(data, status) {
                    console.log(data);
                },
                error: function(errorType, error) {
                    console.log(error);
                }
            });
             */
            $.ajax({
                type: 'GET',
                url: 'http://localhost/moblie/order/v1/orders',
                dataType: 'jsonp',
                data: {
                    pageNum: page,
                    pageSize: 10
                },
                success: function (data) {
                    console.log(data.data);
                    console.log("=============");
                    var result = '';
                    //counter++;
                    //pageEnd = num * counter;
                    //pageStart = pageEnd - num;
                    page++;
                    //for (var i = pageStart; i < pageEnd; i++) {
                        for (var i=0; i<data.data.list.length; i++) {
                            result += '<div class="weui_media_box weui_media_text weui-updown">' + data.data.list[i] + '</div>';
                            console.log("tttttttttt");
                            if (data.data.total >= data.data.list.length) {
                                console.log("------");
                                //me.lock();
                                //me.noData();
                                //break;
                            }
                        }

                    //}
                    setTimeout(function () {
                        $('.weui_panel_bd').append(result);
                        me.resetload();
                    }, 1000);

                    console.log(page);
                },
                error: function (xhr, type) {
                    alert('Ajax error!');
                    me.resetload();
                }
            });
        }
    });
});