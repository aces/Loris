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
            }
        });
    }).css("display", "");
    loadAcknowledgementForm(qs.center_id);
    const table = <Table center_id={qs["center_id"]}/>;
    ReactDOM.render(table, document.getElementById("acknowledgement-table-container"));
});