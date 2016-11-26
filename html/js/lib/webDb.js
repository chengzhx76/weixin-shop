// 购买商品
function addProductCount(productId, price) {
    var db = initDatabase();
    db.transaction(function (trans) {
        trans.executeSql(
            "SELECT * FROM cart WHERE product_id = ?",
            [productId],
            function (trans, result) {
                if(result.rows.length > 0) {
                    var count = parseInt(result.rows.item(0).count);

                    console.log("数据库的数量为===》" + count);

                    addProduct(productId, count, trans);
                }else {
                    insetProduct(productId, trans);
                }
            }
        )
    });
    return loadCurrentProductCount(true, db, productId, price);
}
// 减少商品
function subProductCount(productId, price) {
    var db = initDatabase();
    db.transaction(function (trans) {
        trans.executeSql(
            "SELECT * FROM cart WHERE product_id = ?",
            [productId],
            function (trans, result) {
                if(result.rows.length > 0) {
                    var count = parseInt(result.rows.item(0).count);
                    subProduct(productId, count, trans);
                }
            }
        )
    });
    return loadCurrentProductCount(false, db, productId, price);
}

function getAllProduct() {
    var db = initDatabase();
    db.transaction(function (trans) {
        trans.executeSql(
            "SELECT * FROM cart",
            [],
            function (trans, result) {
                if (result.rows.length > 0) {
                    var products = [];
                    for (var i = 0; i < result.rows.length; i++) {
                        var data = result.rows.item(i);
                        var product = {
                            productId: data.product_id,
                            count: data.count
                        };
                        products.push(product);
                    }
                    console.log(JSON.stringify(products));
                    setLocVal("products", JSON.stringify(products));
                }
            }
        )
    });
}


function clearDb() {
    var db = initDatabase();
    db.transaction(function (trans) {
        trans.executeSql("drop table cart");
    });
}

function clearLocalStorage(product) {
    clearLocVal(product);
}
<!-- ------------------------------------------------------------------------------------------------------- -->
function initDatabase() {
    var db = openDatabase("shop", "1.0", "it's to save demo data!", 2 * 1024 * 1024);
    if (!db) {
        alert("您的浏览器不支持HTML5本地数据库");
        return;
    }
    db.transaction(
        function (trans) {
            trans.executeSql("CREATE TABLE IF NOT EXISTS cart(product_id int unique, count int)");
        }
    );
    return db;
}
// 增加商品
function addProduct(productId, count, trans) {
    count += 1;
    trans.executeSql(
        "UPDATE cart SET count = ? WHERE product_id = ?",
        [count, productId]
    );
}
// 减少商品
function subProduct(productId, count, trans) {
    if (count>0) {
        count-=1;
        trans.executeSql(
            "UPDATE cart SET count = ? WHERE product_id = ?",
            [count, productId]
        )
    }
}
// 插入商品
function insetProduct(productId, trans) {
    trans.executeSql(
        "INSERT INTO cart(product_id, count) VALUES(?, ?) ",
        [productId, 1]
    )
}
// 获取当前商品的个数
function loadCurrentProductCount(isAdd, db, productId, price) {
    db.transaction(function (trans) {
        trans.executeSql(
            "SELECT * FROM cart WHERE product_id = ?",
            [productId],
            function (trans, result) {
                if (result.rows.length > 0) {
                    var count = parseInt(result.rows.item(0).count);
                    setLocVal(productId, count);
                }
            }
        )
    });

    var totalPrice = 0;
    var count = getLocVal(productId);
    var localPrice = getLocVal("totalPrice");
    if (localPrice!="" && !isNaN(localPrice)) {
        totalPrice = parseFloat(localPrice);
    }
    if (isAdd) {
        if (count) {
            count = parseInt(count) + 1
        } else {
            count = 1;
        }
        price = parseFloat(price);
        totalPrice = totalPrice + price;
    } else {
        if (count > 1) {
            count = parseInt(count) - 1;
            totalPrice = totalPrice - price;
        } else if (count == 1) {
            db.transaction(function (trans) {
                trans.executeSql("DELETE FROM cart WHERE product_id = ?",[productId])
            });
            count = 0;
            totalPrice = 0;
        } else {
            count = 0;
            totalPrice = 0;
        }
    }
    clearLocVal(productId);
    setLocVal("totalPrice", totalPrice);
    return count;
}

