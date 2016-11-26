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
    }, 1800);
}

function goLogin() {
    showInfo("您还未登陆，请先登录！");
    window.location.href="login.html";
}

// 设置总金额
function setProductTotalPrice() {
    ajaxHttpRequest('v1/token', {
        jsonpCallback: 'checkToke',
        success: function (data, status) {
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
            if (!data.data) {
                /*ar totalPrice = 0;
                totalPrice = getLocVal("totalPrice");
                if (totalPrice!="" && !isNaN(totalPrice)) {
                    totalPrice = parseFloat(totalPrice);
                } else if (totalPrice == "") {
                    totalPrice = 0;
                }
                var localData = {
                    data : totalPrice
                };
                setTotalPrice(localData);*/
                console.log("没有登陆！");
                setTotalPrice("0.0");
            } else {
                ajaxHttpRequest('cart/v1/price/total', {
                    jsonpCallback: 'totalPrice',
                    success: function (data, status) {
                        if (status == "success") {
                            if (data.meta.success) {
                                setTotalPrice(data.data);
                            }
                        }
                    }
                });
            }
        },
        error: function (errorType, error) {
            showError("ERROR--请求出现异常");
            $('#net-loading').hide();
        }
    });
}

function setTotalPrice(data) {
    $(".total-price").children("strong").text(parseFloat(data).toFixed(1));
    var totalPrice = $(".total-price").children("strong").text();
    if(totalPrice!="" && totalPrice!="0" && totalPrice!="0.0") {
        $(".total-price").show();
    }else {
        $(".total-price").hide();
    }
}