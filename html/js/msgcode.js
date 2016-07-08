/**
 * Created by 光灿 on 2016/7/7.
 */
$("input[type='number']").on("input paste" , function(){
    var $msg_code = $(this);
    if(/^\d{4,}$/.test($msg_code.val())) {
        $('#next').removeClass('weui_btn_disabled').click(function() {
            window.location.href='finishReg.html';
        });
    }else if (!$('#next').hasClass('weui_btn_disabled')){
        $('#next').addClass('weui_btn_disabled');
    }
});