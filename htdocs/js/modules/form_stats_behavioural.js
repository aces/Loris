/*global document, $*/
function updateBehaviouralTab() {
    var BehaviouralProject = document.getElementById("BehaviouralProject");
   // var BehaviouralSite = document.getElementById("BehaviouralSite");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_behavioural&dynamictabs=dynamictabs&BehaviouralProject=' + BehaviouralProject.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#data_entry').html(response);
        }
    });
}

