/*global document: false, $: false, window: false, unescape: false, Option: false,isElementsSet*/

function hideFilter() {
    "use strict";
    var block= $(this).parent.get();  // variable for panel
    // var block= $(this).parent();  // variable for panel
/*    $("#panel-body").toggle();
    $("#down").toggle();
    $("#up").toggle();
*/
console.log(this);
$('.panel-body',block).toggle(); 
$('.glyphicon-chevron-down',block).toggle(); 
$('.glyphicon-chevron-up',block).toggle(); 

}

function hideFilterCandidate() {
    "use strict";
    $("#panel-body-candidate").toggle();
    $("#down-candidate").toggle();
    $("#up-candidate").toggle();
}

function hideFilterGene() {
    "use strict";
    $("#panel-body-gene").toggle();
    $("#down-gene").toggle();
    $("#up-gene").toggle();
}

function hideFilterSNP() {
    "use strict";
    $("#panel-body-snp").toggle();
    $("#down-snp").toggle();
    $("#up-snp").toggle();
}

function hideFilterCNV() {
    "use strict";
    $("#panel-body-cnv").toggle();
    $("#down-cnv").toggle();
    $("#up-cnv").toggle();
}
