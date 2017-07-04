/* global fetchAll */
$(document).ready(
    function() {
        const qs = QueryString.get();
        if (!qs.centerId) {
            return;
        }
        $("#txt-public-link")
        .val(window.location.origin + "/acknowledgements/acknowledgements.php?centerId="+encodeURIComponent(qs.centerId));
        $("#filter-container").css("display", "");
        function buildFilter() {
            const filter = {
                fullName: $("#filter-full-name").val(),
                citationName: $("#filter-citation-name").val(),
                startDate: $("#filter-start-date").val(),
                endDate: $("#filter-end-date").val(),
                inStudyAtPresent: $("#filter-in-study-at-present").val()
            };
            if (filter.fullName === "") {
                delete filter.fullName;
            }
            if (filter.citationName === "") {
                delete filter.citationName;
            }
            if (filter.startDate === "") {
                delete filter.startDate;
            }
            if (filter.endDate === "") {
                delete filter.endDate;
            }
            if (filter.inStudyAtPresent === "do-not-filter") {
                delete filter.inStudyAtPresent;
            }
            return filter;
        }
        $("#btn-filter-reset").click(
            function() {
                if (Object.keys(buildFilter()).length === 0) {
                      // Filter is already empty
                    return;
                }
                $(".filter-error").empty();
                $("#filter-full-name").val("");
                $("#filter-citation-name").val("");
                $("#filter-start-date").val("");
                $("#filter-end-date").val("");
                $("#filter-in-study-at-present").val("do-not-filter");
                $("#txt-public-link")
                .val(window.location.origin + "/acknowledgements/acknowledgements.php?centerId="+encodeURIComponent(qs.centerId));
                fetchAll(
                    {
                        centerId: qs.centerId,
                        success: function(data) {
                            window.dispatchEvent(
                                new CustomEvent(
                                    "acknowledgement-fetch-all",
                                    {
                                        detail: data
                                    }
                                )
                            );
                        }
                    }
                );
            }
        );
        $("#btn-filter").click(
            function() {
                const filter = buildFilter();
                fetchAll(
                    {
                        centerId: qs.centerId,
                        filter: filter,
                        success: function(data) {
                            $(".filter-error").empty();
                            window.dispatchEvent(
                                new CustomEvent(
                                    "acknowledgement-fetch-all",
                                    {
                                        detail: data
                                    }
                                )
                            );
                            filter.centerId = qs.centerId;
                            $("#txt-public-link")
                            .val(window.location.origin + "/acknowledgements/acknowledgements.php?" + jQuery.param(filter));
                        },
                        error: function(error) {
                            $(".filter-error")
                            .empty()
                            .append(document.createTextNode(error.responseJSON.error));
                        }
                    }
                );
            }
        );
    }
);
