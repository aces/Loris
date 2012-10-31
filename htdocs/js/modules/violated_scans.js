/**
TODO:
//Change the width of the td by clicking on it
1)
**/

function change(){

	$('#hide').hide();
	$('#tbl').hide();
	/*$('td').filter('[id*=header]').css({
	backgroundColor: 'green'
	});*/

	//to show
	$('#show').bind('click',function(event){
		$('#tbl').show('slow',function(){});
		$('#hide').show();
		$('#show').hide();
	}
	);

	//To hide : table hides...and the show shows...
	$('#hide').bind('click',function(event){
		$('#tbl').hide('slow',function(){});
		$('#show').show();
		$('#hide').hide();
	});

}


function save() {

	$('.description').

	bind('blur',function(event){
		event.stopImmediatePropagation();
		id = event.target.id;
		value = $("#" + id) .text();
		alert(id);
		//id: row_1_td_8
		//value:
		// sendRemoteDataQuery("query_gui_data_loader.php?mode=loadQuery&action="+action+"&qid="+qid);

		//var test = "UpdateDataDict.php?fieldname=" + id + "&description=" + value;
		
		
		$('<div></div>').appendTo('body')
                    .html('<div>Are you sure?</div>')
                    
                    .dialog({
                        title: 'Modification', zIndex: 10000, autoOpen: true,
                        width: 'auto', resizable: false,
                        dialogClass:'transparent',	 
                        buttons: {
                            Yes: function () {
                               $.get("UpdateMRIProtocol.php?field_id=" + id + "&field_value=" + value,  function(data) {});
                                $(this).dialog("close");
                            },
                            No: function () {
                                $(this).dialog("close");
                            }
                        },
                        close: function (event, ui) {
                            $(this).remove();
                        }
                    });
                    
		})
	};


	$(function(){
		change();
		save();
	});


