/* exported LorisHelper */

let LorisHelper = function(configParams, userPerms, studyParams) {
  'use strict';
  let lorisObj = configParams;

    // Filters will only get applied on a POST, so
    // on click we need to fake a form which posts
    // to the module in order to get filters applied
    // when there's a link to a filtered menu
  lorisObj.loadFilteredMenuClickHandler = function(module, filters) {
    return function(e) {
      e.preventDefault();
      let form = $('<form />', {
        action: configParams.BaseURL + '/' + module,
        method: 'post',
      });
      let values = filters;
      filters.reset = 'true';
      filters.filter = 'Show Data';

      $.each(values, function(name, value) {
        $('<input />', {
          type: 'hidden',
          name: name,
          value: value,
        }).appendTo(form);
      });

      form.appendTo('body').submit();
    };
  };
  lorisObj.getCookie = function(cName) {
    'use strict';
    let cookies = document.cookie.split('; ');
    let i;
    let cookie;

    for (i = 0; i < cookies.length; i += 1) {
      cookie = cookies[i].split('=');
      if (cookie[0] === cName) {
        return cookie[1];
      }
    }
    return undefined;
  };
  lorisObj.userHasPermission = function(permname) {
    'use strict';
    if (userPerms.indexOf(permname) >= 0 ||
      userPerms.indexOf('superuser') >= 0
    ) {
      return true;
    }
    return false;
  };

  lorisObj.debounce = function(fn, delay) {
    let timer = null;
    return function() {
      let context = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  };

    // Returns config settings from whitelist passed in main.php (study options)
  lorisObj.config = function(param) {
    'use strict';
    return studyParams[param];
  };
  return lorisObj;
};
