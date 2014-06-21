/*global document, $*/
function updateDemographicTab() {
    var DemographicSite = document.getElementById("DemographicSite");
    var DemographicProject = document.getElementById("DemographicProject");
    var DemographicInstrument = document.getElementById("DemographicInstrument");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs&DemographicSite=' + DemographicSite.value + '&DemographicProject=' + DemographicProject.value+'&DemographicInstrument='+DemographicInstrument.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#demographics').html(response);
  
        }
    });
}
