var LorisHelper = function(configParams, userPerms) {
    "use strict";
    var lorisObj = configParams;

    // Filters will only get applied on a POST, so
    // on click we need to fake a form which posts
    // to the module in order to get filters applied
    // when there's a link to a filtered menu
    lorisObj.loadFilteredMenuClickHandler = function(module, filters) {
        return function(e) {
            e.preventDefault();
            var form = $('<form />', {
                "action" : configParams.BaseURL + "/main.php?test_name=" + module,
                "method" : "post"
            }); 
            var values = filters;
            filters.reset = "true";
            filters.filter = "Show Data";

            $.each(values, function(name, value) {
                $("<input />", {
                    type: 'hidden',
                    name: name,
                    value: value
                }).appendTo(form);
            }); 

            form.appendTo('body').submit();
        }; 
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
