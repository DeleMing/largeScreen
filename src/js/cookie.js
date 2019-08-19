
function cookie() {

    //增加
    this.setCookie = function (name, value, day) {
        var expires = new Date();
        expires.setTime(expires.getTime() + day * 24 * 60 * 60 * 1000);  //以分钟为单位
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
    }

    //获取
    this.getCookieValue = function (name) {
        //读cookie属性，这将返回文档的所有cookie
        var allcookies = document.cookie;
        //查找名为name的cookie的开始位置
        name += "=";
        var pos = allcookies.indexOf(name);
        //如果找到了具有该名字的cookie，那么提取并使用它的值
        if (pos != -1) {                       //如果pos值为-1则说明搜索"version="失败
            var start = pos + name.length;         //cookie值开始的位置
            var end = allcookies.indexOf(";", start);    //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
            if (end == -1) end = allcookies.length;    //如果end值为-1说明cookie列表里只有一个cookie
            var value = allcookies.substring(start, end); //提取cookie的值
            return (value);
        }
        else return "";
    }

    //删除cookie
    this.deleteCookie = function (name, path) {
        var expires = new Date(0);
        path = path == "" ? "" : ";path=" + path;
        document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
    }


}