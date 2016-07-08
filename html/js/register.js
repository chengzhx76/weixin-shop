/**
 * Created by 光灿 on 2016/7/7.
 */

$("input[type='number']").on("input paste" , function(){
    var $phone = $(this);
    if(/^1[3458]\d{9}$/.test($phone.val())) {
        $('#next').removeClass('weui_btn_disabled').click(function() {
            window.location.href='msgcode.html';
        });
    }else if (!$('#next').hasClass('weui_btn_disabled')){
        $('#next').addClass('weui_btn_disabled');
    }
});

