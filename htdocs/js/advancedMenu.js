/*global document: false, $: false, window: false, unescape: false, Option: false,isElementsSet*/

function toggleMe(a, b) {
    "use strict";
    var set = isElementsSet(),
        rows = document.getElementsByName(a),
        selector = document.getElementById(b),
        i;
    if (selector.style.display === "none") {
        selector.style.display = "table-cell";
    } else {
        selector.style.display = "none";
    }
    for (i = 0; i < rows.length; i += 1) {
        if (!rows[i]) {
            return true;
        }
        if ((rows[i].style.display === "none") || (set === 1)) {
            rows[i].style.display = "table-row";
            $('#selector').css("display", "none");
        } else {
            rows[i].style.display = "none";
        }
    }
}

function showAdvancedOptionsCheck() {

    "use strict";
    var els = $('tr[ID=advancedOptions]'),///get all the TR elements with the ID advancedOptions
        set = isElementsSet();
    ///if the set is true, then keep style display as table-row
    if (set) {
        els.each(function () {
            $(this).css("display", "table-row");
            $('#selector').css("display", "none");
        });
    } else {
        $(this).css("display", "none");
    }
}

function isElementsSet() {
    "use strict";
    var set = 0,
        options = $('tr[ID=advancedOptions] option:selected'),  ///get all the selected dropdowns for the TR with the ID advancedOptions
        texts = $('tr[ID=advancedOptions] input[type=text]');
    ///brows through the selected dropdowns
    ///if any of the dropdown is not equal to 'All' then set the variable set to true
    options.each(function () {
        var value = $(this).text();
        if (value !== 'All') {
            set = 1;
            return false;
        }
    });
    //browse though the text elements
    ///if any of the text element is not empty then set the variable set to true
    texts.each(function () {
        var value = $(this).val();
        if (value !== '') {
            set = 1;
            return false;
        }
    });
    return set;
}

$(function () {
    "use strict";
    showAdvancedOptionsCheck();
});