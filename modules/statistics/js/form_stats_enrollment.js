/*global document, $*/
function updateEnrollmentTab() {       
    var EnrollmentProject = document.getElementById("EnrollmentProject");
    var EnrollmentSite = document.getElementById("EnrollmentSite");
    var request = $.ajax({
        url: '/main.php?test_name=statistics&subtest=stats_enrollment&dynamictabs=dynamictabs&EnrollmentProject=' + EnrollmentProject.value + '&EnrollmentSite=' + EnrollmentSite.value,
        type: 'GET',
        data: 'html',
        success: function(response) {
            $('#enroll').html(response);
        }
   });
}
