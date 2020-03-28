$(document).ready(function () {
  $("#new_profile").submit(function (event) {
    event.preventDefault();
    $("[name=fire_away]").prop('disabled',true);
    if (!confirm('Personal data cannot be changed once entered. Are you sure all data is correct?')) {
      return;
    }
    //generate the GUID
    var first_name = $("[name=first_name]").val(),
      middle_name = $("[name=middle_name]").val(),
      last_name = $("[name=last_name]").val(),
      city_of_birth = $("[name=city_of_birth]").val(),
      date_of_birth = $("[name=dob1]").val(),
      gender = $("[name=gender]").val();  //todo: ensure acceptable for hash algo, loris, pii

    var OpenScienceIdentity = require('open-science-identity').OpenScienceIdentity;
    var id = new OpenScienceIdentity({
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      city_of_birth: city_of_birth,
      birth_day: date_of_birth,
      gender: gender
    });
    try {
      var guid = id.toSignature();
    }
    catch (exception) {
      alert(exception);
      return;
    }

    $('<input>').attr({
      type: 'hidden',
      name: 'guid',
      value: guid
    }).appendTo('#new_profile');

    //submit the patient to the PII system, if allowed
    $.ajax({
      type: 'get',
      url: '/AjaxHelper.php?Module=new_profile&script=getPiiAccessAllowed.php',
    }).then(function (allowed) {
        return !allowed ? false : $.ajax({
            type: 'get',
            url: '/AjaxHelper.php?Module=new_profile&script=getPiiAccessToken.php&csrf_token=' + $('[name="csrf_token"]').val(),
          }
        )
      }
    ).then(function (allowedOrToken) {
      return !allowedOrToken ? false : $.ajax({
        type: "post",
        url: pii_api_base_url + '/api/loris_create_patient',
        data: {
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          city_of_birth: city_of_birth,
          date_of_birth: date_of_birth,
          sex: gender === 'Male' ? 'M' : gender === 'Female' ? 'F' : '',
          guid: guid,
          one_time_token: allowedOrToken
        }
      })
    }).then(function (allowedOrData) {
      if (!allowedOrData) {
        //just submit to Loris, as we don't depend on the PII here
        $("#new_profile").off('submit').submit();  //unhook our submit handler, then submit
      }
      else if (allowedOrData.condition === 'OK') {
        $("#new_profile").off('submit').submit();  //unhook our submit handler, then submit
      }
      else if (allowedOrData.condition === 'duplicate patient') {
        if (confirm('Patient already exists.  Redirect to patient record?')) {
          window.location.href = '/' + allowedOrData.candidate_id + '/';
        }
      }
      else {
        alert('Error on creation in PII system. Unhandled condition: ' + allowedOrData.condition + '. Contact your system administrators.');
      }
    }).fail(function (xhr, statusText, errorText) {
      alert('Error on creation in PII system: ' + errorText + '. Contact your system administrators.');
    });
  });
});
