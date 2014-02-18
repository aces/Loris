/*global window, BrainBrowser, unescape, $*/
function getQueryVariable(variable) {
    "use strict";
    var query = window.location.search.substring(1),
        vars = query.split("&"),
        i,
        pair;
    for (i = 0; i < vars.length; i += 1) {
        pair = vars[i].split("=");
        if (pair[0] === variable) {
            return unescape(pair[1]);
        }
    }
}

BrainBrowser.VolumeViewer.start("brainbrowser", function (viewer) {
    "use strict";
    var link, minc_ids, minc_ids_arr, minc_volumes = [], i,
        bboptions = {};

    viewer.addEventListener("ready", function () {
        $(".button").button();
    });

    link = window.location.search;

    minc_ids = getQueryVariable("minc_id");
    if (minc_ids[0] === '[') {
        // An array was passed. Get rid of the brackets and then split on ","
        minc_ids = minc_ids.substring(1, minc_ids.length - 1);
        minc_ids_arr = minc_ids.split(",");

    } else {
        // Only one passed
        minc_ids_arr = [minc_ids];
    }

    for (i = 0; i < minc_ids_arr.length; i += 1) {
        minc_volumes.push({
            type: 'minc',
            header_url: "minc.php?minc_id=" + minc_ids_arr[i] + "&minc_headers=true",
            raw_data_url: "minc.php?minc_id=" + minc_ids_arr[i] + "&raw_data=true",
        });
    }

    if (getQueryVariable("overlay") === "true") {
        bboptions.overlay = true;
    }

    bboptions.volumes = minc_volumes;

    viewer.loadVolumes(bboptions);
});
