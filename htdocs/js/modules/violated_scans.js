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

	
	
	/**To get the default value**/
	$('.description').click(function(event){
		id = event.target.id;
		default_value = $("#" + id) .text();
	});
	
	
	
	$('.description').bind('blur',function(event){
			
		event.stopImmediatePropagation();
		id = event.target.id;
		value = $("#" + id) .text();
		$('<div></div>').appendTo('body')
		.html('<div>Are you sure?</div>')
		.dialog({
			title: 'Modification', zIndex: 10000, autoOpen: true,
			width: 'auto', resizable: false,
			dialogClass:'transparent',
			position: [800,90], 
			buttons: {
				Yes: function () {
					$.get("UpdateMRIProtocol.php?field_id=" + id + "&field_value=" + value,  function(data) {});
					$(this).dialog("close");
				},
				No: function () {
					$("#" + id).text(default_value);
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


