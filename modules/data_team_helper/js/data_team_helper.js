function getQueryVariable(variable) 
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return unescape(pair[1]);
        }
    }
}

function changefieldOptions() 
{
    changeVisitLabels();
}

function changeVisitLabels() 
{
    //get the value for the visit selected
    var instrument_dropdown = document.getElementById('instrument');
    var visit_label_dropdown = document.getElementById('visit_label');
    var visit_label_value = visit_label_dropdown.value;
    request = getQueryVariable("visit_label");
    instrument_dropdown_value = getQueryVariable("instrument");
    if (instrument_dropdown_value != undefined) {
        var instrument_dropdown_value = instrument_dropdown_value.replace(/\+/g,' ');
    }
    $.get("AjaxHelper.php?Module=data_team_helper&script=GetInstruments.php&visit_label=" + visit_label_value ,
            function(data) 
            {
                instruments = data.split("\n");
                instrument_dropdown.options.length = 0;
                var i, numInstruments = instruments.length, val, selected = "";
                for (i=0;i<numInstruments;i++) {
                    val = instruments[i];
                    if(val !='') {
                        instrument_dropdown.options[i] = new Option(val,val);
                        if ((val==instrument_dropdown_value) && (instrument_dropdown_value!= undefined)) {
                            instrument_dropdown.options[i].selected = "selected";
                        }
                   }
                }
            }
    );
}

//runs the function when the page is loaded..
$(function() {
     changefieldOptions();
 });
