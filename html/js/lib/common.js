var timer;
function showError(msg) {
    $('#error .err-txt').html(msg);
    $('#error').fadeIn('fast');

    clearTimeout(timer);
    timer = setTimeout(function() {
        //$('#error').hide()
        $('#error').fadeOut('slow');
    }, 1500);
}
function showInfo(msg) {
    $('#info .info-txt').html(msg);
    $('#info').fadeIn('fast');

    clearTimeout(timer);
    timer = setTimeout(function() {
        $('#info').fadeOut('slow');
    }, 1500);
}

// 设置总金额
function setProductTotalPrice() {
    ajaxHttpRequest('cart/v1/price/total', {
        jsonpCallback: 'totalPrice',
        success: function (data, status) {
            if (status == "success") {
                if (data.meta.success) {
                    $(".total-price").children("strong").text(parseFloat(data.data).toFixed(1));
                    var $totalPrice = $(".total-price").children("strong").text();
                    if($totalPrice!="" && $totalPrice!="0" && $totalPrice!="0.0") {
                        $(".total-price").show();
                    }else {
                        $(".total-price").hide();
                    }
                }
            }
        }
    });
}