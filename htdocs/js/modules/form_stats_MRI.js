/*global document, $*/
function updateMRITab() {
    var MRIProject = document.getElementById("MRIProject");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_MRI&dynamictabs=dynamictabs&MRIProject=' + MRIProject.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
        $('#mri').html(response);
        }  
       });
     } 
