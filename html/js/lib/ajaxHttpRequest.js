/**
 * Created by 光灿 on 2016/7/3.
 */

function ajaxHttpRequest(url, options) {
    var server_url = 'http://122.9.35.24/moblie/';

    var opts = $.extend({
        'method': 'get',
        'async': false,
        'data': null,
        'contentType': 'application/json',
        'dataType': 'jsonp',
        'jsonp': 'callback',
        'jsonpCallback': 'callback',
        'success': function () {},
        'error': function () {}
    }, options);

    var allUrl = server_url + url;

    try{
        var timestamp = new Date().getTime();
        var userToken = getLocVal('userToken');
        var appSecret = getLocVal('appSecret');
    }catch(e) {
        console.log(e)
    }

    var postData = {
        token: userToken,
        appKey: appSecret,
        timestamp: timestamp
    };

    if(opts.data) {
        var signStr = timestamp+userToken+appSecret;
        $.each(opts.data, function(key, val) {
            postData[key] = val;
            signStr += val;
        });
        postData.sign = $.md5(signStr);
    }

    $.ajax({
        type: opts.method,
        async: opts.async,
        url: allUrl,
        data: postData,
        contentType: opts.contentType,
        dataType: opts.dataType,
        jsonp: opts.jsonp,
        jsonpCallback: opts.jsonpCallback,
        success: function(data, status) {
            console.log(data);
            console.log(status);
            opts.success && opts.success.apply(this, [data, status]);
        },
        error: function(errorType, error) {
            console.log(error);
            opts.error && opts.error.apply(this, [errorType, error]);
        }
    });

}