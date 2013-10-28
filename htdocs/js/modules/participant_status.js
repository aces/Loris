/*global document: false, $: false, window: false, unescape: false, Option: false*/
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
function loadDefaultStatus() {
    "use strict";
    var pscid = document.getElementById('pscid'),
        pscid_value = pscid.textContent,
        pstatus_dropdown = document.getElementById('participant_statusID'),
        status_value = pstatus_dropdown.value,
        default_vals;

    $.get("GetParticipant_suboptions.php?pscid="+pscid_value,
            function (data) {
                default_vals = data.split(";");
                pstatus_dropdown.value = default_vals[0];
                if(default_vals.length >1) {
                    loadDefaultSubOption(default_vals[0], default_vals[1]);
                }
                });
}
function loadDefaultSubOption(defaultPstat, defaultPstat_sub) {
    "use strict";    
    var pstatus_sub = document.getElementById('participant_subOptions'),
        pstatus_dropdown = document.getElementById('participant_statusID'),
        status_value = pstatus_dropdown.value,
        options,
        dropdown_value = defaultPstat_sub;
    $.get("GetParticipant_suboptions.php?p_status=" + defaultPstat,
            function (data) {
            options = data.split("\n");

            pstatus_sub.options.length = 0;
            var i, numOptions = options.length, val;
            for (i = 0; i < numOptions; i += 1) {
            val = options[i];
            if (val !== '') {
            pstatus_sub.options[i] = new Option(val, val);
            if ((dropdown_value === val) && (dropdown_value !== '')) {
            pstatus_sub.options[i].selected = "selected";
            }
            }
            }
            //jQuery('#visits').change();
            }); 
}
function changeParticipantStatus() {
    "use strict";
    //get the value for the visit selected
    var pstatus_sub = document.getElementById('participant_subOptions'),
        pstatus_dropdown = document.getElementById('participant_statusID'),
        pscid = document.getElementById('pscid'),
        pscid_value = pscid.value,
        status_value = pstatus_dropdown.value,
        options,
        dropdown_value;
    dropdown_value = getQueryVariable("participant_subOptions");
    if (dropdown_value !== undefined) {
                dropdown_value = dropdown_value.replace(/\+/g, ' ');
    }
    $.get("GetParticipant_suboptions.php?p_status=" + status_value+"&pscid="+pscid_value,
            function (data) {
            options = data.split("\n");

            pstatus_sub.options.length = 0;
            var i, numOptions = options.length, val;
            for (i = 0; i < numOptions; i += 1) {
            val = options[i];
            if (val !== '') {
            pstatus_sub.options[i] = new Option(val, val);
            if ((dropdown_value === val) && (dropdown_value !== '')) {
            pstatus_sub.options[i].selected = "selected";
            }
            }
            }
            //jQuery('#visits').change();
            });
}
/*
//runs the function when the page is loaded..
$(function () {
    "use strict";
    changeParticipantStatus();
            $('#participant_subOptions,#participant_statusID,#users').bind('change', function () { $("#filter").trigger('click'); }); //The form is automatically loaded when the instrument dropdown is changed
            $('#update_data').bind('change', function () { $("#filter").trigger('click'); }); //The form is automatically loaded when the dropdown is changed
            });
*/

