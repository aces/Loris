$(document).ready(function() {
    // Filters will only get applied on a POST, so
    // on click we need to fake a form which posts
    // to the mri_violations in order to get filters
    $(".dicom_archive").click(function(e) {
        e.preventDefault();
        var form = $('<form />', {
            "action" : loris.BaseURL + "/mri_violations/",
            "method" : "post"
        });
        var values = {
            "reset"       : "true",
            "PatientName" : this.dataset.patientname,
            "SeriesUID"   : this.dataset.seriesuid,
            "filter"      : "Show Data"
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

    $(".dicom_archive_datasets").click(function(e) {
        e.preventDefault();
        var form = $('<form />', {
            "action" : loris.BaseURL + "/mri_violations/",
            "method" : "post"
        });
        var values = {
            "reset"  : "true",
            "PatientName"  : this.dataset.patientname,
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

