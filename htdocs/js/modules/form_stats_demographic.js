/*global document, $*/
function updateDemographicTab() {
    var DemographicSite = document.getElementById("DemographicSite"),
        DemographicProject = document.getElementById("DemographicProject"),
        request = $.ajax({
            url: '/main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs&DemographicSite=' + DemographicSite.value + '&DemographicProject=' + DemographicProject.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#demographics').html(response);
  
        }
        }
    );
}
