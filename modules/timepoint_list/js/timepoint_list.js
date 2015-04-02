$(document).ready(function() {
    // Filters will only get applied on a POST, so
    // on click we need to fake a form which posts
    // to the imaging_browser in order to get filters
    $(".timepoint_list").click(function(e) {
        e.preventDefault();
        var form = $('<form />', {
            "action" : "main.php?test_name=imaging_browser",
            "method" : "post"
        });
        var values = {
            "reset" : "true",
            "pscid" : this.dataset.pscid,
            "VL"    : this.dataset.visitlabel,
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
});
