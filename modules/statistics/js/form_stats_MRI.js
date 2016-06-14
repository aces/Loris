/*global document, $*/
function updateCheckboxes() {
    $('#selectall').click(function(event) {
        if(this.checked) {
            $('input:checkbox[id=MRIScans]').each(function() {
                this.checked = true;
            });
        }else{
            $('input:checkbox[id=MRIScans]').each(function() {
                this.checked = false;
            });
        }
    });

}
$(document).ready(function(){
    $("#bigtable").DynamicTable({ "freezeColumn" : "tpcol" });
});

function updateMRITab() {
    var MRIProject = document.getElementById("MRIProject");
    var MRIsite = document.getElementById("MRIsite");
    var Scans = document.getElementById("MRIScans");
    scanArray=[];
    $("input:checkbox[id=MRIScans]:checked").each(function(){
        scanArray.push($(this).val());
    });

    var request = $.ajax({
        url: loris.BaseURL + '/statistics/stats_MRI/?dynamictabs=dynamictabs&MRIProject=' + MRIProject.value + '&MRIsite=' + MRIsite.value + '&Scans=' + scanArray,
        type: 'GET',
        data: 'html',
        success: function(response) {
        $('#mri').html(response);
        }  
       });
     }

