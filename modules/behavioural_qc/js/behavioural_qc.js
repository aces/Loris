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
    var instrument_dropdown_value = instrument_dropdown.value;
    if (instrument_dropdown_value != undefined) {
        instrument_dropdown_value = instrument_dropdown_value.replace(/\+/g,' ');
    }
    request = $.ajax({
	url: loris.BaseURL + "/behavioural_qc/ajax/GetInstruments.php",
	type: "get",
	data: {"visit_label" : visit_label_value},
	success: function(data){
	    //Removing previous options from instrument dropdown. 
	    $("#instrument > option").remove();
	    var $instrument_dropdown = $('#instrument');
	    for (var i = 0; i < data.length; i++){
		$instrument_dropdown.append(new Option(data[i], data[i]));
            if(data[i]== instrument_dropdown_value) {
                $('#instrument').val(data[i]);
            }
	    }
	},
        error: function (xhr, desc, err){
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }	
    });
}

//runs the function when the page is loaded..
$(function() {
    changefieldOptions();
});

$(document).ready(function() {

   
    //Auto completion for candidate ids. 
    $('#autocomplete-ajax').devbridgeAutocomplete({
	serviceUrl: loris.BaseURL + "/behavioural_qc/ajax/GetCandidates.php",
	params:{
	    'instrument': function(){
		return $("#instrument").val();
	    }
	},
	onSelect: function (suggestion) {
	    $('#selction-ajax').html('You selected: ' + suggestion.value);
        },
        onHint: function (hint) {
            $('#autocomplete-ajax-x').val(hint);
        },
        onInvalidateSelection: function() {
            $('#selction-ajax').html('You selected: none');
        }            
    }); 
    
    //todo: Add this functionality on right click. 
    $("[name=bvl_feedback]").click(function(e) {

	var $test_name = $(this).data("test_name");
	var $candID = $(this).data("candid");
	var $sessionID = $(this).data("sessionid");
	var $commentID = $(this).data("commentid");
	
	var instrument_window = window.open(loris.BaseURL + "/" + $candID + "/" + $sessionID + "/" + $test_name + "/"
					    + "&commentID=" + $commentID);
	$(instrument_window.document).ready(function (e){
	    var $navbar_toggle = $(instrument_window.document).contents().find("#feedback_toggle");
	});

    });
    
});
