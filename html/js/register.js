/**
 * Created by 光灿 on 2016/7/7.
 */

$(function () {
    $("input[type='number']").on("input paste" , function(){
        var $phone = $(this);
        if(/^1[3458]\d{9}$/.test($phone.val())) {
            $('#next').removeClass('weui_btn_disabled').click(function() {
                $('#net-loading').show();
                var phone = $phone.val();
                ajaxHttpRequest('v1/sendMsgCode', {
                    data: {
                        phone: phone
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
                        window.location.href='msgcode.html';
                    },
                    error: function (errorType, error) {
                        showError("ERROR--请求出现异常！");
                        $('#net-loading').hide();
                    }
                });
            });
        }else if (!$('#next').hasClass('weui_btn_disabled')){
            $('#next').addClass('weui_btn_disabled');
        }
    });

});