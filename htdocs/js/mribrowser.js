/*global document, $, window*/
$(document).ready(function () {
    "use strict";
    var callback = function (extraparam) {
        return function () {
            var checked = $("input.mripanel:checkbox:checked"), i,
                FileIDs = [];
            console.log(checked);

            for (i = 0; i < checked.length; i += 1) {
                console.log(checked[i]);
                FileIDs.push(checked[i].dataset.fileId);

            }
            console.log(FileIDs);

            window.open("minc.html?minc_id=[" + FileIDs + "]" + extraparam);
        };
    };
    $("#bboverlay").click(callback("&overlay=true"));
    $("#bbonly").click(callback());
});
