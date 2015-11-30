var LorisHelper = function(configParams, userPerms) {
    "use strict";
    var lorisObj = configParams;
    lorisObj.loadFilteredMenu = function(module, filters) {
        "use strict";
        console.log("Not yet implemented");
        return;
    }
    lorisObj.getCookie = function(c_name) {
        "use strict";
        var cookies = document.cookie.split("; "),
            i,
            cookie;
        for (i = 0; i < cookies.length; i += 1) {
            cookie = cookies[i].split("=");
            if (cookie[0] === c_name) {
                return cookie[1];
            }
        }
        return undefined;
    };
    lorisObj.userHasPermission = function(permname) {
        "use strict";
        if(userPerms.indexOf(permname) >= 0 || userPerms.indexOf("superuser") >= 0) {
            return true;
        }
        return false;
    }
    return lorisObj;
};

