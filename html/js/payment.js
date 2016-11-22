const PATAM = "param";

var addrId = "", since = false;
var timeId = "", payId = "", ticketId = "", balance = false, remark = "", amount = "";
var locParam = {}, param = {};
$(function() {
    try {
        addrId = getQueryparam("addrId");
        since = getQueryparam("since") == "true";
        ticketId = getQueryparam("couponId");
        //amount = getQueryparam("amount");
        locParam = JSON.parse(decodeURIComponent(getLocVal(PATAM)));
        clearLocVal(PATAM);
        addrId = addrId == "" ? locParam.addrId : "";
        since = locParam.since == undefined ? since : locParam.since;
    }catch(e) {
        console.error(e);
    }

    if (addrId) {
        param = {
            addrId: addrId,
            since: since
        };
    }
    if (ticketId) {
        param.ticketId = ticketId,
        locParam.ticketId = ticketId
    }else if (locParam.ticketId) {
        param.ticketId = locParam.ticketId
    }
    $('#net-loading').show();
    ajaxHttpRequest('order/v1/payment', {
        jsonpCallback: 'handler',
        data: param,
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

function handler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }

    $.each(locParam, function(key, val) {
        if (key != "addrId" && key != "since") {
            data.data[key] = val;
        }
    });
    var main = template('main-temp', data);
    $('.main-wrap').html(main);

    if (locParam.timeId) {
        $.each(data.data.deliveryTimes, function(key, val) {
            if (val.value == locParam.timeId) {
                $('.weui_input').val(val.title);
                timeId = val.value;
            }
        });
    }

    if (data.data.payId) {
        $("#pay input[type='radio']").each(function(index, element) {
            if ($(element).attr("data-id")==data.data.payId) {
                $(element).prop('checked', true);
                if ($(element).parents(".weui_cells").hasClass("recommend")) {
                    $(".more-pay").hide();
                }
            }
        });
    }else {
        $(".more-pay").hide();
        $("#pay .recommend input[type='radio']").prop('checked', true);
    }

    if (data.data.balance) {
        $("#money input[type='checkbox']").prop('checked', true);
        balanceOffset(data.data.availableBalance, data.data.totalPrice, data, data.data.balance);
    }

    $("#select-data").select({
        title: "送货时间",
        items: data.data.deliveryTimes,
        onChange: function (d) {
            $('.weui_input').val(d.titles);
            timeId = d.values;
            //$.alert("你选择了" + d.values + d.titles);
        }
    });

    $("#buy").click(function () {
        if (!timeId) {
            $.alert("请填写送货时间");
            return;
        }
        var param = getParam(data);
        console.log(param);
        //return;
        $('#order-loading').show();
        ajaxHttpRequest('order/v1/buy', {
            data: param,
            success: function (data, status) {
                if (status != "success") {
                    showError("请求出现异常！");
                    $('#order-loading').hide();
                    return;
                }
                if (!data.meta.success) {
                    showError(data.meta.msg);
                    $('#order-loading').hide();
                    return;
                }
                $('#order-loading .txt').text("订单生成成功");
                $('#order-loading').show().fadeOut(1500);

                if (data.data.pay) {
                    $.modal({
                        text: "还需支付"+data.data.surplusAmount+"元",
                        buttons: [
                            {text: "取消", onClick: function() {
                                window.location.href="order.html";
                            }},
                            {text: "支付", onClick: function() {
                                // TODO 这里应该调用后台接口 更新为支付成功
                                $.toast(data.data.payName+"支付成功");
                                buySuccess(data);
                            }}
                        ]
                    });
                    /*$.confirm(
                        "还需支付"+data.data.surplusAmount+"元",
                        function () {
                            $.toast(data.data.payName+"支付成功");
                            buySuccess(data);
                        }, function () {
                            window.location.href="order.html";
                        }
                    );*/
                } else {
                    buySuccess(data);
                }
            },
            error: function (errorType, error) {
                showError("ERROR--请求出现异常！");
                $('#net-loading').hide();
            }
        });
    });

    $(".weui_textarea").on("input paste" , function(){
        var num_left=60-$(this).val().length;
        if(num_left<0){
            $("#textarea_num").text("超过"+(-num_left)+"字");
            $("#textarea_num").css("color","#E44443");
        }else{
            $("#textarea_num").text("剩余"+(num_left)+"字");
            $("#textarea_num").css("color","#999999");
        }
    });

    $("#more").click(function(){
        $(".more-pay").fadeToggle('fast');
        var isHas = $(this).hasClass('more');
        if (isHas) {
            $(this).removeClass('more');
        } else {
            $(this).addClass('more');
        }
    });

    $("#product-list").click(function () {
        setLocVal(PATAM, encodeURIComponent(JSON.stringify(getParam(data))));
        return true;
    });

    $("#ticket").click(function () {
        setLocVal(PATAM, encodeURIComponent(JSON.stringify(getParam(data))));
        return true;
    });

    $('#back').click(function(){
        $.modal({
            text: "你真的不要下单尝尝吗？",
            buttons: [
                { text: "我在想想", onClick: function(){}},
                { text: "不再考虑了", onClick: function(){
                    window.location.href="shopcart.html";
                }},
            ]
        });
    });

    $("#money input[type='checkbox']").click(function() {
        var isPick = $("#money input[type='checkbox']").prop('checked');
        balanceOffset(data.data.availableBalance, data.data.totalPrice, isPick);
    });

}

function getParam(data) {
    addrId = data.data.addrId;
    since = data.data.since;
    //amount = data.data.amount;
    payId = $("#pay input[type='radio']:checked").attr("data-id");
    balance = $("#money input[type='checkbox']").prop('checked');
    ticketId = $("#ticket .msg").attr("data-id");
    remark = $("#remark").val();
    var param = {
        addrId: addrId,
        since: since,
        timeId: timeId,
        payId: payId,
        ticketId: ticketId,
        balance: balance,
        remark: remark
    };
    return param;
}

function balanceOffset(currentBalance, payPrice, isPick) {
    var payTotalPrice = 0;
    var offset = 0;
    currentBalance = parseFloat(currentBalance);
    payPrice = parseFloat(payPrice);
    if (isPick) {
        if (currentBalance < payPrice) {
            payTotalPrice = payPrice - currentBalance;
            offset = currentBalance;
        }else {
            offset = payPrice;
        }
        $("#pay-total-price").text(payTotalPrice.toFixed(1));
    }else {
        $("#pay-total-price").text(payPrice.toFixed(1));
    }
    $("#balance-offset").text(offset.toFixed(1));
}

function buySuccess(data) {
    var success = "buy-success.html?oid="+data.data.orderNum+"&date="+escape(data.data.deliveryDate);
    if (data.data.offline) {
        success += "&amount="+ escape(data.data.surplusAmount);
    }
    setTimeout(function() {
        window.location.href=success;
    }, 1200);
}