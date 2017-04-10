$(document).ready(function () {
    $.ajax({
        type: "GET",
        url : "/acknowledgements/ajax/fetch_all_administrable_center.php",
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

$(document).ready(function () {
    const qs = QueryString.get();
    if (!qs.center_id) {
        return;
    }
    //loadAcknowledgementForm(qs.center_id);
    ReactDOM.render(
        (<Table
            center_id={qs["center_id"]}
            id_prefix="affiliation"
            placeholder="Affiliation Title"
            fetch_all_url="/acknowledgements/ajax/fetch_all_affiliation_of_center.php"
            insert_url="/acknowledgements/ajax/insert_affiliation_of_center.php"
            delete_url="/acknowledgements/ajax/hide_affiliation_of_center.php"
            fetch_url="/acknowledgements/ajax/fetch_affiliation_of_center.php"
            update_url="/acknowledgements/ajax/update_affiliation_of_center.php"
            />),
        document.getElementById("container-affiliation")
    );
    ReactDOM.render(
        (<Table
            center_id={qs["center_id"]}
            id_prefix="degree"
            placeholder="Degree Title"
            fetch_all_url="/acknowledgements/ajax/fetch_all_degree_of_center.php"
            insert_url="/acknowledgements/ajax/insert_degree_of_center.php"
            delete_url="/acknowledgements/ajax/hide_degree_of_center.php"
            fetch_url="/acknowledgements/ajax/fetch_degree_of_center.php"
            update_url="/acknowledgements/ajax/update_degree_of_center.php"
            />),
        document.getElementById("container-degree")
    );
    ReactDOM.render(
        (<Table
            center_id={qs["center_id"]}
            id_prefix="role"
            placeholder="Role Title"
            fetch_all_url="/acknowledgements/ajax/fetch_all_role_of_center.php"
            insert_url="/acknowledgements/ajax/insert_role_of_center.php"
            delete_url="/acknowledgements/ajax/hide_role_of_center.php"
            fetch_url="/acknowledgements/ajax/fetch_role_of_center.php"
            update_url="/acknowledgements/ajax/update_role_of_center.php"
            />),
        document.getElementById("container-role")
    );
    
    $("#btn-back")
        .attr("href", "/acknowledgements/?center_id="+encodeURIComponent(qs.center_id));
});