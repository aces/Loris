/*global document: false, $: false, window: false, unescape: false, Option: false,isElementsSet*/


function isElementSet() {
    "use strict";
    var set = 0,
        options = $('.advancedOptions option:selected'),  ///get all the selected dropdowns for the TR with the ID advancedOptions
        texts = $('.advancedOptions input[type=text]');
    ///brows through the selected dropdowns
    ///if any of the dropdown is not equal to 'All' then set the variable set to true
    options.each(function () {
        var value = $(this).text();
        if (value !== 'All') {
            set = 1;
            return;
        }
    });
    //browse though the text elements
    ///if any of the text element is not empty then set the variable set to true
    texts.each(function () {
        var value = $(this).val();
        if (value !== '') {
            set = 1;
            return;
        }
    });
    return set;
}

function showAdvancedOptionsCheck() {

    "use strict";
    var els = $('.advancedOptions'),///get all the TR elements with the ID advancedOptions
        set = isElementSet();
    if (set) {
        els.show();
        $("#advanced-buttons").hide();
    } else {
        els.hide();
    }
}

$(function () {
    "use strict";
    showAdvancedOptionsCheck();
});