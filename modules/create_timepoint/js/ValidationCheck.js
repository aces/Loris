 function checkSelect() {
        if( $("select[name=subprojectID]").val()<1)
         {
          $(".error").html("A Subproject label is required for creating a timepoint.");

           return false;
         }
   return true;
}

