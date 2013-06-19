/*global document, $*/
function updateDemographicTab() {
    var DemographicSite = document.getElementById("DemographicSite");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs&DemographicSite=' + DemographicSite.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#demographics').html(response);
  
        }
    });
}
