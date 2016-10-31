$(function () {
    $('#net-loading').show();
    //jsonp模式：进入该页，请求数据
    ajaxHttpRequest('product/v1/detail', {
        jsonpCallback: 'handler',
        data: {
            productId: getQueryparam('id')
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

function handler(data) {
    // 服务器出现异常
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var main = template('main-temp', data);
    $('.main-wrap').html(main);


    $('#slideshow').swipeSlide({
        autoSwipe: true,//自动切换默认是
        speed: 3000,//速度默认4000
        continuousScroll: true,//默认否
        transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',//过渡动画linear/ease/ease-in/ease-out/ease-in-out/cubic-bezier
        lazyLoad: true,//懒加载默认否
        firstCallback: function (i, sum, me) {
            me.find('.dot').children().first().addClass('cur');
        },
        callback: function (i, sum, me) {
            me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
        }
    });

    // 增加事件
    $(".add").click(function () {
        var obj = $(this);
        var num = parseInt(obj.prev('.count').text());
        if (num >= 999) { // 最多支持购买999个
            $.alert("商品不能超过999个","提示");
            return;
        }
        addCount(obj);
        addTotalCount(obj);

        addTotalPrice(obj);
    });
    // 减少事件
    $(".sub").click(function () {
        var obj = $(this);

        var numObj = obj.siblings('.count');
        var num = parseInt(numObj.text());
        if (num<=1) {
            $.alert("至少得购买一个","提示");
            return;
        }
        subCount(obj);
        subTotalCount(obj);
        subTotalPrice(obj);
    })
}



// 添加数量
function addCount(obj) {
    var numObj = obj.siblings('.count');
    var num = parseInt(numObj.text());
    num += 1;
    numObj.text(num);
};
// 增加总个数
function addTotalCount(obj) {
    var totalNum = parseInt($('#count').text().trim());
    var num  = totalNum % 9;
    if(!num) {
        totalNum += 2
    } else {
        totalNum += 1;
    }
    $('#count').text(totalNum);
}
// 添加商品金额
function addTotalPrice(obj) {
    var totalPrice = parseFloat($('#amount').text().trim());
    var singlePrice = parseFloat($('#single').text().trim());
    totalPrice += singlePrice;
    $('#amount').text(totalPrice.toFixed(1));
}
// 减少数量
function subCount(obj) {
    var numObj = obj.siblings('.count');
    var num = parseInt(numObj.text());
    num -= 1;
    numObj.text(num);
};
// 减少总个数
function subTotalCount(obj) {
    var totalNum = parseInt($('#count').text().trim());
    var num  = totalNum % 9;
    if(!num) {
        totalNum -= 2
    } else {
        totalNum -= 1;
    }
    $('#count').text(totalNum);
}
// 添加商品金额
function subTotalPrice(obj) {
    var totalPrice = parseFloat($('#amount').text().trim());
    var singlePrice = parseFloat($('#single').text().trim());
    totalPrice -= singlePrice;
    $('#amount').text(totalPrice.toFixed(1));
}