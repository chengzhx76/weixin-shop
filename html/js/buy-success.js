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
    if (surplusAmount) {
        $('#surplusAmount').text(surplusAmount);
    }
});
