/* *
 *      LsyStorage
 *      author loushengyue
 *      website http://www.loushengyue.com
 *      version 1.1.1
 *      methods
 *              .getItem(key[string])
 *              .getItemsByKeys(keys[array])
 *              .getArr(prex[string])
 *              .setItem(key[string],value[string|object])
 *              .setArr(prex[string],values[array],byId[boolean])
 *              .setList(keys[array],values[array])
 *              .removeItem(key[string])
 *              .clearAll(),clear()
 */

/* *
 *      LsySession
 *      author loushengyue
 *      website http://www.loushengyue.com
 *      version 1.1.1
 *      methods
 *              .getItem(key[string])
 *              .getItemsByKeys(keys[array])
 *              .getArr(prex[string])
 *              .setItem(key[string],value[string|object])
 *              .setArr(prex[string],values[array],byId[boolean])
 *              .setList(keys[array],values[array])
 *              .removeItem(key[string])
 *              .clearAll(),clear()
 */

/* *
 *      LsyCookie
 *      author loushengyue
 *      website http://www.loushengyue.com
 *      version 1.1.1
 *      methods [set(),get(),getAll(),clear(),clearAll()]
 */
;(function (win, doc) {
    /* *
     *      The constructor of Storages
     */
    var Storages = function () {
        this.version = '1.1.1';
    };
    /* *
     *      ckeck val is the right typeof string, if not, change it.
     *      val     typeof String,Array,Object
     *      return  typeof string
     */
    Storages.prototype.checkVal = function (val) {
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        return val;
    };
    /* *
     *      ckeck key is the right typeof string, if not, change it.
     *      val     typeof String,Array,Object
     *      return  typeof string
     */
    Storages.prototype.checkKey = function (key) {
        if (typeof key != 'string') {
            throw new Error('The typeof key argument in setItem(key[string],value[string|object]){...} must be string. But the typeof your argument "' + key + '" is ' + typeof key);
        }
        return true;
    };
    /* *
     *      ckeck the length of keyArr and valArr, if them are not eq, return false.
     *      keyArr     typeof Array
     *      valArr     typeof Array
     *      return     typeof boolean
     */
    Storages.prototype.checkKeyVal = function (keys, values) {
        if (keys.length != values.length) {
            throw new Error('The length of keys and values in setList(keys, values) need eq. The keys.length=' + keys.length + ', but values.length=' + values.length);
        }
        return true;
    };
    /* *
     *      ckeck the typeof str.
     *      str        typeof Object,String,Array
     *      return     typeof boolean
     */
    Storages.prototype.isJsonStr = function (str) {
        try {
            var obj = JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };
    /* *
     *      ckeck the typeof arr.
     *      arr        typeof Object,String,Array
     *      return     typeof boolean
     */
    Storages.prototype.checkArr = function (arr) {
        return arr instanceof Array;
    };
    /* *
     *      setItem by keys and values
     *      keys       typeof Array
     *      values     typeof values
     */
    Storages.prototype.setList = function (keys, values) {
        if (this.checkKeyVal(keys, values)) {
            for (var i = 0, n = keys.length; i < n; i++) {
                this.setItem(keys[i], values[i]);
            }
        }
    };

    Storages.prototype.hasIdProperty = function (obj) {
        if (typeof obj !== 'object') {
            throw new Error('The obj augument in hasIdProperty(obj){...} is not object');
        }
        if (!obj.hasOwnProperty('id')) {
            throw new Error('This Object of ' + obj + ' has not id property.');
        }
        return true;
    };
    /* *
     *      setItem by prex and arr
     *      prex       typeof String
     *      arr        typeof Array
     */
    Storages.prototype.setArr = function (prex, arr, byId) {
        if (this.checkArr(arr)) {
            var key, i = 0, n = arr.length;
            if (!byId) {
                for (; i < n; i++) {
                    key = prex + '_' + i;
                    this.setItem(key, arr[i]);
                }
            } else {
                for (; i < n; i++) {
                    if (this.hasIdProperty(arr[i])) {
                        key = prex + '_' + arr[i].id;
                        this.setItem(key, arr[i]);
                    }
                }
            }
        } else {
            this.setItem(prex, arr);
        }
    };
    /* *
     *      sortKeys by index of keys
     *      keys       typeof String
     */
    Storages.prototype.sortKeys = function (keys) {
        if (!keys instanceof Array) {
            return false;
        }
        keys.sort(function (a, b) {
            a = Number(a.match(/_\d+$/)[0].substr(1));
            b = Number(b.match(/_\d+$/)[0].substr(1));
            return a - b;
        });
        return keys;
    };
    /* *
     *      filterKeys by RegExp
     *      reg       typeof String
     *      keys        typeof Array
     */
    Storages.prototype.filterKeysByReg = function (keys, prex) {
        var arr = [];
        var reg = new RegExp(prex);
        keys.forEach(function (key) {
            if (reg.test(key)) {
                arr.push(key);
            }
        });
        return arr;
    };
    /* *
     *      getItems By Keys
     *      keys        typeof Array
     */
    Storages.prototype.getItemsByKeys = function (keys) {
        var arr = [];
        var _this = this;
        keys = _this.sortKeys(keys);
        keys.forEach(function (key) {
            arr.push(_this.getItem(key));
        });
        return arr;
    };
    /* *
     *  ----------------------------------------------------------------------
     */
    var LsyStorage = function () {
        this.version = 'Lsy localStorage 1.1.1';
    };
    /* *
     *      class LsyCookie extends Storages
     */
    LsyStorage.prototype = Object.create(Storages.prototype);
    LsyStorage.prototype.constructor = LsyStorage;
    /* *
     *      Clear localStorage. Like the methods of clear().
     */
    LsyStorage.prototype.clearAll = function () {
        win.localStorage.clear();
    };
    LsyStorage.prototype.clear = function () {
        win.localStorage.clear();
    };
    /* *
     *      Remove item by key. Like the methods of removeItem().
     *      key  typeof  String
     */
    LsyStorage.prototype.removeItem = function (key) {
        win.localStorage.removeItem(key);
    };
    /* *
     *      Get item from localStorage by key.
     *      key      typeof  String
     *      return   typeof  String,Object
     */
    LsyStorage.prototype.getItem = function (key) {
        var str = win.localStorage.getItem(key);
        if (this.isJsonStr(str)) {
            str = JSON.parse(win.localStorage.getItem(key));
        }
        return str;
    };
    /* *
     *      Set item by key and val.
     *      key      typeof  String
     *      val      typeof  String
     */
    LsyStorage.prototype.setItem = function (key, val) {
        if (this.checkKey(key)) {
            val = this.checkVal(val);
            win.localStorage.setItem(key, val);
        }
    };
    /* *
     *      get some strorages from localStroage.
     *      prex       typeof String
     *      return     typeof Array
     */
    LsyStorage.prototype.getArr = function (prex) {
        var _this = this;
        var arr = [];
        var keys = Object.keys(win.localStorage);
        keys = _this.filterKeysByReg(keys, prex);
        arr = _this.getItemsByKeys(keys);
        return arr;
    };
    /* *
     *  ----------------------------------------------------------------------
     */
    var LsySession = function () {
        this.version = 'Lsy sessionStorage 1.1.1';
    };
    /* *
     *      class LsyCookie extends Storages
     */
    LsySession.prototype = Object.create(Storages.prototype);
    LsySession.prototype.constructor = LsySession;
    /* *
     *      Clear sessionStorage. Like the methods of clear().
     */
    LsySession.prototype.clearAll = function () {
        win.sessionStorage.clear();
    };
    LsySession.prototype.clear = function () {
        win.sessionStorage.clear();
    };
    /* *
     *      Remove item by key. Like the methods of removeItem().
     *      key  typeof  String
     */
    LsySession.prototype.removeItem = function (key) {
        win.sessionStorage.removeItem(key);
    };
    /* *
     *      Get item from sessionStorage by key.
     *      key      typeof  String
     *      return   typeof  String,Object
     */
    LsySession.prototype.getItem = function (key) {
        var str = win.sessionStorage.getItem(key);
        if (this.isJsonStr(str)) {
            str = JSON.parse(win.sessionStorage.getItem(key));
        }
        return str;
    };
    /* *
     *      Set item by key and val.
     *      key      typeof  String
     *      val      typeof  String
     */
    LsySession.prototype.setItem = function (key, val) {
        if (this.checkKey(key)) {
            val = this.checkVal(val);
            win.sessionStorage.setItem(key, val);
        }
    };
    /* *
     *      get some strorages from localStroage.
     *      prex       typeof String
     *      return     typeof Array
     */
    LsySession.prototype.getArr = function (prex) {
        var _this = this;
        var arr = [];
        var keys = Object.keys(win.sessionStorage);
        keys = _this.filterKeysByReg(keys, prex);
        arr = _this.getItemsByKeys(keys);
        return arr;
    };

    /* *
     *  ----------------------------------------------------------------------
     */

    var LsyCookie = function () {
        this.version = 'Lsy cookies 1.1.1';
        this.expiresTime = 7 * 24 * 3600;
    };
    /* *
     *      class LsyCookie extends Storages
     */
    LsyCookie.prototype = Object.create(Storages.prototype);
    LsyCookie.prototype.constructor = LsyCookie;
    /* *
     *      reset expires time
     *      time     typeof number[7days]
     */
    LsyCookie.prototype.resetTime = function (time) {
        if (time != null) {
            if (isNaN(time)) {
                throw new Error('The typeof time argument in resetTime(time){...} must be number. But the typeof your argument "' + time + '" is ' + typeof time);
            }
            time = time > 0 ? time : -1;
        } else {
            time = this.expiresTime;
        }
        return time;
    };
    /* *
     *      create cookie by key and value, and set expires time
     *      key     typeof string
     *      val     typeof string
     *      time    typeof number[7days]
     */
    LsyCookie.prototype.set = function (key, val, time) {
        if (this.checkKey(key)) {
            val = this.checkVal(val);
            time = this.resetTime(time);
            var exp = new Date();
            exp.setTime(exp.getTime() + time * 1000);
            doc.cookie = key + '=' + val + ';expires=' + exp.toGMTString();
        }
    };
    /* *
     *      remove cookie by key
     *      key typeof string
     */
    LsyCookie.prototype.clear = function (key) {
        this.set(key, "", -1);
    };
    /* *
     *      remove all cookies
     */
    LsyCookie.prototype.clearAll = function () {
        var _this = this;
        var keys = Object.keys(_this.getAll());
        keys.forEach(function (item) {
            _this.clear(item);
        });
    };
    /* *
     *      get all cookies, and return object
     */
    LsyCookie.prototype.getAll = function () {
        var cookies = doc.cookie.split(/;\s/g);
        var cookieObj = {};
        var _this = this;
        cookies.forEach(function (item) {
            var key = item.split('=')[0];
            var val = item.split('=')[1];
            if (_this.isJsonStr(val)) {
                val = JSON.parse(val);
            }
            cookieObj[key] = val;
        });
        return cookieObj;
    };
    /* *
     *      get cookie by key
     *      key typeof string
     */
    LsyCookie.prototype.get = function (key) {
        return this.getAll()[key];
    };

    win['LsyStorage'] = new LsyStorage();
    win['LsySession'] = new LsySession();
    win['LsyCookie'] = new LsyCookie();
})(window, document);
