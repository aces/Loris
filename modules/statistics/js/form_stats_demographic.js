/*global document, $*/
var lorisFetch = window.lorisFetch || fetch;
function updateDemographicTab() {
    var DemographicSite       = document.getElementById("DemographicSite");
    var DemographicProject    = document.getElementById("DemographicProject");
    var DemographicInstrument = document.getElementById("DemographicInstrument");
    lorisFetch(
        loris.BaseURL + '/statistics/stats_demographic/?dynamictabs=dynamictabs&DemographicSite=' +
        DemographicSite.value + '&DemographicProject=' +
        (DemographicProject==null ? "" : DemographicProject.value) +
        '&DemographicInstrument=' + DemographicInstrument.value,
        {credentials: 'same-origin'}
    )
        .then(function(response) {
            if (!response.ok) {
                throw new Error('request_failed');
            }
            return response.text();
        })
        .then(function(response) {
            $('#demographics').html(response);
            $(".dynamictable").DynamicTable();
        });
}
