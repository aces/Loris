function hideFilter(){
    $("#panel-body").toggle();
    $("#down").toggle();
    $("#up").toggle();
}
function hideSwap(){
    $("#swap-body").toggle();
    $("#swapDown").toggle();
    $("#swapUp").toggle();
}
$(document).ready(function() {
    function _swapWrapper() {
        return toggleTable('swapcandidates');
    }
    function _addWrapper() {
        return toggleTable('addcandidate');
    }
    function toggleTable(table) {
        if(table) {
            t = $('table#' + table);
            body = t.children('tbody');
            body.toggle();
            if(body.css("display") == 'none') {
                t.css("border", "none");
            } else {
                t.css("border", "2px solid #08245B");
            }
        }
    }
    

    $('table#swapcandidates th').click(_swapWrapper);
    $('table#addcandidate th').click(_addWrapper);
    // Hide the tab by default
    toggleTable('swapcandidates');
    toggleTable('addcandidate');
});