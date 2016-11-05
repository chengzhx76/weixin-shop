const PATAM = "param";

var addrId = "";
var since = false;
var timeId = "";
var payId = "";
var ticketId = "";
var balance = false;
var remark = "";
$(function(){
    var param = {};
    var locParam = {};
    try {
        addrId = getQueryparam("addrId");
        since = getQueryparam("since") == "true";
        locParam = JSON.parse(decodeURIComponent(getLocVal(PATAM)));
        clearLocVal(PATAM);
    }catch(e) {
        console.error(e);
    }

    if (addrId != "") {
        param = {
            addrId: addrId,
            since: since
        };
    }else if (!isEmptyObject(locParam)) {
        param = locParam;
    }
    $('#net-loading').show();
    ajaxHttpRequest('order/v1/payment', {
        jsonpCallback: 'handler',
        data: param,
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

    if (data.data.deliveryTime != "") {
        $('.weui_input').val(data.data.deliveryTime.title);
        timeId = data.data.deliveryTime.value;
    }

    if (data.data.payId) {
        $("#pay input[type='radio']").each(function(index, element) {
            if ($(element).attr("data-id")==data.data.payId) {
                $(element).prop('checked', true);
                if ($(element).parents(".weui_cells").hasClass("recommend")) {
                    $(".more-pay").hide();
                }
            }
        });
    }else {
        $(".more-pay").hide();
        $("#pay .recommend input[type='radio']").prop('checked', true);
    }

    if (data.data.balance) {
        $("#money input[type='checkbox']").prop('checked', true);
    }
    if (data.data.remark != "") {
        $("#remark").val(data.data.remark);
    }

    $("#select-data").select({
        title: "送货时间",
        items: data.data.deliveryTimes,
        onChange: function (d) {
            $('.weui_input').val(d.titles);
            timeId = d.values;
            //$.alert("你选择了" + d.values + d.titles);
        }
    });

    $(".weui_textarea").on("input paste" , function(){
        var num_left=60-$(this).val().length;
        if(num_left<0){
            $("#textarea_num").text("超过"+(-num_left)+"字");
            $("#textarea_num").css("color","#E44443");
        }else{
            $("#textarea_num").text("剩余"+(num_left)+"字");
            $("#textarea_num").css("color","#999999");
        }
    });

    $("#more").click(function(){
        $(".more-pay").fadeToggle('fast');
        var isHas = $(this).hasClass('more');
        if (isHas) {
            $(this).removeClass('more');
        } else {
            $(this).addClass('more');
        }
    });

    $("#product-list").click(function () {
        addrId = data.data.addrId;
        since = data.data.since;
        payId = $("#pay input[type='radio']:checked").attr("data-id");
        balance = $("#money input[type='checkbox']").prop('checked');
        ticketId = $("#ticket").attr("data-id");
        remark = $("#remark").val();
        var param = {
            addrId: addrId,
            since: since,
            timeId: timeId,
            payId: payId,
            ticketId: ticketId,
            balance: balance,
            remark: remark
        }
        setLocVal(PATAM, encodeURIComponent(JSON.stringify(param)));
        return true;
    });

    $('#back').click(function(){
        $.modal({
            text: "你真的不要下单尝尝吗？",
            buttons: [
                { text: "我在想想", onClick: function(){}},
                { text: "不再考虑了", onClick: function(){
                    window.location.href="shopcart.html";
                }},
            ]
        });
    });
}