$(function () {
    var orderNum = getQueryparam("oid").trim();
    var deliveryDate = decodeURIComponent(getQueryparam("date").trim());
    var surplusAmount = decodeURIComponent(getQueryparam("amount").trim());

    console.log(surplusAmount);

    if (orderNum) {
        $('#no').text(orderNum);
    }
    if (deliveryDate) {
        $('#date').text(deliveryDate);
    }
    if (surplusAmount) {
        $('#amount').text(surplusAmount);
    }else {
        $('#amount').parent().remove();
    }
});
