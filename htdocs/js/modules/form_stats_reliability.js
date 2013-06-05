function updateReliabilityTab() 
    {
    var ReliabilitySite = document.getElementById("ReliabilitySite");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_reliability&dynamictabs=dynamictabs&ReliabilitySite=' + ReliabilitySite.value,
        type: 'GET',
        data: 'html',
        success: function(response, textStatus, jqXHR)
        {
            $('#reliability').html(response);
        }
    });
}

