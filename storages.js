/* *
 *      storages-1.2.4.js
 *      author loushengyue
 *      website http://www.loushengyue.com
 */

;(function (win, doc) {
    var Storages, LsyCookie, LsyStorage, LsySession, expiresTime = 24 * 3600, version = '1.2.4';
    /* *
     *      The constructor of Storages
     */
    Storages = function () {
        this.version = 'Storages ' + version;
    };
    /* *
     *      setItem by keys and values
     *      keys       typeof Array
     *      values     typeof values
     */
    Storages.prototype.setList = function (keys, values) {
        checkLength(keys, values);
        for (var i = 0, n = keys.length; i < n; i++) {
            this.setItem(keys[i], values[i]);
        }
    };
    /* *
     *      setItem by prex and arr
     *      prex       typeof String
     *      arr        typeof Array
     */
    Storages.prototype.setArr = function (prex, arr, byId) {
        if (isArray(arr)) {
            var key, i = 0, n = arr.length;
            if (!byId) {
                for (; i < n; i++) {
                    key = prex + '_' + i;
                    this.setItem(key, arr[i]);
                }
            } else {
                for (; i < n; i++) {
                    hasIdProperty(arr[i]);
                    key = prex + '_' + arr[i].id;
                    this.setItem(key, arr[i]);
                }
            }
        } else {
            this.setItem(prex, arr);
        }
    };
    /* *
     *      getItems By Keys
     *      keys        typeof Array
     */
    Storages.prototype.getItemsByKeys = function (keys) {
        var _this = this;
        var arr = [];
        if (isArray(keys)) {
            keys = sortKeys(keys);
            keys.forEach(function (key) {
                arr.push(_this.getItem(key));
            });
        } else {
            arr.push(_this.getItem(keys));
        }
        return arr;
    };
    /* *
     *      remove items by prex.
     *      prex    typeof String
     */
    Storages.prototype.removeArr = function (prex) {
        var keys = this.getKeysByPrex(prex), _this = this;
        keys.forEach(function (key) {
            _this.removeItem(key);
        });
    };
    /* *
     *      get some strorages from localStroage.
     *      prex       typeof String
     *      return     typeof Array
     */
    Storages.prototype.getArr = function (prex) {
        var keys = this.getKeysByPrex(prex), arr;
        arr = this.getItemsByKeys(keys);
        return arr;
    };
    /* *
     *  ----------------------------------------------------------------------
     */
    LsyStorage = function () {
        this.version = 'LsyStorage ' + version;
    };
    /* *
     *      class LsyCookie extends Storages
     */
    LsyStorage.prototype = Object.create(Storages.prototype);
    LsyStorage.prototype.constructor = LsyStorage;
    /* *
     *      Clear localStorage.
     */
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
        return resetJsonStr(win.localStorage.getItem(key));
    };
    /* *
     *      Set item by key and val.
     *      key      typeof  String
     *      val      typeof  String
     */
    LsyStorage.prototype.setItem = function (key, val) {
        checkStr(key);
        val = resetVal(val);
        win.localStorage.setItem(key, val);
    };
    /* *
     *      get keys from localStroage.
     *      prex       typeof String
     *      return     typeof Array
     */
    LsyStorage.prototype.getKeysByPrex = function (prex) {
        var keys = Object.keys(win.localStorage);
        keys = filterKeysByReg(keys, prex);
        return keys;
    };
    /* *
     *  ----------------------------------------------------------------------
     */
    LsySession = function () {
        this.version = 'LsySession ' + version;
    };
    /* *
     *      class LsyCookie extends Storages
     */
    LsySession.prototype = Object.create(Storages.prototype);
    LsySession.prototype.constructor = LsySession;
    /* *
     *      Clear sessionStorage.
     */
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
        return resetJsonStr(win.sessionStorage.getItem(key));
    };
    /* *
     *      Set item by key and val.
     *      key      typeof  String
     *      val      typeof  String
     */
    LsySession.prototype.setItem = function (key, val) {
        checkStr(key);
        val = resetVal(val);
        win.sessionStorage.setItem(key, val);
    };
    /* *
     *      get keys from sessionStorage.
     *      prex       typeof String
     *      return     typeof Array
     */
    LsySession.prototype.getKeysByPrex = function (prex) {
        var keys = Object.keys(win.sessionStorage);
        keys = filterKeysByReg(keys, prex);
        return keys;
    };
    /* *
     *  ----------------------------------------------------------------------
     */
    LsyCookie = function () {
        this.version = 'LsyCookie ' + version;
    };
    /* *
     *      class LsyCookie extends Storages
     */
    LsyCookie.prototype = Object.create(Storages.prototype);
    LsyCookie.prototype.constructor = LsyCookie;
    /* *
     *      create cookie by key and value, and set expires time
     *      key     typeof string
     *      val     typeof string
     *      path    typeof string
     *      time    typeof number[7days]
     */
    LsyCookie.prototype.setItem = function (key, val, time, path) {
        var exp, pathStr = '';
        checkStr(key);
        val = resetVal(val);
        time = resetTime(time);
        exp = new Date();
        exp.setTime(exp.getTime() + time * 1000);
        if (path) {
            checkStr(path);
            path = resetPath(path);
            pathStr = path ? ';path=' + path : pathStr;
        }
        doc.cookie = key + '=' + val + ';expires=' + exp.toGMTString() + pathStr;
    };
    /* *
     *      this is a method of abandonment
     */
    LsyCookie.prototype.set = function (key, val, time, path) {
        this.setItem(key, val, time, path);
    };
    /* *
     *      remove cookie by key
     *      key typeof string
     */
    LsyCookie.prototype.removeItem = function (key, path) {
	path = path ? path : './';    
        this.set(key, '', -1, path);
    };
    /* *
     *      remove all cookies
     */
    LsyCookie.prototype.clear = function () {
        var _this = this;
        var keys = Object.keys(_this.getAll());
        keys.forEach(function (item) {
            _this.removeItem(item);
        });
    };
    /* *
     *      this is a method of abandonment
     */
    LsyCookie.prototype.clearAll = function () {
        this.clear();
    };
    /* *
     *      get all cookies, and return object
     */
    LsyCookie.prototype.getAll = function () {
        var cookies = doc.cookie.split(/;\s/);
        var cookieObj = {};
        cookies.forEach(function (item) {
            var key = item.split('=')[0];
            var val = item.split('=')[1];
            val = resetJsonStr(val);
            cookieObj[key] = val;
        });
        return cookieObj;
    };
    /* *
     *      get cookie by key
     *      key typeof string
     */
    LsyCookie.prototype.getItem = function (key) {
        return this.getAll()[key];
    };
    /* *
     *      this is a method of abandonment
     */
    LsyCookie.prototype.get = function (key) {
        return this.getAll()[key];
    };
    /* *
     *      reset expires time
     *      time     typeof number[7days]
     */
    function resetTime(time) {
        if (time != null) {
            if (isNaN(time)) {
                throw new Error('The typeof time argument in resetTime(time){...} must be number. But the typeof your argument "' + time + '" is ' + typeof time);
            }
            time = time > 0 ? time : -1;
        } else {
            time = expiresTime;
        }
        return time;
    }

    /* *
     *      ckeck the length of keyArr and valArr, if them are not eq, return false.
     *      keyArr     typeof Array
     *      valArr     typeof Array
     *      return     typeof boolean
     */
    function checkLength(keys, values) {
        if (keys.length != values.length) {
            throw new Error('The length of keys and values in setList(keys, values) need eq. The keys.length=' + keys.length + ', but values.length=' + values.length);
        }
    }

    /* *
     *      ckeck val is the right typeof string, if not, change it.
     *      val     typeof String,Array,Object
     *      return  typeof string
     */
    function resetVal(val) {
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        return val;
    }

    /* *
     *      ckeck key is the right typeof string, if not, change it.
     *      val     typeof String,Array,Object
     *      return  typeof string
     */
    function checkStr(key) {
        if (typeof key != 'string') {
            throw new Error('The typeof str argument in setItem(key[string],value[string|object]){...} must be string. But the typeof your argument "' + key + '" is ' + typeof key);
        }
    }

    /* *
     *      reset string for json.
     *      return     typeof String,Array,Object
     */
    function resetJsonStr(str) {
        var obj;
        try {
            obj = JSON.parse(str);
            return obj;
        } catch (e) {
            return str;
        }
    }

    /* *
     *      ckeck the typeof arr.
     *      arr        typeof Object,String,Array
     *      return     typeof boolean
     */
    function isArray(arr) {
        return arr instanceof Array;
    }

    /* *
     *      ckeck obj has id property.
     *      obj        typeof Object,String,Array
     */
    function hasIdProperty(obj) {
        if (typeof obj !== 'object') {
            throw new Error('The obj augument in hasIdProperty(obj){...} is not object');
        }
        if (!obj.hasOwnProperty('id')) {
            throw new Error('This Object of ' + obj + ' has not id property.');
        }
    }

    /* *
     *      sortKeys by index of keys
     *      keys       typeof String
     */
    function sortKeys(keys) {
        if (!keys instanceof Array) {
            return false;
        }
        try {
            keys.sort(function (a, b) {
                a = Number(a.match(/_\d+$/)[0].substr(1));
                b = Number(b.match(/_\d+$/)[0].substr(1));
                return a - b;
            });
            return keys;
        } catch (e) {
            return keys;
        }
    }

    /* *
     *      filterKeys by RegExp
     *      reg       typeof String
     *      keys        typeof Array
     */
    function filterKeysByReg(keys, prex) {
        var arr = [];
        var reg = new RegExp(prex);
        keys.forEach(function (key) {
            var res = reg.exec(key);
            if (res && res.index === 0) {
                arr.push(key);
            }
        });
        return arr;
    }

    /* *
     *      reset path
     *      path typeof string
     */
    function resetPath(path) {
        if (/^(\.)?\.\//.test(path)) {
            var timesArr, n,
                index = -1,
                pathName = location.pathname;
            path = path.replace(/^\.\//, '');
            timesArr = path.match(/\.\.\//g) || [];
            n = timesArr.length + 1;
            for (; n--;) {
                index = pathName.lastIndexOf('/');
                if (index != -1) {
                    pathName = pathName.substr(0, index);
                }
            }
            path = path.replace(/\.\.\//g, '');
            return pathName + '/' + path;
        }
        return path;
    }

    win['LsyStorage'] = new LsyStorage();
    win['LsySession'] = new LsySession();
    win['LsyCookie'] = new LsyCookie();
})(window, document);
