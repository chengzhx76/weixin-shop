/**
 * Created by 光灿 on 2016/7/3.
 */


setLocVal("userToken", "122");
setLocVal("appSecret", "wxclient");

/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key,value){
    window.localStorage[key] = value;
}

/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key){
    if(window.localStorage[key]) return window.localStorage[key];
    else return "";
}

/**
 * 清除缓存
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function clearLocVal(key){
    if(key) window.localStorage.removeItem(key);
    else window.localStorage.clear();
}