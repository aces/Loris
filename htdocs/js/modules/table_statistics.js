function updateDemographicInstrument() {
    var site = document.getElementById("site");
    var instrument = document.getElementById("instrument");
    var request = $.ajax({
        url: 'main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs&site=' + site.value + '&instrument=' + instrument.value,
        type: 'GET',
        data: 'html',
        success: function(page, textStatus, jqXHR)
        {
            $('#demographics').html(page);
        }
    });*/
}


function updateMRI() {
    var selectedMRI_TYPE = document.getElementById("mri_type");
    var request = $.ajax({
url: 'main.php?test_name=statistics&subtest=stats_MRI&dynamictabs=dynamictabs&mri_type=' + selectedMRI_TYPE.value,
type: 'GET',
data: 'html',
success: function(page, textStatus, jqXHR)
{
$('#mri').html(page);
}
});
}
