/**
 * RateInfoDao   普惠金融师数据处理
 *
 */
var RateInfoDao = function() {

    var indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    var DBName = indexedDB_config.DBName;                       //数据库名称
    var rate_info_storage = indexedDB_config.rateInfoName;     // 普惠金融师数据表
    var db; //数据库对象

    // 初始化
    this.init = function (callback){
        if (db) {
            callback && callback();
            return;
        }
        var req = indexedDB.open(DBName);
        req.onsuccess = function(evt) {
            //数据库打开成功
            db = req.result;
            db.onerror = function(evt){console.log("db error")};
            callback && callback();
        };
        req.onerror = function(evt) {console.log("initDb: 数据库打开失败！"+ evt.target.error)};
    };


    // 插入操作
    this.insertData = function (data, callback){
        var tx = db.transaction(rate_info_storage, 'readwrite');
        tx.oncomplete = function() {
            callback && callback();
        };
        var store = tx.objectStore(rate_info_storage);
        store.put(data);
    };

    // 查询所有
    this.queryAllData = function(callback) {
        var index = db.transaction(rate_info_storage, 'readonly').objectStore(rate_info_storage);
        var data = null;
        index.openCursor().onsucess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                data = cursor.value;
                cursor.continue();
            }
        };

        callback && callback(data);

    };

    // 更新
    this.updateData = function(usercode, data, callback) {
        var transaction = db.transaction([rate_info_storage], 'readwrite');
        var store = transaction.objectStore(rate_info_storage);
        var req = store.get(usercode);
        req.onsuccess = function() {
            var DBdata = this.result;
            console.log(DBdata);
            console.log(data);
            for (d in data) {
                DBdata[d] = data[d];
            }
            store.put(DBdata);

            callback && callback(data);

        }

    };

    // 通过员工编号查信息
    this.queryData = function(usercode, callback) {
        var transaction = db.transaction([rate_info_storage], 'readwrite');
        var store = transaction.objectStore(rate_info_storage);
        var req = store.get(usercode);
        req.onsuccess = function() {
            callback && callback(this.result);
        }
        req.onerror = function() {
            callback && callback(this.result);
        }
    };

    // 删除
    this.deleteAllData = function(callback) {
        var tx = db.transaction(rate_info_storage, 'readwrite');
        tx.objectStore(rate_info_storage).clear();
        tx.oncomplete=function(){
            callback && callback();
        }
    }
};