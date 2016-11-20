$(function () {
    var orderNum = getQueryparam("oid").trim();
    var deliveryDate = decodeURIComponent(getQueryparam("date").trim());
    var surplusAmount = decodeURIComponent(getQueryparam("Amount").trim());

    if (orderNum) {
        $('#no').text(orderNum);
    }
    if (deliveryDate) {
        $('#date').text(deliveryDate);
    }
    // 得还判断是线下支付么
    //if (surplusAmount) {
    //    $('#surplusAmount').text(surplusAmount);
    //}
});
