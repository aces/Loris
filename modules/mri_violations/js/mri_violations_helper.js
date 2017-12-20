/*global document: false, $: false, window: false*/
$(document).ready(function(){
    $.getScript(loris.BaseURL + "/js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft");
        });
    // checkOverflow();

   $(".mri_violations").click(function(e) {
        e.preventDefault();
        var submenu = $(this).attr('id');
        var form    = $('<form />', {
            "action" : loris.BaseURL + "/mri_violations/"+submenu,
            "method" : "post"
        });
        var values = {
            "reset" : "true",
            "PatientName" : this.dataset.patientname,
            "SeriesUID"   : this.dataset.seriesuid,
            "filter" : "Show Data"
        }

        $.each(values, function(name, value) {
            $("<input />", {
                type: 'hidden',
                name: name,
                value: value
            }).appendTo(form);
        });

        form.appendTo('body').submit();
    });
    $("#violationsTable").DynamicTable({ "freezeColumn" : "PatientName" });
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft");
    // checkOverflow();
});
