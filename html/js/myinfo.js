$(function(){
    var userToken = getLocVal('userToken');
    // 去server验证token是否过期

    $('#net-loading').show();
    ajaxHttpRequest('user/v1/detail', {
        jsonpCallback: 'headerHandler',
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

function headerHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var header = template('header-temp', data);
    $('.header-wrap').html(header);

    var point = template('point-temp', data);
    $('.point-wrap').html(point);

    setProductTotalPrice();

    $('#logout').click(function() {
        $.confirm("您确定退出", function() {
            $.toast("退出成功!");
            clearLocVal(TOKEN);
            window.location.href="login.html"
        });
    });
}