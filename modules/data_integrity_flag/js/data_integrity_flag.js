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

function changeVisitLabels() {
    "use strict";
    //get the value for the visit selected
    var instrument_dropdown = document.getElementById('instrument'),
        visit_label_dropdown = document.getElementById('visit_label'),
        visit_label_value = visit_label_dropdown.value,
        request = getQueryVariable("visit_label"),
        instrument_dropdown_value,
        temp_array = ["All Instruments"],
        instruments;
    if ($.trim(visit_label_value) === 'All Visits') {visit_label_value = ''; }
    if (request !== undefined) {
        request = request.replace(/\+/g, ' ');
    }
    instrument_dropdown_value = getQueryVariable("instrument");
    if (instrument_dropdown_value !== undefined) {
        instrument_dropdown_value = instrument_dropdown_value.replace(/\+/g, ' ');
    }
    $.get("AjaxHelper.php?Module=data_team_helper&script=GetInstruments.php&visit_label=" + visit_label_value,
        function (data) {
            instruments = data.split("\n");
            instruments = temp_array.concat(instruments); //adds 'All instruments to the array'
            instrument_dropdown.options.length = 0;
            var i, numInstruments = instruments.length, val;
            for (i = 0; i < numInstruments; i += 1) {
                val = instruments[i];
                if (val !== '') {
                    instrument_dropdown.options[i] = new Option(val, val);
                    if ((instrument_dropdown_value === val) && (instrument_dropdown_value !== '')) {
                        instrument_dropdown.options[i].selected = "selected";
                    }
                }
            }
            //jQuery('#visits').change();
        });
}


//runs the function when the page is loaded..
$(function () {
    "use strict";
    changeVisitLabels();
    $('#instrument,#visit_label,#users').bind('change', function () { $("#filter").trigger('click'); }); //The form is automatically loaded when the instrument dropdown is changed
    $('#update_data').bind('change', function () { $("#filter").trigger('click'); }); //The form is automatically loaded when the dropdown is changed
});

