/*global document, $*/
function updateReliabilityTab() {
    var ReliabilitySite    = document.getElementById("ReliabilitySite");
    var ReliabilityProject = document.getElementById("ReliabilityProject");
    var request            = $.ajax(
        {
            url: loris.BaseURL + '/statistics/stats_reliability/?dynamictabs=dynamictabs&ReliabilitySite=' + ReliabilitySite.value + '&ReliabilityProject=' + (ReliabilityProject==null ? "" : ReliabilityProject.value),
            type: 'GET',
            data: 'html',
            success: function(response) {
                $('#reliability').html(response);
            }
        }
    );
}
