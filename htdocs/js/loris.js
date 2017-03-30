/* exported LorisHelper */

var LorisHelper = function(configParams, userPerms, studyParams) {
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
        action: configParams.BaseURL + "/" + module,
        method: "post"
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
  };
  lorisObj.getCookie = function(cName) {
    "use strict";
    var cookies = document.cookie.split("; ");
    var i;
    var cookie;

    for (i = 0; i < cookies.length; i += 1) {
      cookie = cookies[i].split("=");
      if (cookie[0] === cName) {
        return cookie[1];
      }
    }
    return undefined;
  };
  lorisObj.userHasPermission = function(permname) {
    "use strict";
    if (userPerms.indexOf(permname) >= 0 ||
      userPerms.indexOf("superuser") >= 0
    ) {
      return true;
    }
    return false;
  };

  lorisObj.debounce = function(fn, delay) {
    var timer = null;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  };

    // Returns config settings from whitelist passed in main.php (study options)
  lorisObj.config = function(param) {
    "use strict";
    return studyParams[param];
  };
  return lorisObj;
};
