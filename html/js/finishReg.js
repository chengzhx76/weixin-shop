/**
 * Created by 光灿 on 2016/7/7.
 */
$("input[type='text']").on("input paste" , function(){
    var $nick_name = $(this);
    if($nick_name.val().length > 3) {
        if (validatepassword()) {
            $('#finish').removeClass('weui_btn_disabled');
        }
    }else if (!$('#finish').hasClass('weui_btn_disabled')){
        $('#finish').addClass('weui_btn_disabled');
    }
});

$("input[type='password']").on("input paste" , function(){
    var $password = $(this);
    if(/^([a-z]|[A-Z]|[0-9]){8,}$/.test($password.val())) {
        if (validateNikeName()) {
            $('#finish').removeClass('weui_btn_disabled');
        }
    }else if (!$('#finish').hasClass('weui_btn_disabled')){
        $('#finish').addClass('weui_btn_disabled');
    }
});

function validateNikeName() {
    var $nick_name = $("input[type='text']");
    if($nick_name.val().length > 3) {
        return true;
    }else {
        return false;
    }
}
function validatepassword() {
    var $password = $("input[type='password']");
    if(/([a-z]|[A-Z]|[0-9]){8}$/.test($password.val())) {
        return true;
    }else {
        return false;
    }
}

$(function(){
    $('#finish').click(function() {
        if (validateNikeName() && validatepassword()) {
            $('#net-loading').show();
            var nickname = $("input[type='text']").val().trim();
            var password = $("input[type='password']").val().trim();
            ajaxHttpRequest('v1/register', {
                data: {
                    nickname: nickname,
                    password: password
                },
                success: function (data, status) {
                    if (status != "success") { // 请求出现异常
                        showError("请求出现异常！");
                        $('#net-loading').hide();
                        return;
                    }
                    if (!data.meta.success) { // 服务器出现异常
                        showError(data.meta.msg);
                        $('#net-loading').hide();
                        return;
                    }
                    $('#net-loading').hide();
                    window.location.href='myinfo.html'
                },
                error: function (errorType, error) {
                    showError("ERROR--请求出现异常！");
                    $('#net-loading').hide();
                }
            });
        }
    })
})