var page = 1;
$(function () {
    setProductTotalPrice();
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
        domDown : {//下拉
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh f15 "><i class="icon icon-12 xz180"></i>下拉加载更多</div>',
            domLoad    : '<div class="dropload-load f15"><span class="weui-loading"></span>正在加载中...</div>',
            domNoData  : '<div class="dropload-noData">没有更多数据了</div>'
        },
        loadDownFn: function (me) {
            ajaxHttpRequest('order/v1/orders', {
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
                    if (!data.data.hasNextPage) {
                        me.lock();
                        me.noData();
                    }
                    page++;
                    var main = template('main-temp', data);
                    $('.main-wrap').append(main);
                    me.resetload();
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