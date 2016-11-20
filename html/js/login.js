$(function () {
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
                $login.attr("working","false");
                $login.removeClass('weui_btn_disabled');
                $('#net-loading').hide();
            },
            error: function (errorType, error) {
                showError("ERROR--请求出现异常！");
                $('#net-loading').hide();
            }
        });
    });
});

function handler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    setLocVal(TOKEN, data.data.trim());
    window.location.href="index.html"
}
