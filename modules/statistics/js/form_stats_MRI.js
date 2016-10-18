/*global document, $*/
$('#selectall').click(
    function(event) {
        if(this.checked) {
            $('input:checkbox[id=MRIScans]').each(
                function() {
                    this.checked = true;
                }
            );
        }else{
            $('input:checkbox[id=MRIScans]').each(
                function() {
                    this.checked = false;
                }
            );
        }
    }
);

$('input:checkbox[id=MRIScans]').click(
    function(event) {
        if(this.checked) {
            if ($('input:checkbox[id=MRIScans]:checked').length==$('input:checkbox[id=MRIScans]').length) {
                document.getElementById("selectall").checked =true;
            }
        }else{
            document.getElementById("selectall").checked =false;
        }
    }
);
//freezecolumn not sufficient for complex tables
//$(document).ready(function(){
//    $("#scandata").DynamicTable({ "freezeColumn" : "scantype" });
//});


function updateMRITab() {
    var MRIProject = document.getElementById("MRIProject");
    var MRIsite    = document.getElementById("MRIsite");
    var Scans      = document.getElementById("MRIScans");
    scanArray      =[];
    $("input:checkbox[id=MRIScans]:checked").each(
        function(){
            scanArray.push($(this).val());
        }
    );

    var request = $.ajax(
        {
            url: loris.BaseURL + '/statistics/stats_MRI/?dynamictabs=dynamictabs&MRIProject=' + (MRIProject==null ? "" : MRIProject.value) + '&MRIsite=' + MRIsite.value + '&Scans=' + scanArray,
            type: 'GET',
            data: 'html',
            success: function(response) {
                $('#mri').html(response);
            }
        }
    );
}
