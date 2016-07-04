/**
 * Created by cheng on 2016/7/4.
 */
var timer;
function showError(msg) {
    $('#error').html(msg).show();
    clearTimeout(timer);
    timer = setTimeout(function() {
        $('#error').hide()
    }, 3000);
}