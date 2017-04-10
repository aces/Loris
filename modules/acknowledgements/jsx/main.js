$(document).ready(function () {
    const qs = QueryString.get();
    if (!qs.center_id) {
        return;
    }
    loadAcknowledgementForm(qs.center_id);
    const table = <Table center_id={qs["center_id"]}/>;
    ReactDOM.render(table, document.getElementById("acknowledgement-table-container"));
    
});