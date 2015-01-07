/*global document, $, window*/
$(document).ready(function () {
    "use strict";
    var callback = function (extraparam) {
        return function () {
            var checked = $("input.mripanel:checkbox:checked"), i,
                FileIDs = [];
            console.log(checked);

            if (extraparam === undefined) {
                extraparam = '';
            }

            for (i = 0; i < checked.length; i += 1) {
                console.log(checked[i]);
                FileIDs.push(checked[i].dataset.fileId);

            }
            console.log(FileIDs);

            w = window.open("main.php?test_name=brainbrowser&minc_id=[" + FileIDs + "]" + extraparam);
            w.focus();
        };
    };
    $("#bboverlay").click(callback("&overlay=true"));
    $("#bbonly").click(callback());
});
