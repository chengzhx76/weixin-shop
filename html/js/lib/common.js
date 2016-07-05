/**
 * Created by cheng on 2016/7/4.
 */
var timer;
function showError(msg) {
    $('#error .err-txt').html(msg);
    $('#error').fadeIn('fast');

    clearTimeout(timer);
    timer = setTimeout(function() {
        //$('#error').hide()
        $('#error').fadeOut('slow');
    }, 1500);
}