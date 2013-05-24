function updateBehavioural()
{
    var project2 = document.getElementById("project");
    var site2 = document.getElementById("site");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_behavioural&dynamictabs=dynamictabs&project2=' + project2.value + '&site2=' + site2.value,
        type: 'GET',
        data: 'html',
        success: function(response, textStatus, jqXHR)
        {
            $('#data_entry').html(response);
        }
    });
}
