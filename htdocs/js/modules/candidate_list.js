function checkAccessProfileForm(){
   var form = document.accessProfileForm;
   if(form.candID.value == ""){
      alert("You must enter a DCC-ID");
      form.candID.focus();
      return false;
   } else if (form.PSCID.value == ""){
      alert("You must enter a PSCID");
      form.PSCID.focus();
      return false;
   }
   return true;
}
function hideFilter(){
    $("#panel-body").toggle();
    $("#down").toggle();
    $("#up").toggle();
}
function toggleMe() {
    "use strict";
    $("#advanced-label").toggle();
    $("#advanced-options").toggle();
    $("#advanced-buttons").toggle(); 
}

$(function(){
	$('input[name=dob]').datepicker({
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true
	});
});