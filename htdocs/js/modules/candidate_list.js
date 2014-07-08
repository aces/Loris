/*global document: false, $: false, window: false, unescape: false, Option: false,isElementsSet, alert*/

function checkAccessProfileForm() {
    'use strict';
    var form = document.accessProfileForm;
    if (form.candID.value === "") {
        alert("You must enter a DCC-ID");
        form.candID.focus();
        return false;
    }
    if (form.PSCID.value === "") {
        alert("You must enter a PSCID");
        form.PSCID.focus();
        return false;
    }
    return true;
}
function hideFilter() {
    'use strict';
    $("#panel-body").toggle();
    $("#down").toggle();
    $("#up").toggle();
}
function toggleMe() {
    "use strict";
    $("#advanced-label").toggle();
    $("#advanced-options").toggle();
    $("#advanced-buttons").toggle();
}

$(function () {
    'use strict';
    $('input[name=dob]').datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true
    });
});