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

function hideFilterGWAS() {
    "use strict";
    $("#panel-body-gwas").toggle();
    $("#down-gwas").toggle();
    $("#up-gwas").toggle();
}

function hideFilterGenomic() {
    "use strict";
    $("#panel-body-genomic").toggle();
    $("#down-genomic").toggle();
    $("#up-genomic").toggle();
}


$(document).ready(function() {
            // Filters will only get applied on a POST, so
            // on click we need to fake a form which posts
            // to the conflict_resolver in order to get filters
            $(".cnv_link").click(function(e) {
                    e.preventDefault();
                    var form = $('<form />', {
                            "action" : "genomic_browser/cnv_browser/",
                            "method" : "post"
                        });
            
                    form.attr('target', '_blank');
                    var values = {
                            "reset" : "true",
                            "PSCID" : this.dataset.pscid,
                            "test_name"  : "genomic_browser",
                            "submenu"    : "cnv_browser",
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
            $(".snp_link").click(function(e) {
                    e.preventDefault();
                    var form = $('<form />', {
                            "action" : "genomic_browser/snp_browser/",
                            "method" : "post"
                        });
            
                    form.attr('target', '_blank');
                    var values = {
                            "reset" : "true",
                            "PSCID" : this.dataset.pscid,
                            "test_name"  : "genomic_browser",
                            "submenu"    : "snp_browser",
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
//  --- Added for viewGenomicFile from imaging_browser viewSession
            $('#panel-main-heading span.clickable').on("click", function () {
                if ($(this).hasClass('panel-collapsed')) {
                // expand the panel
                    $(this).parents('.panel').find('.panel-mri-body').slideDown();
                    $(this).removeClass('panel-collapsed');
                    $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                } else {
                    // collapse the panel
                    $(this).parents('.panel').find('.panel-mri-body').slideUp();
                    $(this).addClass('panel-collapsed');
                    $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                }
           });
//-- End inserted into ready function for viewGenomicFile (based on imaging browser)
});

// Elements called -mri for ViewGenomicFile page 
// as they should match design and functionality of Imaging Browser's -mri elements
$(function () {
        "use strict";
            $(".table-mri>tbody>tr:odd").css("background-color", "#d0d0d0");
                $(".table-mri>tbody>tr:even").css("background-color", "#eeeeee");

});

function toggle_additionalInfo (file_id) {
        "use strict";
            $('#mri-righttable-'+file_id).slideToggle("slow");
}
function toggle_mriPanel(file_id) {
        "use strict";
            $('#panel-body-'+file_id).slideToggle("slow");
            var arrow = $('#mri-panel-'+file_id).children('.arrow');
            if (arrow.hasClass('glyphicon-chevron-down')) {
                arrow.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            } else {
                arrow.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
}

function hideFilterCpG() {
    "use strict";
    $("#panel-body-cpg").toggle();
    $("#down-cpg").toggle();
    $("#up-cpg").toggle();
}
