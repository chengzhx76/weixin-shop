function ajaxHttpRequest(url, options) {
    var server_url = 'http://wx.aqd123.com/moblie/';
    //var server_url = 'http://localhost/moblie/';

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
        var appSecret = getLocVal('appSecret');
        var timestamp = new Date().getTime();
        var userToken = getLocVal('userToken');
    }catch(e) {
        console.log(e)
    }

    var postData = {
        appKey: appSecret,
        timestamp: timestamp,
        token: userToken
    };

    var signStr = appSecret+timestamp+userToken;
    if(opts.data) {
        var paramObj = {};
        $.each(opts.data, function(key, val) {
            paramObj[key] = val;
        });
        var param = encodeURI(JSON.stringify(paramObj));
        signStr += param;
        postData.param = param;
    }
    postData.sign = $.md5(signStr);

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

function callback(data) {
    console.log("===>callback");
}

