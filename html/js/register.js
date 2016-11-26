$(function () {
    var evTimeStamp = 0;
    $("input[type='number']").on("input paste" , function(){
        var $phone = $(this);
        if(/^1[3458]\d{9}$/.test($phone.val())) {
            $('#next').removeClass('weui_btn_disabled').click(function() {
                var now =+ new Date();
                if (now - evTimeStamp < 200) return;
                evTimeStamp = now;
                var phone = $phone.val();
                $('#net-loading').show();
                ajaxHttpRequest('v1/sendMsgCode', {
                    data: {
                        phone: phone
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
                        $('#net-loading').hide();
                        window.location.href='msgcode.html?phone='+phone;
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