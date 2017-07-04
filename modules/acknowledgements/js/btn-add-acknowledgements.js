$(document).ready(
    function () {
        const qs = QueryString.get();
        if (!qs.centerId) {
            return;
        }
        $("#btn-add-acknowledgement").click(
            function () {
                showAcknowledgementForm(
                    {
                        method:"POST",
                        action:"/acknowledgements/ajax/insert.php",
                        submitText: "Add",
                        title: "Add Acknowledgement",
                        data: {
                            centerId: qs.centerId
                        },
                        callback: function (data) {
                            $.ajax(
                                {
                                    method:"GET",
                                    url:"/acknowledgements/ajax/fetch.php",
                                    data: data,
                                    dataType: "json",
                                    success: function (data) {
                                        console.log("fetch", data);
                                        window.dispatchEvent(
                                            new CustomEvent(
                                                "acknowledgement-insert",
                                                {
                                                    detail:data
                                                }
                                            )
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        ).css("display", "");
    }
);
