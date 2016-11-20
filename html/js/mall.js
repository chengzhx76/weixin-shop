$(function () {
    $('#net-loading').show();
    //jsonp模式：进入该页，请求数据
    ajaxHttpRequest('mall/v1/category', {
        jsonpCallback: 'typeHandler',
        success: function (data, status) {
            // 请求出现异常
            if (status != "success") {
                showError("请求出现异常！");
                $('#net-loading').hide();
                return;
            }
        },
        error: function (errorType, error) {
            showError("ERROR--请求出现异常！");
            $('#net-loading').hide();
        }
    });
});

function typeHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var type = template('type-temp', data);
    $('.type-wrap').html(type);
    ajaxHttpRequest('mall/v1/products', {
        jsonpCallback: 'productHandler',
        data: {
            id: '1'
        },
        success: function (data, status) {
            // 请求出现异常
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

    // 选择类别
    $(".nav .type:first").addClass("active");
    $(".type").click(function() {
        var $type = $(this);
        $type.siblings(".active").removeClass("active");
        $type.addClass("active");

        if ($type.hasClass("recharge")) {
            // TODO 处理手机充值页面
            return;
        }

        $('#net-loading').show();
        ajaxHttpRequest('mall/v1/products', {
            jsonpCallback: 'productHandler',
            data: {
                id: $type.attr('data-id')
            },
            success: function (data, status) {
                // 请求出现异常
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
}

function productHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var product = template('product-temp', data);
    $('.product-wrap').html(product);

    //var totalPrice = parseFloat(data.data.totalPrice);
    //if(totalPrice!="" && totalPrice!="0") {
    //    $(".total-price").children("strong").text(totalPrice.toFixed(1));
    //    $(".total-price").show();
    //}else {
    //    $(".total-price").hide();
    //}
    setProductTotalPrice();

    $.each($('.count'), function(key,val) {
        var countObj = $(val);
        var num = parseInt(countObj.text());
        if (num == 0) {
            countObj.hide();
            countObj.siblings('.sub').hide();
        }
    });

    $.each($('.add'), function(key,val) {
        var addObj = $(val);
        addObj.css('margin-right','9px').css('font-size','30px');
    });

    // 购买
    $(".add").click(function () {
        var $add = $(this);
        $('#buy-loading').show();
        if($add.attr("working") == "true") {
            showError("操作太快了，休息一下吧！");
            return;
        } else {
            $add.attr("working","true");
        }
        ajaxHttpRequest('mall/v1/add', {
            data: {
                productId: $add.parents('.item').attr("data-id")
            },
            success: function (data, status) {
                if (status != "success") {
                    showError("请求出现异常");
                    $('#buy-loading').hide();
                    $add.attr("working","false");
                    return;
                }
                if (!data.meta.success) {
                    showError(data.meta.msg);
                    $('#buy-loading').hide();
                    $add.attr("working","false");
                    return;
                }
                animation($add);
                // 数量增加
                addCount($add, data);
                // 金额增加
                setProductTotalPrice();
                $('#buy-loading').hide();

                $add.attr("working","false");
            },
            error: function (errorType, error) {
                $('#buy-loading').hide();
                showError("ERROR--请求出现异常");
            }
        });
    });

    // 减少事件
    $(".sub").click(function () {
        var $sub = $(this);
        $('#buy-loading').show();
        if($sub.attr("working") == "true") {
            showError("操作太快了，休息一下吧！");
            return;
        } else {
            $sub.attr("working","true");
        }
        ajaxHttpRequest('mall/v1/sub', {
            data: {
                productId: $sub.parents('.item').attr("data-id")
            },
            success: function (data, status) {
                if (status != "success") {
                    showError("请求出现异常");
                    $('#buy-loading').hide();
                    $sub.attr("working","false");
                    return;
                }
                if (!data.meta.success) {
                    showError(data.meta.msg);
                    $('#buy-loading').hide();
                    $sub.attr("working","false");
                    return;
                }
                // 数量增加
                subCount($sub, data);
                setProductTotalPrice();
                $('#buy-loading').hide();

                $sub.attr("working","false");
            },
            error: function (errorType, error) {
                $('#buy-loading').hide();
                showError("ERROR--请求出现异常");
            }
        });
    });
}

// 添加数量
function addCount($add, data) {
    var count = parseInt(data.data);
    $add.siblings('.count').text(count);
    if (count > 0) {
        $add.animate({marginRight:'8px','fontSize':'30px'},'fast');
        $add.siblings('.count').show();
        $add.siblings('.sub').show();
    }
}

// 减少数量
function subCount($sub, data) {
    var count = parseInt(data.data);
    $sub.siblings('.count').text(count);
    if(count == 0) {
        $sub.hide();
        $sub.siblings('.count').hide();
        $sub.siblings('.add').animate({marginRight:'10px','fontSize':'30px'},'fast');
    }
};
// 总金额
//function totalPriceFn(data) {
//    var totalPrice = parseFloat(data.data.totalPrice);
//    $(".total-price").children("strong").text(totalPrice.toFixed(1));
//    if (totalPrice == 0) {
//        $(".total-price").hide();
//    }
//}

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

// 放入购物车动画效果
function animation(obj) {
    var imgSrc = obj.parents(".item").children('.pic').children('img').attr('src');
    var imgObj = $('<img src="' + imgSrc + '">').appendTo("body").css({
        "width": "30px",
        "height": "30px",
        "border-radius": "50px",
        "position": "absolute",
        "top": toInteger(obj.offset().top) + toInteger(obj.css("width")) / 2 - 15,
        "left": toInteger(obj.offset().left) + toInteger(obj.css("height")) / 2 - 15,
    });
    var bool = new Parabola({
        el: imgObj,
        callback: function () {

        },
        stepCallback: function (x, y) {
        }
    });
    // 设置配置参数
    bool.setOptions({
        targetEl: $("#cart"),
        curvature: 0.01,
        duration: 600
    });
    // 开始运动
    bool.start();
}

// 转换成Int类型
function toInteger(text) {
    text = parseInt(text);
    return isFinite(text) ? text : 0;
}


