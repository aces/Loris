/*global document, $*/
function updateDemographicTab() {
    var DemographicSite       = document.getElementById("DemographicSite");
    var DemographicProject    = document.getElementById("DemographicProject");
    var DemographicInstrument = document.getElementById("DemographicInstrument");
    var request = $.ajax(
        {
            url: loris.BaseURL + '/statistics/stats_demographic/?dynamictabs=dynamictabs&DemographicSite=' + DemographicSite.value + '&DemographicProject=' + (DemographicProject==null ? "" : DemographicProject.value)+'&DemographicInstrument='+DemographicInstrument.value,
            type: 'GET',
            data: 'html',
            success: function(response) {
                $('#demographics').html(response);
                $(".dynamictable").DynamicTable();
            }
        }
    );
}
