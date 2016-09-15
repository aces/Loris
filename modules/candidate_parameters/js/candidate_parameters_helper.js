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
    if (document.getElementById('pscid') !== undefined) {
        var pscid = document.getElementById('pscid'),
            pscid_value = pscid.textContent.replace(/ /g,''),
            default_vals;
        $.get(loris.BaseURL + "/candidate_parameters/ajax/GetParticipant_suboptions.php?pscid=" + pscid_value,
                function (data) {
                default_vals = data.split(";");
                $('#participant_statusID').val(default_vals[0]);
                if (default_vals.length > 1) {
                    loadDefaultSubOption(default_vals[0], default_vals[1]);
                }
            });
    }
}
function loadDefaultSubOption(defaultPstat, defaultPstat_sub) {
    "use strict";
    var pstatus_sub = document.getElementById('participant_suboptions'),
        options,
        dropdown_value = defaultPstat_sub;
    $.get(loris.BaseURL + "/candidate_parameters/ajax/GetParticipant_suboptions.php?p_status=" + defaultPstat,
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
            $('#participant_suboptions').val(dropdown_value);

            //jQuery('#visits').change();
        });
}
function changeParticipantStatus() {
    "use strict";
    //get the value for the visit selected
    var pstatus_sub = document.getElementById('participant_suboptions'),
        pstatus_dropdown = document.getElementById('participant_status'),
        pscid = document.getElementById('pscid'),
        pscid_value = pscid.value,
        status_value = pstatus_dropdown.value,
        options,
        dropdown_value;
    dropdown_value = getQueryVariable("participant_suboptions");
    if (dropdown_value !== undefined) {
                dropdown_value = dropdown_value.replace(/\+/g, ' ');
    }
    $.get(loris.BaseURL + "/candidate_parameters/ajax/GetParticipant_suboptions.php?p_status=" + status_value+"&pscid="+pscid_value,
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
           });
}
function checkStatusAndOptions() {
    "use strict";
    //get the value for the visit selected
    var pstatus_dropdown = document.getElementById('participant_status'); 
    var pstatus_sub = document.getElementById('participant_suboptions');

    if (pstatus_dropdown && pstatus_dropdown.options[pstatus_dropdown.selectedIndex].text == 'Inactive' && pstatus_sub.options[pstatus_sub.selectedIndex].text == '') {
        $('input[type="submit"]').prop('disabled', true);
    } else {
        $('input[type="submit"]').prop('disabled', false);
    }
}
//runs the function when the page is loaded..
$(function () {
    "use strict";
    loadDefaultStatus();
    $("#participant_status").change(function() {
        changeParticipantStatus();
        checkStatusAndOptions();
    });
    $("#participant_suboptions").change(function() {
        checkStatusAndOptions();
    });
    checkStatusAndOptions();
});


