/**
 * Created by 光灿 on 2016/6/20.
 * http://www.freejs.net/article_tabbiaoqian_29.html
 */
$(function () {
    $('section').hide();
    $(".weui_navbar .weui_navbar_item:first").addClass("tab-red").show();
    $("section:first").show();

    $('#net-loading').show();
    //jsonp模式：进入该页，请求数据
    ajaxHttpRequest('user/v1/all/addr', {
        jsonpCallback: 'handler',
        success: function (data, status) {
            // 请求出现异常
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
    var home = template('home-temp', data);
    $('.home-wrap').html(home);

    $(".weui_navbar_item").click(function() {
        $(".weui_navbar_item").removeClass("tab-red");
        $(this).addClass("tab-red");
        $("section").hide();
        var activeTab = $(this).find("a").attr("href");
        $('#net-loading').show();

        if(activeTab == '#home') {
            ajaxHttpRequest('user/v1/all/addr', {
                jsonpCallback: 'homeHandler',
                success: function (data, status) {
                    // 请求出现异常
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

            $('.footer').show();
        }else {
            ajaxHttpRequest('order/v1/ara/town', {
                jsonpCallback: 'townHandler',
                success: function (data, status) {
                    // 请求出现异常
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

            $('.footer').hide();
        }
        $(activeTab).fadeIn();
        return false;
    });
}

function homeHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var home = template('home-temp', data);
    $('.home-wrap').html(home);
}

function townHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var town = template('town-temp', data);
    $('.town-wrap').html(town);

    $(".c-item:first").addClass("bkg");

    ajaxHttpRequest('order/v1/ara/village', {
        jsonpCallback: 'villageHandler',
        data : {
            id : $(".c-item:first").attr('data-id')
        },
        success: function (data, status) {
            // 请求出现异常
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

    $(".c-item").click(function () {
        var $town = $(this);
        ajaxHttpRequest('order/v1/ara/village', {
            jsonpCallback: 'villageHandler',
            data: {
                id : $(".c-item:first").attr('data-id')
            },
            success: function (data, status) {
                // 请求出现异常
                if (status != "success") {
                    showError("请求出现异常！");
                    $('#net-loading').hide();
                    return;
                }

                $town.siblings(".c-item").removeClass("bkg");
                $town.addClass("bkg");

                $('#net-loading').hide();
            },
            error: function (errorType, error) {
                showError("ERROR--请求出现异常！");
                $('#net-loading').hide();
            }
        });
    });
}
function villageHandler(data) {
    if (!data.meta.success) {
        showError(data.meta.msg);
        $('#net-loading').hide();
        return;
    }
    var village = template('village-temp', data);
    $('.village-wrap').html(village);
}
