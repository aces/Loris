$(document).ready(function() {
    "use strict";

    $('[data-toggle="tooltip"]').tooltip();

    $(".saveIdentifierType").click(function(e) {
        e.preventDefault();

        var form = $(e.currentTarget).closest('form');

        var identifierTypeID = form.find(".identifierTypeID").val();
        var name = form.find(".identifierName").val();
        var format = form.find(".identifierFormat").val();

        var isRequired = form.find(".IsRequired").is(":checked") ? 1 : 0;
        var isUnique = form.find(".IsUnique").is(":checked") ? 1 : 0;
        var autoGenerate = form.find(".AutoGenerate").is(":checked") ? 1 : 0;
        var allowMultiple = form.find(".AllowMultiple").is(":checked") ? 1 : 0;

        var projectIDs = form.find(".identifierProjects").val() || [];

        var saveStatus = form.find(".saveStatus");

        if (!name || !format) {
            saveStatus.text("Failed to save, Name and Format are required!")
                .css({'color': 'red'})
                .fadeIn(500).delay(1000).fadeOut(500);
            return;
        }

        jQuery.ajax({
            "type": "post",
            "url": loris.BaseURL
                + "/configuration/ajax/updateCandidateIdentifierType.php",
            "data": {
                "CandidateIdentifierTypeID": identifierTypeID,
                "Name": name,
                "Format": format,
                "IsRequired": isRequired,
                "IsUnique": isUnique,
                "AutoGenerate": autoGenerate,
                "AllowMultiple": allowMultiple,
                "ProjectIDs": projectIDs
            },
            "dataType": "json",
            "success": function() {
                saveStatus.text("Successfully saved")
                    .css({'color': 'green'})
                    .fadeIn(500).delay(1000).fadeOut(500);
                setTimeout(function() {
                    location.reload();
                }, 1000);
            },
            "error": function(data) {
                var error = "Failed to save identifier type!";

                if (data.responseJSON && data.responseJSON.error) {
                    error = data.responseJSON.error;
                }

                saveStatus.text(error)
                    .css({'color': 'red'})
                    .fadeIn(500).delay(1000).fadeOut(500);
            }
        });
    });
});