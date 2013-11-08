/*global document, $*/
function updateReliabilityTab() {
    var ReliabilitySite = document.getElementById("ReliabilitySite");
    var ReliabilityProject = document.getElementById("ReliabilityProject");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_reliability&dynamictabs=dynamictabs&ReliabilitySite=' + ReliabilitySite.value + '&ReliabilityProject=' + ReliabilityProject.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#reliability').html(response);
        }
    });
}

