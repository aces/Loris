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
$(function(){
    change();
});

