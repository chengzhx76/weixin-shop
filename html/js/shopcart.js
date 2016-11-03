$(function () {

    var since = false;
    var id = "";
    var addrId = getQueryparam("addrId");
    var sinceId = getQueryparam("sinceId");
    if (addrId != "" && addrId != null) {
        id = addrId;
    }else if (sinceId != "" && sinceId != null){
        id = sinceId;
        since = true;
    }

    console.log(since);
    console.log(id);

    $('#net-loading').show();
    //jsonp模式：进入该页，请求数据
    ajaxHttpRequest('cart/v1/info', {
        jsonpCallback: 'handler',
        data: {
            id: id,
            since: since
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
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var main = template('main-temp', data);
    $('.main-wrap').html(main);

    var evTimeStamp = 0;
    if ($(".list input[type='checkbox']").prop('checked')) {
        $("#allSelect input[type='checkbox']").prop('checked', true);
        addTotalPrice(data);
    }
    // 初始化运费
    addSubtotal(data);

    // 增加事件
    $(".add").click(function () {
        var $add = $(this);
        $('#buy-loading').show();
        if($add.attr("working") == "true") {
            showError("操作太快了，休息一下吧！");
            return;
        } else {
            $add.attr("working", "true");
        }

        var productId = $add.parents('.item').attr("data-id");

        // 无货或下架的不可点击
        var isDisabled = $add.parents('.weui_cells').find("input[type='checkbox']").is(':disabled');
        if(isDisabled) return;

        var num = parseInt($add.prev('.count').text());
        if (num >= 999) { // 最多支持购买999个
            $.alert("商品不能超过"+num+"个", "提示");
            return;
        }
        // 该商品是否已勾选
        var isCheckbox = $add.parents('.weui_cells').find("input[type='checkbox']").is(':checked');
        if (!isCheckbox) {
            $add.parents('.weui_cells').find("input[type='checkbox']").prop("checked",true);
        }
        ajaxHttpRequest('cart/v1/add', {
            data: {
                productId: productId
            },
            success: function (data, status) {
                if (status != "success") { // 请求出现异常
                    showError("请求出现异常");
                    $('#buy-loading').hide();
                    $add.attr("working","false");
                    return;
                }
                if (!data.meta.success) { // 服务器出现异常
                    showError(data.meta.msg);
                    $('#buy-loading').hide();
                    $add.attr("working","false");
                    return;
                }
                $('#buy-loading').hide();
                addCountAndSinglePrice($add, data);
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
            $sub.attr("working", "true");
        }

        var productId = $sub.parents('.item').attr("data-id");
        // 无货或下架的不可点击
        var isDisabled = $sub.parents('.weui_cells').find("input[type='checkbox']").is(':disabled');
        if(isDisabled) return;

        // 数量小于0不执行 后面的函数
        var numObj = $sub.next('.count');
        var num = parseInt(numObj.text());
        if (num <= 0) {
            return;
        }
        if (num != 1) {
            var isCheckbox = $sub.parents('.weui_cells').find("input[type='checkbox']").is(':checked');
            if (!isCheckbox) {
                $sub.parents('.weui_cells').find("input[type='checkbox']").prop("checked",true);
            }
        }
        if (num > 1) {
            ajaxHttpRequest('cart/v1/sub', {
                data: {
                    productId: productId
                },
                success: function (data, status) {
                    if (status != "success") { // 请求出现异常
                        showError("请求出现异常");
                        $('#buy-loading').hide();
                        $sub.attr("working","false");
                        return;
                    }
                    if (!data.meta.success) { // 服务器出现异常
                        showError(data.meta.msg);
                        $('#buy-loading').hide();
                        $sub.attr("working","false");
                        return;
                    }
                    $('#buy-loading').hide();
                    numObj.text(data.data.count);
                    $('#amount').text(data.data.totalPrice);
                    addSubtotal(data);
                    $sub.attr("working","false");
                },
                error: function (errorType, error) {
                    $('#buy-loading').hide();
                    showError("ERROR--请求出现异常");
                }
            });
        }else if (num == 1) {
            $.confirm("您确定要删除吗?", "删除确认", function () {
                ajaxHttpRequest('cart/v1/delete', {
                    data: {
                        productId: productId
                    },
                    success: function (data, status) {
                        if (status != "success") { // 请求出现异常
                            showError("请求出现异常");
                            $('#buy-loading').hide();
                            $sub.attr("working","false");
                            return;
                        }
                        if (!data.meta.success) { // 服务器出现异常
                            showError(data.meta.msg);
                            $('#buy-loading').hide();
                            $sub.attr("working","false");
                            return;
                        }
                        $('#buy-loading').hide();

                        numObj.text(data.data.count);
                        $('#amount').text(data.data.totalPrice);
                        addSubtotal(data);
                        var isCheckbox = $obj.parents('.weui_cells').find("input[type='checkbox']").is(':checked');
                        if (isCheckbox) {
                            $sub.parents('.weui_cells').find("input[type='checkbox']").prop("checked", false);
                        }

                        $obj.parents('.weui_cells').fadeOut("200", function () {
                            $(this).remove();
                        });
                        $sub.attr("working","false");
                    },
                    error: function (errorType, error) {
                        $('#buy-loading').hide();
                        showError("ERROR--请求出现异常");
                    }
                });
            }, function () {
                //取消操作
            });
        }
    });

    // 选择单个商品
    $('.list .weui_check_label').click(function() {
        var now =+ new Date();
        if (now - evTimeStamp < 100) return;
        evTimeStamp = now;
        var $obj = $(this);

        $('#buy-loading').show();
        if($obj.attr("working") == "true") {
            showError("操作太快了，休息一下吧！");
            return;
        } else {
            $obj.attr("working", "true");
        }

        var productId = $obj.parents('.weui_cells').find('.item').attr("data-id");
        // 无货或下架的不可点击
        var isDisabled = $obj.find("input[type='checkbox']").is(':disabled');
        if(isDisabled) return;

        // 全选是否勾选
        var isSelfCheckbox = $obj.find("input[type='checkbox']").prop('checked');
        if (isSelfCheckbox) {
            var $allSelect = $('#allSelect').find("input[type='checkbox']");
            var isChecked = $allSelect.prop("checked");
            if (isChecked) {
                $allSelect.prop("checked", false);
            }
        }
        // 总金额的+/-
        ajaxHttpRequest('cart/v1/change', {
            data: {
                productId: productId
            },
            success: function (data, status) {
                if (status != "success") { // 请求出现异常
                    showError("请求出现异常");
                    $('#buy-loading').hide();
                    $obj.attr("working","false");
                    return;
                }
                if (!data.meta.success) { // 服务器出现异常
                    showError(data.meta.msg);
                    $('#buy-loading').hide();
                    $obj.attr("working","false");
                    return;
                }
                $('#buy-loading').hide();
                tatalPrice($obj, data);
                $obj.attr("working","false");
            },
            error: function (errorType, error) {
                $('#buy-loading').hide();
                showError("ERROR--请求出现异常");
            }
        });
    });

    // 全选
    $('#allSelect').click(function(){
        var now = +new Date();
        if (now - evTimeStamp < 100) {
            return;
        }
        evTimeStamp = now;
        var $obj = $(this);

        $('#buy-loading').show();
        if($obj.attr("working") == "true") {
            showError("操作太快了，休息一下吧！");
            return;
        } else {
            $obj.attr("working", "true");
        }

        if (!$(this).find('.weui_check').prop('checked')) {
            ajaxHttpRequest('cart/v1/chooseAll', {
                success: function (data, status) {
                    if (status != "success") {
                        showError("请求出现异常");
                        $('#buy-loading').hide();
                        $obj.attr("working","false");
                        return;
                    }
                    if (!data.meta.success) {
                        showError(data.meta.msg);
                        $('#buy-loading').hide();
                        $obj.attr("working","false");
                        return;
                    }
                    $('#buy-loading').hide();
                    addTotalPrice(data);
                    $obj.attr("working","false");
                },
                error: function (errorType, error) {
                    $('#buy-loading').hide();
                    showError("ERROR--请求出现异常");
                }
            });

            $(".list input[type='checkbox']").each(function(index, value){
                if (!$(value).is(':disabled')) {
                    $(value).prop('checked', true);
                }
            });
        }else {
            ajaxHttpRequest('cart/v1/unChoose', {
                success: function (data, status) {
                    if (status != "success") {
                        showError("请求出现异常");
                        $('#buy-loading').hide();
                        $obj.attr("working","false");
                        return;
                    }
                    if (!data.meta.success) {
                        showError(data.meta.msg);
                        $('#buy-loading').hide();
                        $obj.attr("working","false");
                        return;
                    }
                    $('#buy-loading').hide();
                    subTotalPrice(data);
                    $obj.attr("working","false");
                },
                error: function (errorType, error) {
                    $('#buy-loading').hide();
                    showError("ERROR--请求出现异常");
                }
            });
            $(".list input[type='checkbox']").prop("checked",false);
        }
    });
}

// 计算总价价格
function tatalPrice(obj, data) {
    obj.find("input[type='checkbox']").prop('checked', data.data.choose);
    $('#amount').text(data.data.totalPrice);
    addSubtotal(data);
}

// 添加单个商品金额
function addCountAndSinglePrice(obj, data) {
    var numObj = obj.siblings('.count');
    numObj.text(data.data.count);

    $('#amount').text(data.data.totalPrice);
    addSubtotal(data);
}
// 添加金额
function addTotalPrice(data) {
    $('#amount').text(data.data.totalPrice);
    addSubtotal(data);
};

// 减少金额
function subTotalPrice(data) {
    $('#amount').text(data.data.totalPrice);
    addSubtotal(data);
};

// 小计金额
function addSubtotal(data) {
    var totalPrice =  parseFloat(data.data.totalPrice);
    var freight =  parseInt(data.data.freight);
    var freeFreightAmount =  parseInt(data.data.freeFreightAmount);
    $('#cost').text(totalPrice.toFixed(1));
    if (totalPrice == 0) {
        $('#remark').html("没有选择商品哦");
    }else if(freight == 0) {
        $('#remark').html("运费已免");
    }else {
        $('#remark').html("还差"+(freeFreightAmount-totalPrice).toFixed(1)+"可免运费");
    }
};
