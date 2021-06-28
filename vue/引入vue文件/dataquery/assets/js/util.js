"use strict";

Array.prototype.contains = function(obj) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
};
Array.prototype.remove = function(obj) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] == obj) {
            this.splice(i, 1);
        }
    }
};

function clone(obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(clone(obj[i]));
                }
            } else {
                o = {};
                for ( var j in obj) {
                    o[j] = clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

function href(url) {
    var base = document.getElementsByTagName('base');
    if (base.length > 0) {
        location.href = base[0].href + url;
    } else {
        location.href = url;
    }
}