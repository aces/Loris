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

$(document).ready(function() {

    //basic plugin us

    $('#autocomplete-ajax').devbridgeAutocomplete({
	serviceUrl: "AjaxHelper.php?Module=data_team_helper&script=GetCandidates.php",
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
	
	var instrument_window = window.open("main.php?test_name=" + $test_name + "&sessionID=" + $sessionID + "&candID=" + $candID
					    + "&commentID=" + $commentID);
	$(instrument_window.document).ready(function (e){
	    var $navbar_toggle = $(instrument_window.document).contents().find("#feedback_toggle");
	});

	

    });
    
    // http will only get applied on a POST, so
    // on click we need to fake a form which posts
    // to the conflict_resolver in order to get filters
    $(".conflict_resolver_link").click(function(e) {
        e.preventDefault();
        var form = $('<form />', {
            "action" : "main.php?test_name=conflict_resolver",
            "method" : "post"
        });

        form.attr('target', '_blank');
        var values = {
            "reset" : "true",
            "PSCID" : this.dataset.pscid,
            "Instrument"    : this.dataset.instrument,
            "Question"    : this.dataset.question,
            "visit"    : this.dataset.visits,
            "test_name"    : "conflict_resolver",
            "filter" : "Show Data"
        };

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
