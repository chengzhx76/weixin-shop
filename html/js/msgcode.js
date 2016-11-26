$(function(){
    var phone = getQueryparam("phone");
    $('.phone').text(phone);

    second();
    $("input[type='number']").on("input paste" , function(){
        var $msg_code = $(this);
        if(/^\d{4,}$/.test($msg_code.val())) {
            $('#next').removeClass('weui_btn_disabled').click(function() {
                $('#net-loading').show();
                ajaxHttpRequest('v1/checkCode', {
                    data: {
                        phone: phone,
                        validate: $("input[type='number']").val().trim()
                    },
                    success: function (data, status) {
                        $('#net-loading').hide();
                        if (status != "success") {
                            showError("请求出现异常！");
                            return;
                        }
                        if (!data.meta.success) {
                            showError(data.meta.msg);
                            return;
                        }

                        if (data.data) {
                            window.location.href='finishReg.html';
                        }else {
                            showInfo('验证码错误');
                            $("input[type='number']").val('');
                        }
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

    $("#send").click(function () {
        if ($('#send').text() != '重发验证码') {
            return;
        }
        $('#net-loading').show();
        ajaxHttpRequest('v1/sendMsgCode', {
            data: {
                phone: $('.phone').text().trim()
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
                second();
                showInfo('发送成功');
            },
            error: function (errorType, error) {
                showError("ERROR--请求出现异常！");
                $('#net-loading').hide();
            }
        });
    })

    $("#next").click(function () {
        var code = $("input[type='number']").val().trim();
        if (code) {
            window.location.href="reg-finish.html?phone="+phone+"&code="+code;
        }
    })
});

var timer = 60;
function second(){
    if(timer != 1){
        timer--;
        $('#second').html(timer);
        setTimeout("second()", 1000);
    }else {
        $('#send').text('重发验证码')
    }
}