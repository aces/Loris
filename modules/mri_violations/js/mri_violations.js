/*global document: false, $: false, window: false*/
$(document).ready(function(){
    $.getScript("js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft");
        });
    // checkOverflow();

   $(".mri_violations").click(function(e) {
        e.preventDefault();
        var submenu = $(this).attr('id');
        var form    = $('<form />', {
            "action" : "main.php?test_name=mri_violations&submenu="+submenu,
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
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft");
    // checkOverflow();
});
