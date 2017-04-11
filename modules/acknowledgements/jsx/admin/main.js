function loadCenter (center_id, container_affiliation, container_degree, container_role) {
    ReactDOM.render(
        (<Table
            center_id={center_id}
            id_prefix={"affiliation-"+center_id+"-"}
            placeholder="Affiliation Title"
            fetch_all_url="/acknowledgements/ajax/fetch_all_affiliation_of_center.php"
            insert_url="/acknowledgements/ajax/insert_affiliation_of_center.php"
            delete_url="/acknowledgements/ajax/hide_affiliation_of_center.php"
            fetch_url="/acknowledgements/ajax/fetch_affiliation_of_center.php"
            update_url="/acknowledgements/ajax/update_affiliation_of_center.php"
            />),
        container_affiliation
    );
    ReactDOM.render(
        (<Table
            center_id={center_id}
            id_prefix={"degree-"+center_id+"-"}
            placeholder="Degree Title"
            fetch_all_url="/acknowledgements/ajax/fetch_all_degree_of_center.php"
            insert_url="/acknowledgements/ajax/insert_degree_of_center.php"
            delete_url="/acknowledgements/ajax/hide_degree_of_center.php"
            fetch_url="/acknowledgements/ajax/fetch_degree_of_center.php"
            update_url="/acknowledgements/ajax/update_degree_of_center.php"
            />),
        container_degree
    );
    ReactDOM.render(
        (<Table
            center_id={center_id}
            id_prefix={"role-"+center_id+"-"}
            placeholder="Role Title"
            fetch_all_url="/acknowledgements/ajax/fetch_all_role_of_center.php"
            insert_url="/acknowledgements/ajax/insert_role_of_center.php"
            delete_url="/acknowledgements/ajax/hide_role_of_center.php"
            fetch_url="/acknowledgements/ajax/fetch_role_of_center.php"
            update_url="/acknowledgements/ajax/update_role_of_center.php"
            />),
        container_role
    );
}
function loadAllCenters (data) {
    for (let i in data.arr) {
        const div_title = $("<div>")
            .addClass("col-lg-12")
            .append($("<h1>", {
                text: data.arr[i].name
            }));
        const div_affiliation = $("<div>").addClass("col-lg-4");
        const div_degree      = $("<div>").addClass("col-lg-4");
        const div_role        = $("<div>").addClass("col-lg-4");
        const div = $("<div>")
            .addClass("row")
            .append(div_title)
            .append(div_affiliation)
            .append(div_degree)
            .append(div_role);
        div.insertBefore($("#default-row"));
        loadCenter(data.arr[i].id, div_affiliation[0], div_degree[0], div_role[0]);
    }   
}
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
            } else {
                $("#select-center").val(-1);
                loadAllCenters(data);
            }
        }
    });
});

$(document).ready(function () {
    const qs = QueryString.get();
    if (!qs.center_id) {
        return;
    }
    
    loadCenter(
        qs.center_id,
        document.getElementById("container-affiliation"),
        document.getElementById("container-degree"),
        document.getElementById("container-role")
    );
    $("#btn-back")
        .attr("href", "/acknowledgements/?center_id="+encodeURIComponent(qs.center_id));
});

$(document).ready(function () {
    $("#select-center-form").on("submit", function (e) {
        if ($("#select-center").val() == -1) {
            $("#select-center").val(null);
        }
    });
});