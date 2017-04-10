$(document).ready(function () {
    const qs = QueryString.get();
    if (!qs.center_id) {
        return;
    }
    $("#filter-container").css("display", "");
    
    function build_filter () {
        const filter = {
            "full_name": $("#filter-full-name").val(),
            "citation_name": $("#filter-citation-name").val(),
            "start_date": $("#filter-start-date").val(),
            "end_date": $("#filter-end-date").val(),
            "in_study_at_present": $("#filter-in-study-at-present").val(),
        };
        if (filter["full_name"] === "") {
            delete filter["full_name"];
        }
        if (filter["citation_name"] === "") {
            delete filter["citation_name"];
        }
        if (filter["start_date"] === "") {
            delete filter["start_date"];
        }
        if (filter["end_date"] === "") {
            delete filter["end_date"];
        }
        if (filter["in_study_at_present"] === "do-not-filter") {
            delete filter["in_study_at_present"];
        }
        return filter;
    }
    $("#btn-filter-reset").click(function () {
        if (Object.keys(build_filter()).length === 0) {
            //Filter is already empty
            return;
        }
        $(".filter-error").empty();
        
        $("#filter-full-name").val("");
        $("#filter-citation-name").val("");
        $("#filter-start-date").val("");
        $("#filter-end-date").val("");
        $("#filter-in-study-at-present").val("do-not-filter");
        
        fetch_all({
            "center_id":qs.center_id,
            success: function (data) {
                window.dispatchEvent(new CustomEvent("acknowledgement-fetch-all", {
                    detail:data
                }));
            }
        });
    });
    $("#btn-filter").click(function () {
        fetch_all({
            "center_id":qs.center_id,
            filter:build_filter(),
            success: function (data) {
                $(".filter-error").empty();
                window.dispatchEvent(new CustomEvent("acknowledgement-fetch-all", {
                    detail:data
                }));
            },
            error: function (error) {
                console.log(error);
                $(".filter-error")
                    .empty()
                    .append(document.createTextNode(error.responseJSON.error));
            }
        });
    });
});