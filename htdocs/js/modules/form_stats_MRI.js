function updateMRITab()
{
    var MRIsite = document.getElementById("MRIsite");
    var MRIproject = document.getElementById("MRIproject");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_MRI&dynamictabs=dynamictabs&MRIproject=' + MRIproject.value + '&MRIsite=' + MRIsite.value,
        type: 'GET',
        data: 'html',
        success: function(response, textStatus, jqXHR)
        {
            $('#mri').html(response);
        }
    });
}

