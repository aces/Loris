$(document).ready(function () {
    const qs = QueryString.get();
    if (!qs.center_id) {
        return;
    }
    loadAcknowledgementForm(qs.center_id);
    const table = <Table center_id={qs["center_id"]}/>;
    ReactDOM.render(table, document.getElementById("acknowledgement-table-container"));
    
    $.ajax({
        type: "GET",
        url : "/acknowledgements/ajax/fetch_all_administrable_center.php",
        dataType: "json",
        success: function (data) {
            for (let i in data.arr) {
                if (data.arr[i].id === qs.center_id) {
                    $("#btn-admin")
                        .css("display", "")
                        .attr("href", "/acknowledgements/?submenu=admin&center_id="+encodeURIComponent(qs.center_id));
                    break;
                }
            }
        }
    });
});


$(document).ready(function () {
    $.ajax({
        type: "GET",
        url : "/acknowledgements/ajax/fetch_all_viewable_center.php",
        dataType: "json",
        success: function (data) {
            for (let i in data.arr) {
                $("#select-center").append(
                    $("<option>")
                        .val(data.arr[i].id)
                        .append(document.createTextNode(data.arr[i].name))
                );
            }
            $("#select-center-prompt").attr("disabled", true);
            const qs = QueryString.get();
            if (qs.center_id) {
                $("#select-center").val(qs.center_id);
            }
        }
    });
});