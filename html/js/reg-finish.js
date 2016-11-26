$(function () {
    var phone = getQueryparam("phone");
    var code = getQueryparam("code");
    console.log(phone);
    console.log(code);

    $("#finish").click(function () {
        $('#net-loading').show();
        var nickname = $("input[type='text']").val().trim();
        var password = $("input[type='password']").val().trim();

        console.log(nickname);
        console.log(password);

        ajaxHttpRequest('v1/register', {
            data: {
                phone: phone,
                validate: code,
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
                setLocVal(TOKEN, data.data.trim());
                $('#net-loading').hide();
                window.location.href='index.html';
            },
            error: function (errorType, error) {
                showError("ERROR--请求出现异常！");
                $('#net-loading').hide();
            }
        });
    })
});
