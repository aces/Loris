"use strict";
var User = function () {
    var username, that;

    return {
        getUsername: function () {
            return username;
        },
        login: function (user, pass) {
            var ajaxOptions = {
                type: "POST",
                url: "/_session",
                data: { "name" : user, "password" : pass }
            };
            that = this;
            that._attemptedUsername = user;

            ajaxOptions.success = that._onLoginSuccess;
            ajaxOptions.error = that._onLoginFailure;

            /*
            if(that._cookieLogin !== true) {
                ajaxOptions.statusCode = {
                    401: that._onLoginFailure
                };
            }
            */
            $.ajax(ajaxOptions);
        },

        _cookieLogin : function (uname) {
            that = this;
            that._attemptedUsername = uname;
            that._cookieLogin = true;
            that._onLoginSuccess();
        },
        _onLoginSuccess : function () {
            var error = document.getElementById("loginerror"),
            div = document.getElementById("username");
            error.textContent = '';
            username = that._attemptedUsername;
            div.textContent = username;
            $(".section").hide();
            $("#logged_in").show();
            that.getSavedQueries();
            Categories.list("categories");
            Categories.list("categories_pop");
            that.loadConfigOptions();
        },
        _onLoginFailure : function () {
            var error = document.getElementById("loginerror");

            if (that) {
                that._attemptedUsername = undefined;
                that._cookieLogin = false;
            }
            error.textContent = 'Invalid username or password';
        },

        logout: function () {
            that = this;
            username = undefined;

            that._explicitLogout = true;
            if (that) {
                that._attemptedUsername = undefined;
                that._cookieLogin = false;
            }
            
            $(".section").hide();
            $("#logged_out").show();
            $.ajax({
                type: "DELETE",
                url:  "/_session",
                dataType: "json",
                username : "_",
                password : "_",
                success: function () { },
                error:   function () { }
            });
        },

        getSavedQueries: function () {
            var options = {
                type: "GET",
                url: "_view/savedqueries",
                dataType: "json",
                success: function (data) {
                    var arr = data.rows.map(function (el) {
                        return el.doc;
                    });
                    that._loadSavedQueries(arr);
                },
                data: {
                    key: JSON.stringify(that.getUsername()),
                    reduce: false,
                    include_docs: true
                }
            };
            $.ajax(options);
        },
        loadConfigOptions: function () {
            var options = {
                type: "GET",
                url: "_view/serverconfig",
                dataType: "json",
                success: function (data) {
                    var rows = data.rows, i;
                    for(i = 0; i < rows.length; i += 1) {
                        window.handleConfig(rows[i].key, rows[i].value);
                    }
                },
                data: {
                    reduce: false,
                    include_docs: false
                }
            };
            $.ajax(options);

        },
        _loadSavedQueries: function(queries_json) {
            // This is overwritten by ui.js. It should
            // maybe be a callback parameter to getSavedQueries
            // instead of an object method.
        }
    };
};
