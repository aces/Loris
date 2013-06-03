function updateDemographicInstrument() {
    var DemographicSite = document.getElementById("DemographicSite");
    var DemographicInstrument = document.getElementById("DemographicInstrument");
    var DemographicProject = document.getElementById("DemographicProject");
    var request = $.ajax({
        url: 'main.php?test_name=statistics&subtest=stats_demographic&dynamictabs=dynamictabs&DemographicSite=' + DemographicSite.value + '&DemographicInstrument=' + DemographicInstrument.value + '&DemograpicProject=' + DemographicProject.value,
        type: 'GET',
        data: 'html',
        success: function(page, textStatus, jqXHR)
        {
            $('#demographics').html(page);
        }
    });
}


function updateMRITable() {
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
