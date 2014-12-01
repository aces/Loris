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
    $(".advancedOptions").toggle();
    $(".advanced-buttons").toggle();
}

$(function(){
	$('input[name=dob]').datepicker({
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true
	});
});

$(document).ready(function() {
    // Filters will only get applied on a POST, so
    // on click we need to fake a form which posts
    // to the imaging_browser in order to get filters
    $(".scanDoneLink").click(function(e) {
        e.preventDefault();
        var form = $('<form />', {
            "action" : "main.php?test_name=imaging_browser",
            "method" : "post"
        });
        var values = {
            "reset" : "true",
            "pscid" : this.dataset.pscid,
            "filter" : "Show Data"
        }

        $.each(values, function(name, value) {
            $("<input />", {
                type: 'hidden',
                name: name,
                value: value
            }).appendTo(form);
        });

        form.appendTo('body').submit();
    });
});
