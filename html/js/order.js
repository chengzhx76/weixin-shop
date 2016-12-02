var page = 1;
$(function () {
    var $totalPrice = $(".total-price").children("strong").text();
    if($totalPrice!="" && $totalPrice!="0") {
        $(".total-price").show();
    }else {
        $(".total-price").hide();
    }

    $/*('#net-loading').show();
    ajaxHttpRequest('order/v1/orders', {
        jsonpCallback: 'handler',
        success: function (data, status) {
            if (status != "success") {
                showError("请求出现异常！");
                $('#net-loading').hide();
                return;
            }
            $('#net-loading').hide();
        },
        error: function (errorType, error) {
            showError("ERROR--请求出现异常！");
            $('#net-loading').hide();
        }
    });*/

    $('.weui_panel').dropload({
        scrollArea: window,
        autoLoad: true,
        domUp: {
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh"><i class="icon icon-12 xz180"></i>上拉加载更多</div>',
            domUpdate: '<div class="dropload-load f15"><i class="icon icon-12"></i>释放更新...</div>',
            domLoad: '<div class="dropload-load f15"><span class="weui-loading"></span>正在加载中...</div>'
        },
        loadDownFn: function (me) {
            ajaxHttpRequest('order/v1/orders', {
                jsonpCallback: 'callback',
                data :{
                    pageNum: page,
                    pageSize: 10
                },
                success: function (data, status) {
                    $('#net-loading').hide();
                    if (status != "success") {
                        showError("请求出现异常！");
                        $('#net-loading').hide();
                        return;
                    }
                    if (!data.meta.success) {
                        showError(data.meta.msg);
                        $('#net-loading').hide();
                        return;
                    }
                    page++;
                    var main = template('main-temp', data);
                    $('.main-wrap').append(main);
                    me.resetload();
                    if (!data.data.hasNextPage) {
                        me.lock();
                        me.noData();
                    }
                },
                error: function (errorType, error) {
                    showError("ERROR--请求出现异常！");
                    $('#net-loading').hide();
                    me.resetload();
                }
            });
        }
    });
});

function handler(data) {
    console.log(data);
}

/*
function handler(data) {
/!*    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }*!/
    /!*var main = template('main-temp', data);
    $('.main-wrap').html(main);*!/

/!*
    console.log(data.data);
    page++;
    var main = template('main-temp', data);
    $('.weui_panel_bd').append(main);
    me.resetload();
    if (!data.data.hasNextPage) {
        me.lock();
        me.noData();
    }
*!/

}*/
