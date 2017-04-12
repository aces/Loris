function loadCenter(centerId, containerAffiliation, containerDegree, containerRole) {
  ReactDOM.render(
        (<Table
            centerId ={centerId}
            idPrefix ={"affiliation-" + centerId + "-"}
            placeholder ="Affiliation Title"
            fetchAllUrl ="/acknowledgements/ajax/fetch_all_affiliation_of_center.php"
            insertUrl ="/acknowledgements/ajax/insert_affiliation_of_center.php"
            deleteUrl ="/acknowledgements/ajax/hide_affiliation_of_center.php"
            fetchUrl ="/acknowledgements/ajax/fetch_affiliation_of_center.php"
            updateUrl ="/acknowledgements/ajax/update_affiliation_of_center.php"
            />),
        containerAffiliation
    );
  ReactDOM.render(
        (<Table
            centerId ={centerId}
            idPrefix ={"degree-" + centerId + "-"}
            placeholder ="Degree Title"
            fetchAllUrl ="/acknowledgements/ajax/fetch_all_degree_of_center.php"
            insertUrl ="/acknowledgements/ajax/insert_degree_of_center.php"
            deleteUrl ="/acknowledgements/ajax/hide_degree_of_center.php"
            fetchUrl ="/acknowledgements/ajax/fetch_degree_of_center.php"
            updateUrl ="/acknowledgements/ajax/update_degree_of_center.php"
            />),
        containerDegree
    );
  ReactDOM.render(
        (<Table
            centerId ={centerId}
            idPrefix ={"role-" + centerId + "-"}
            placeholder ="Role Title"
            fetchAllUrl ="/acknowledgements/ajax/fetch_all_role_of_center.php"
            insertUrl ="/acknowledgements/ajax/insert_role_of_center.php"
            deleteUrl ="/acknowledgements/ajax/hide_role_of_center.php"
            fetchUrl ="/acknowledgements/ajax/fetch_role_of_center.php"
            updateUrl ="/acknowledgements/ajax/update_role_of_center.php"
            />),
        containerRole
    );
}
function loadAllCenters(data) {
  for (let i = 0; i < data.arr.length; ++i) {
    const divTitle = $("<div>")
            .addClass("col-lg-12")
            .append(
                $(
                    "<h1>",
                  {
                    text: data.arr[i].name
                  }
                )
            );
    const divAffiliation = $("<div>").addClass("col-lg-4");
    const divDegree = $("<div>").addClass("col-lg-4");
    const divRole = $("<div>").addClass("col-lg-4");
    const div = $("<div>")
            .addClass("row")
            .append(divTitle)
            .append(divAffiliation)
            .append(divDegree)
            .append(divRole);
    div.insertBefore($("#default-row"));
    loadCenter(data.arr[i].id, divAffiliation[0], divDegree[0], divRole[0]);
  }
}
$(document).ready(
    function() {
      $.ajax(
        {
          type: "GET",
          url: "/acknowledgements/ajax/fetch_all_administrable_center.php",
          dataType: "json",
          success: function(data) {
            for (let i = 0; i < data.arr.length; ++i) {
              $("#select-center").append(
                            $("<option>")
                            .val(data.arr[i].id)
                            .append(document.createTextNode(data.arr[i].name))
                        );
            }
            $("#select-center-prompt").attr("disabled", true);
            const qs = QueryString.get();
            if (qs.centerId) {
              $("#select-center").val(qs.centerId);
            } else {
              $("#select-center").val(-1);
              loadAllCenters(data);
            }
          }
        }
        );
    }
);

$(document).ready(
    function() {
      const qs = QueryString.get();
      if (!qs.centerId) {
        return;
      }

      loadCenter(
            qs.centerId,
            document.getElementById("container-affiliation"),
            document.getElementById("container-degree"),
            document.getElementById("container-role")
        );
      $("#btn-back")
        .attr("href", "/acknowledgements/?centerId=" + encodeURIComponent(qs.centerId));
    }
);

$(document).ready(
    function() {
      $("#select-center-form").on(
            "submit",
            function(e) {
              if ($("#select-center").val() === -1) {
                $("#select-center").val(null);
              }
            }
        );
    }
);
