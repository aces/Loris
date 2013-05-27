function updateMRI()
{
    var site3 = document.getElementById("site3");
    var project3 = document.getElementById("project3");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_MRI&dynamictabs=dynamictabs&project3=' + project3.value + '&site3=' + site3.value,
        type: 'GET',
        data: 'html',
        success: function(response, textStatus, jqXHR)
        {
            $('#mri').html(response);
        }
    });
}

