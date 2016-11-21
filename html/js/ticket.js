$(function () {
    $('#net-loading').show();
    ajaxHttpRequest('promotion/v1/usable', {
        jsonpCallback: 'handler',
        success: function (data, status) {
            if (status != "success") {
                showError("请求出现异常！");
                $('#net-loading').hide();
                return;
            }
            $('#net-loading').hide();
        },
        error: function (errorType, error) {
            showError("ERROR--请求出现异常！");
            $('#net-loading').hide();
        }
    });
});

function handler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var main = template('main-temp', data);
    $('.main-wrap').html(main);

    $("#sure").click(function () {
        var couponId = $(".list input[type='radio']:checked").parents('.item').attr('data-id');
        window.location.href="payment.html?couponId="+couponId;
    });

}