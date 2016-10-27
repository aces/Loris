/*global document: false, $: false, window: false*/
$(document).ready(function(){
    $.getScript(loris.BaseURL + "/js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft");
        });
    // checkOverflow();
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft");
    // checkOverflow();
});
$(window).ready(function () {
       
       var filter = getParameterByName('filter');
     
       if(filter==="true"){
         
            $( "input[name ='filter']" ).click();
       
        }
 });

function getParameterByName(name, url) {
    
   if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, "\\$&");
    
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),       
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
