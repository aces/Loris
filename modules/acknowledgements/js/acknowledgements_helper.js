function hideFilter(obj) {
    'use strict';

    var heading = $(obj);
    var arrow   = $(obj).children('.arrow');
    if (heading.hasClass('panel-collapsed')) {
            // expand the panel
        heading.parents('.panel').find('.panel-body').slideDown();
        heading.removeClass('panel-collapsed');
        arrow.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    } else {
            // collapse the panel
        heading.parents('.panel').find('.panel-body').slideUp();
        heading.addClass('panel-collapsed');
        arrow.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
}

$(
    function() {
        $('input[name=dob]').datepicker(
            {
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true
            }
        );
    }
);

function arrayOnKey(arr, key) {
    if (arr === null || arr === undefined) {
        return null;
    }
    var result = [];
    for (var i = 0; i < arr.length; ++i) {
        result.push(arr[i][key]);
    }
    return result;
}
function joinOnKey(arr, key, separator) {
    if (arr === null || arr === undefined) {
        return "";
    }
    if (arr.length === 0) {
        return "";
    }
    var result = arr[0][key];
    for (var i = 1; i < arr.length; ++i) {
        result += separator + arr[i][key];
    }
    return result;
}
function showAcknowledgementForm(args) {
    $("#acknowledgement-form-dialog-title").html(args.title);
    $("#acknowledgement-form-submit")
        .html(args.submitText)
        .data("args", args);

    var data = args.data;

    var disabled = (args.disabled === null) ?
        false : args.disabled;

    $("#ack-id").val(data.id);
    $("#ack-center-id").val(data.centerId);
    $("#ack-full-name").val(data.fullName).prop("disabled", disabled);
    $("#ack-citation-name").val(data.citationName).prop("disabled", disabled);
    $("#ack-affiliation-arr").val(arrayOnKey(data.affiliationArr, "id")).prop("disabled", disabled);
    $("#ack-degree-arr").val(arrayOnKey(data.degreeArr, "id")).prop("disabled", disabled);
    $("#ack-role-arr").val(arrayOnKey(data.roleArr, "id")).prop("disabled", disabled);
    $("#ack-start-date").val(data.startDate).prop("disabled", disabled);
    $("#ack-end-date").val(data.endDate).prop("disabled", disabled);

    var inStudyAtPresent = "";
    if (data.inStudyAtPresent !== null && data.inStudyAtPresent !== undefined) {
        inStudyAtPresent = data.inStudyAtPresent ?
            "1" : "0";
    }
    $("#ack-in-study-at-present").val(inStudyAtPresent).prop("disabled", disabled);

    $(".acknowledgement-form-error")
        .empty();

    $("#acknowledgement-form-dialog").modal();
}
function loadOptions(selectId, url, centerId) {
    $.ajax(
        {
            type: "GET",
            url: url,
            data: {
                centerId: centerId
            },
            dataType: "json",
            success: function(data) {
                for (let i = 0; i < data.arr.length; ++i) {
                    const cur = data.arr[i];
                    $("#" + selectId).append(
                        $(
                            "<option>",
                            {
                                text: cur.title
                            }
                        )
                        .val(cur.id)
                    );
                }
            }
        }
    );
}
function loadAcknowledgementForm(centerId) {
    loadOptions("ack-affiliation-arr", "/acknowledgements/ajax/fetch_all_affiliation_of_center.php", centerId);
    loadOptions("ack-degree-arr", "/acknowledgements/ajax/fetch_all_degree_of_center.php", centerId);
    loadOptions("ack-role-arr", "/acknowledgements/ajax/fetch_all_role_of_center.php", centerId);

    $("#acknowledgement-form-submit").click(
        function(e) {
            e.preventDefault();
            const args     = $(this).data("args");
            const formData = {
                id: $("#ack-id").val(),
                centerId: $("#ack-center-id").val(),
                fullName: $("#ack-full-name").val(),
                citationName: $("#ack-citation-name").val(),

                affiliationArr: $("#ack-affiliation-arr").val(),
                degreeArr: $("#ack-degree-arr").val(),
                roleArr: $("#ack-role-arr").val(),

                startDate: $("#ack-start-date").val(),
                endDate: $("#ack-end-date").val(),
                inStudyAtPresent: $("#ack-in-study-at-present").val()
            };
            if (formData.startDate === "") {
                delete formData.startDate;
            }
            if (formData.endDate === "") {
                delete formData.endDate;
            }
            if (formData.inStudyAtPresent === "") {
                delete formData.inStudyAtPresent;
            }

            if (formData.affiliationArr === null) {
                delete formData.affiliationArr;
            }
            if (formData.degreeArr === null) {
                delete formData.degreeArr;
            }
            if (formData.roleArr === null) {
                delete formData.roleArr;
            }

            $.ajax(
                {
                    method: args.method,
                    url: args.action,
                    contentType: "application/x-www-form-urlencoded",
                    data: formData,
                    dataType: "json",
                    success: function(data) {
                        if (args.callback) {
                            args.callback(data);
                        }
                        $("#acknowledgement-form-dialog").modal("hide");
                    },
                    error: function(error) {
                        window.dispatchEvent(
                            new CustomEvent(
                                "acknowledgement-error",
                                {
                                    detail: {
                                        args: args,
                                        formData: formData,
                                        error: error
                                    }
                                }
                            )
                        );
                        $(".acknowledgement-form-error")
                        .empty()
                        .append(document.createTextNode(error.responseJSON.error));
                    }
                }
            );
        }
    );
}

window.hideFilter = hideFilter;
window.showAcknowledgementForm = showAcknowledgementForm;
window.loadAcknowledgementForm = loadAcknowledgementForm;
window.joinOnKey = joinOnKey;
