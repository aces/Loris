/* global loadAcknowledgementForm */
$(document).ready(
    function() {
      const qs = QueryString.get();
      if (!qs.centerId) {
        return;
      }
      loadAcknowledgementForm(qs.centerId);
      const table = <Table centerId ={qs.centerId}/>;
      ReactDOM.render(table, document.getElementById("acknowledgement-table-container"));
      $.ajax(
        {
          type: "GET",
          url: "/acknowledgements/ajax/fetch_all_administrable_center.php",
          dataType: "json",
          success: function(data) {
            for (let i in data.arr) {
              if (data.arr[i].id === qs.centerId) {
                $("#btn-admin")
                            .css("display", "")
                            .attr("href", "/acknowledgements/?submenu=admin&centerId=" + encodeURIComponent(qs.centerId));
                break;
              }
            }
          }
        }
        );
    }
);

$(document).ready(
    function() {
      $.ajax(
        {
          type: "GET",
          url: "/acknowledgements/ajax/fetch_all_viewable_center.php",
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
            }
          }
        }
        );
    }
);
