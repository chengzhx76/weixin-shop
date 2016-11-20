$(function(){
    var userToken = getLocVal('userToken');
    // 去server验证token是否过期

    $('#net-loading').show();
    ajaxHttpRequest('user/v1/detail', {
        jsonpCallback: 'headerHandler',
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
    });

});

function headerHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var header = template('header-temp', data);
    $('.header-wrap').html(header);

    var point = template('point-temp', data);
    $('.point-wrap').html(point);

    setProductTotalPrice();
}

function setProductTotalPrice() {
    ajaxHttpRequest('cart/v1/price/total', {
        jsonpCallback: 'totalPrice',
        success: function (data, status) {
            if (status == "success" && data.meta.success) {
                $(".total-price").children("strong").text(parseFloat(data.data).toFixed(1));
                var $totalPrice = $(".total-price").children("strong").text();
                if($totalPrice!="" && $totalPrice!="0" && $totalPrice!="0.0") {
                    $(".total-price").show();
                }else {
                    $(".total-price").hide();
                }
            }
        }
    });
}