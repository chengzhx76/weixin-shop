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
            //$('#net-loading').hide();
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
}

function productHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var product = template('product-temp', data);
    $('.product-wrap').html(product);

    var $totalPrice = $(".total-price").children("strong").text();
    if($totalPrice!="" && $totalPrice!="0") {
        $(".total-price").show();
    }else {
        $(".total-price").hide();
    }

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

    // 选择类别
    $(".nav .type:first").addClass("active");
    $(".type").click(function() {
        var $type = $(this);
        var ac = $type.siblings(".active").removeClass("active");
        $type.addClass("active");






    });

    // 购买
    $(".add").click(function (event) {
        event.preventDefault();
        var obj = $(this);
        addCount(obj);
        if ($(".total-price").hide()) {
            $(".total-price").show();
        }
        addPrice(obj);
        putCart(obj);
    });


    // 减少事件
    $(".sub").click(function () {
        var obj = $(this);
        subCount(obj);
        subPrice(obj);
    });
}


// 放入购物车动画效果
function putCart(obj) {
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

// 添加金额
function addPrice(obj) {
    var price = obj.parent().prev(".price").children("strong").text();
    var totalPrice = $(".total-price").children("strong").text();
    var tp = 0;
    if (totalPrice == "") {
        tp = 0 + parseFloat(price);
    } else {
        tp = parseFloat(totalPrice) + parseFloat(price);
    }
    $(".total-price").children("strong").text(tp.toFixed(1));
}

// 减少金额
function subPrice(obj) {
    var price = parseFloat(obj.parent().prev(".price").children("strong").text());
    var totalPrice = parseFloat($(".total-price").children("strong").text());
    var tp = 0;
    if (totalPrice >= price) {
        tp = totalPrice - price;
    }
    if (tp <= 0) {
        $(".total-price").hide();
    }
    $(".total-price").children("strong").text(tp.toFixed(1));
}

// 添加数量
function addCount(obj) {
    var numObj = obj.siblings('.count');
    var num = parseInt(numObj.text());
    num += 1;
    numObj.text(num);
    if (num > 0) {
//        obj.removeAttr("style")
        obj.animate({marginRight:'8px','fontSize':'30px'},'fast');
        obj.siblings('.count').show();
        obj.siblings('.sub').show();
    }
}

// 减少数量
function subCount(obj) {
    var numObj = obj.siblings('.count');
    var num = parseInt(numObj.text());
    if (num != 0) {
        num -= 1;
        numObj.text(num);
        if(num == 0) {
            obj.hide();
            obj.siblings('.count').hide();
//          obj.siblings('.add').css('margin-right','10px').css('font-size','30px');
            obj.siblings('.add').animate({marginRight:'10px','fontSize':'30px'},'fast');
        }
    } else {
        obj.hide();
        obj.siblings('.count').hide();
        obj.siblings('.add').animate({marginRight:'10px','fontSize':'30px'},'fast');
    }
};

// 转换成Int类型
function toInteger(text) {
    text = parseInt(text);
    return isFinite(text) ? text : 0;
}


