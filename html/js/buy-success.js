$(function () {
    var orderNum = getQueryparam("oid").trim();
    var deliveryDate = decodeURIComponent(getQueryparam("date").trim());

    if (orderNum) {
        $('#no').text(orderNum);
    }
    if (deliveryDate) {
        $('#date').text(deliveryDate);
    }
});
