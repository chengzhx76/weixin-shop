$(function () {
    //getAllProduct();
    $('#login').click(function() {
        var $login = $(this);
        $('#net-loading').show();
        if($login.attr("working") == "true") {
            showError("操作太快了，休息一下吧！");
            return;
        } else {
            $login.addClass('weui_btn_disabled');
            $login.attr("working", "true");
        }
        ajaxHttpRequest('v1/login', {
            jsonpCallback: 'handler',
            data : {
                username: $("#username").val(),
                password: $("#password").val()
            },
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
                setLocVal(TOKEN, data.data.trim());

                /*var products = getLocVal("products");
                console.log(products);
                if (products) {
                    // 检测本地购买的物品
                    ajaxHttpRequest('product/v1/batch/add', {
                        jsonpCallback: 'allProduct',
                        data : JSON.parse(products),
                        success: function (data, status) {
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
                }
                clearLocVal("products");
                clearDb();
                clearLocVal("totalPrice");*/
                $('#net-loading').hide();
                $login.attr("working","false");
                $login.removeClass('weui_btn_disabled');
                window.location.href="index.html"
            },
            error: function (errorType, error) {
                showError("ERROR--请求出现异常！");
                $('#net-loading').hide();
            }
        });
    });
});

function handler(data) {
}
