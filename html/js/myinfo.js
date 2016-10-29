/**
 * Created by cheng on 2016/6/15.
 */
$(function(){
    var userToken = getLocVal('userToken');
    // 去server验证token是否过期

    //$("#showResult").empty()
    //if (userToken != '') {
    //    var header = template('main-temp', data);
    //    $('#header-temp').html(header);
    //}














    var $totalPrice = $(".total-price").children("strong").text();
    if($totalPrice!="" && $totalPrice!="0") {
        $(".total-price").show();
    }else {
        $(".total-price").hide();
    }
});