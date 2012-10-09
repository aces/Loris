/**
TODO:
//Change the width of the td by clicking on it
1) 
**/
function change(){
	
	
	$('#hide').hide();
	$('#tbl').hide();
	  
	$('td').filter('[id*=header]').css({
		backgroundColor: 'green'
	});
	
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
	/*
	$('td').filter('[id*=header]')
	 .bind('click',function(event){
	 	var id= this.id;
	 	var splits=id.split('_');
	 	var td_id = 'td_' + splits[1];
	 	//$("#"+this.id).addClass("width_color");
	    $("#"+this.id).toggleClass('width_color');
	    
	 	$('td').filter('[id$=' + td_id + ']').each(function(){ 
	 	    $("#"+this.id).toggleClass('width_color');
	 	    // slideToggle('fast', function() {                
          //  });
	 	});
	 	
	 }
	)
	*/
	/*
	$('#header_1').bind('click',function(event)
	  {
	   ($('td').filter('[id=td_1]')).toggle();
	  
	  }
    );
    */


function swapThem(){
	
}
/*
function ShrinkTable() {
    var FontSize = parseInt($("#tbl").css('font-size').replace('px', ''),10);
    var TabWidth = $("#tbl").width();
    var DivWidth = $("#narrorColumn");
    
    if (parseInt(DivWidth.css('width').replace('px', ''),10) < TabWidth) {
        $("#tbl").css('font-size', FontSize - 4 + 'px');
        //Shrink the font while div width is less than table width
        ShrinkTable();
    }
}


*/
$(function(){
    change();
  //  ShrinkTable();
});






/*
$(".expand").click(function(e) {
     e.preventDefault();
     var common_parent = $(this).closest('.bdrroundfg');
     var slide_content = common_parent.find('.slide_content'); // the added class!
     var all_buttons   = common_parent.find('a.expand');   

     var txt = $(this).text() === '+ Expand' ? '- Minimize' : '+ Expand';
     all_buttons.eq(0).text(txt);    // toggle text - first button only!     

     $(slide_content).slideToggle('fast', function(){
          // do something here...
     });

 });
 */
