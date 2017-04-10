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

$(function(){
        $('input[name=dob]').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true
        });
});

function setValue(element, valueToSelect) {
  "use strict";

  $("#" + element).val(valueToSelect);
  $("#" + element + " input").val(valueToSelect);
  $("#" + element + " select").val(valueToSelect);
}
function getValue(element) {
    var a = $("#" + element).val();
    var b = $("#" + element + " input").val();
    var c = $("#" + element + " select").val();
    
    console.log(element, a, b, c);
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    if (c != null) {
        return c;
    }
    return null;
}

function arrayOnKey (arr, key) {
    if (arr == null) {
        return null;
    }
    var result = [];
    for (var i=0; i<arr.length; ++i) {
        result.push(arr[i][key]);
    }
    return result;
}
function joinOnKey (arr, key, separator) {
    if (arr == null) {
        return "";
    }
    if (arr.length == 0) {
        return "";
    }
    var result = arr[0][key];
    for (var i=1; i<arr.length; ++i) {
        result += separator + arr[i][key];
    }
    return result;
}
function showAcknowledgementForm (args) {
    $("#acknowledgement-form-dialog-title").html(args.title);
    $("#acknowledgement-form-submit")
        .html(args.submit_text)
        .data("args", args);
    
    var data = args.data;
    
    var disabled = (args.disabled == null) ?
        false : args.disabled;
    
    $("#ack-id").val(data.id);
    $("#ack-center-id").val(data.center_id);
    $("#ack-full-name").val(data.full_name).prop("disabled", disabled);
    $("#ack-citation-name").val(data.citation_name).prop("disabled", disabled);
    $("#ack-affiliation-arr").val(arrayOnKey(data.affiliation_arr, "id")).prop("disabled", disabled);
    $("#ack-degree-arr").val(arrayOnKey(data.degree_arr, "id")).prop("disabled", disabled);
    $("#ack-role-arr").val(arrayOnKey(data.role_arr, "id")).prop("disabled", disabled);
    $("#ack-start-date").val(data.start_date).prop("disabled", disabled);
    $("#ack-end-date").val(data.end_date).prop("disabled", disabled);
    
    var in_study_at_present = "";
    if (data.in_study_at_present != null) {
        in_study_at_present = data.in_study_at_present ?
            "1" : "0";
    }
    $("#ack-in-study-at-present").val(in_study_at_present).prop("disabled", disabled);
    
    
    $(".acknowledgement-form-error")
        .empty()
    
    $("#acknowledgement-form-dialog").modal();
}
function loadOptions (select_id, url, center_id) {
    $.ajax({
        type: "GET",
        url : url,
        data: {
            "center_id":center_id
        },
        dataType: "json",
        success: function (data) {
            for (i in data.arr) {
                const cur = data.arr[i];
                $("#"+select_id).append(
                    $("<option>", {
                        text:cur.title
                    })
                        .val(cur.id)
                )
            }
        }
    });
}
function loadAcknowledgementForm (center_id) {
    loadOptions("ack-affiliation-arr", "/acknowledgements/ajax/fetch_all_affiliation_of_center.php", center_id);
    loadOptions("ack-degree-arr", "/acknowledgements/ajax/fetch_all_degree_of_center.php", center_id);
    loadOptions("ack-role-arr", "/acknowledgements/ajax/fetch_all_role_of_center.php", center_id);
    
    $("#acknowledgement-form-submit").click(function (e) {
        e.preventDefault();
        
        const args = $(this).data("args");
        console.log(args);
        
        const form_data = {
            "id":$("#ack-id").val(),
            "center_id":$("#ack-center-id").val(),
            "full_name":$("#ack-full-name").val(),
            "citation_name":$("#ack-citation-name").val(),
            
            "affiliation_arr":$("#ack-affiliation-arr").val(),
            "degree_arr":$("#ack-degree-arr").val(),
            "role_arr":$("#ack-role-arr").val(),
            
            "start_date":$("#ack-start-date").val(),
            "end_date":$("#ack-end-date").val(),
            "in_study_at_present":$("#ack-in-study-at-present").val()
        };
        
        if (form_data.start_date === "") {
            delete form_data.start_date;
        }
        if (form_data.end_date === "") {
            delete form_data.end_date;
        }
        if (form_data.in_study_at_present === "") {
            delete form_data.in_study_at_present;
        }
        
        if (form_data.affiliation_arr == null) {
            delete form_data.affiliation_arr;
        }
        if (form_data.degree_arr == null) {
            delete form_data.degree_arr;
        }
        if (form_data.role_arr == null) {
            delete form_data.role_arr;
        }
        
        console.log(form_data);
        console.log(args.method);
        console.log(args.action);
        $.ajax({
            method: args.method,
            url : args.action,
            contentType: "application/x-www-form-urlencoded",
            data: form_data,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (args.callback) {
                    args.callback(data);
                }
                $("#acknowledgement-form-dialog").modal("hide");
            },
            error: function (error) {
                console.log(error);
                window.dispatchEvent(new CustomEvent("acknowledgement-error", {
                    detail:{
                        args:args,
                        form_data:form_data,
                        error:error
                    }
                }));
                $(".acknowledgement-form-error")
                    .empty()
                    .append(document.createTextNode(error.responseJSON.error));
            }
        });
    });
}
function setRowValues (tr, data) {
    const arr = $(tr).find("td");
    $(arr[0]).empty().append(document.createTextNode(data.full_name));
    $(arr[1]).empty().append(document.createTextNode(data.citation_name));
}