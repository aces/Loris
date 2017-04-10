$(document).ready(function () {
    const qs = QueryString.get();
    if (!qs.center_id) {
        return;
    }
    $("#btn-add-acknowledgement").click(function () {
        showAcknowledgementForm({
            method:"POST",
            action:"/acknowledgements/ajax/insert.php",
            submit_text: "Add",
            title: "Add Acknowledgement",
            data: {
                center_id: qs.center_id
            },
            callback: function (data) {
                $.ajax({
                    method:"GET",
                    url:"/acknowledgements/ajax/fetch.php",
                    data: data,
                    dataType: "json",
                    success: function (data) {
                        console.log("fetch", data);
                        window.dispatchEvent(new CustomEvent("acknowledgement-insert", {
                            detail:data
                        }));
                    }
                });
            }
        });
    }).css("display", "");
});