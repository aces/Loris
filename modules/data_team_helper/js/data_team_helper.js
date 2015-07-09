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
	
        // Initialize ajax autocomplete, called devbridge autocomplete (because jquery ui has autocomplete func)
    // $('#autocomplete-ajax').devbridgeAutocomplete({
    //     serviceUrl: "AjaxHelper.php?Module=data_team_helper&script=GetCandidates.php",
    // 	dataType: "jsonp",
    // 	params: {
    // 	    'instrument': function(){
    // 		return $("#instrument").val();
    // 	    }
    // 	},
    //     //lookup: countriesArray,
    // 	onSearchComplete: function(query, suggestion){
    // 	    console.log("search complete");
    // 	    console.log(suggestion);
    // 	},
    //     lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
    //         var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
    //         return re.test(suggestion.value);
    //     },
    //     onSelect: function(suggestion) {
    // 	    console.log("in on select");
    //         $('#selction-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
    //     },
    //     onHint: function (hint) {
    // 	    	    console.log("in on hint");
    //         $('#autocomplete-ajax-x').val(hint);
    //     },
    //     onInvalidateSelection: function() {
    // 	    console.log("in on invalidate");	    
    //         $('#selction-ajax').html('You selected: none');
    //     }
    // })

    //basic plugin us

    $('#autocomplete-ajax').devbridgeAutocomplete({
	serviceUrl: "AjaxHelper.php?Module=data_team_helper&script=GetCandidates.php",
	params:{
	    'instrument': function(){
		return $("#instrument").val();
	    }
	},
	        lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
		},
	onSelect: function (suggestion) {
            alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
	}
    }); 
    
    //for testing purposes, will be replaced by auto-complete function soon 
    // $("#candID").on('input', function(e) {
    // 	var $instrument = $("#instrument").val();
    // 	var $visit_label = $("#visit_label").val();
    // 	var $input = $(this).val();

    // 	request = $.ajax({
    // 	    type: "GET",
    // 	    url: "AjaxHelper.php?Module=data_team_helper&script=GetCandidates.php",
    //         data: {
    // 		"instrument" : $instrument,
    // 		"visit_label" : $visit_label,
    // 		"input" : $input
    // 	    },
    // 	    success: function (data){
    // 		console.log("success, here's data: ");
    // 		console.log(data);

    // 	    },
    // 	    error: function (xhr, desc, err){
    //             console.log(xhr);
    //             console.log("Details: " + desc + "\nError:" + err);
    //         }
    // 	});
    // }); //end of the input change
    
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
