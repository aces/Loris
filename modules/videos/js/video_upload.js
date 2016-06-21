$(function () {

  var instrumentSelect = $("#instrumentSelect");
  var candidateSelect = $("#candidateSelect");
  var visitSelect = $("#visitSelect");
  var uploadedFile = $("input[name='video_file']");
  var btnUpload = $("#btn-upload");
  var candidateID = null;

  // Validate input on change
  candidateSelect.on("change", function () {
    validateInput(candidateSelect);
  });
  visitSelect.on("change", function () {
    validateInput(visitSelect);
  });
  uploadedFile.on("change", function () {
    validateInput(uploadedFile);
  });

  btnUpload.on('click', function () {
    console.log("hi");
    // NEED to use single '&' to avoid short-circuting
    var formStatus = (
      validateInput(candidateSelect) &
      validateInput(visitSelect) &
      validateInput(uploadedFile)
    );

    if (formStatus) {
      if (isValidFileName(candidateSelect, visitSelect, instrumentSelect, uploadedFile)) {
        var form = document.getElementById("video_upload");
        uploadFile(form, uploadedFile);
      } else {
        var msg = getValidFileName(candidateSelect, visitSelect, instrumentSelect);
        alert("File name should start with: " + msg);
      }
    }
  });
});

/**
 * Given a PSCID returns a corresponding candID
 * or an empty string if not found
 *
 * @returns {string}
 */
function getCandidateID(pscid) {
  if (pscid == null || pscid == "") return "";

  // candidateIds is a global variable set in the tpl
  for (id in candidateIds) {
    if (id == pscid) return candidateIds[id];
  }

  return "";
}

/**
 * Returns a valid file name string used as a prefix for all uploaded files.
 *
 * @returns {string}
 */
function getValidFileName(candidate, visit, instrument) {

  var pscid = candidate.find(":selected").text();
  var visitLabel = visit.find(":selected").text();
  var candID = getCandidateID(pscid);
  var fileName = pscid + "_" + candID + "_" + visitLabel;

  // set global candID
  candidateID = candID;

  if (instrument.find(":selected").text() != "") {
    fileName += "_" + instrument.find(":selected").text()
  }

  return fileName;
}

/**
 * Make sure that user supplied file name starts with valid file name string.
 *
 * @returns {boolean}
 */
function isValidFileName(candidate, visit, instrument, uploadedFile) {
  var fileName = uploadedFile.prop("files")[0].name;
  var requireFileName = getValidFileName(candidate, visit, instrument);

  return (fileName.indexOf(requireFileName) > -1);
}

/**
 * Validates input and displays error message if needed
 * @param inputElement
 * @returns {boolean}
 */
function validateInput(inputElement) {
  var parentSection = inputElement.closest(".form-inline");
  var isValid;

  // Define validate condition
  if (inputElement.prop("type") == "file") {
    isValid = inputElement.prop("files")[0];
  } else {
    isValid = (inputElement.find(":selected").text() != "");
  }

  // Show/Hide error message depending on input
  if (isValid) {
    parentSection.removeClass("has-error");
    parentSection.find(".error-msg").hide();
    return true;
  } else {
    parentSection.addClass("has-error");
    parentSection.find(".error-msg").show();
    return false;
  }
}

/*
 Uploads file to the server, listening to the progress
 in order to get the percentage uploaded as value for the progress bar
 */
function uploadFile(form, uploadedFile) {

  uploadedFile.closest('.form-group').hide();
  $("#file-progress").removeClass('hide');
  var formData = new FormData(form);
  formData.append("fire_away", "Upload");
  formData.append("candID", candidateID);
  $.ajax({
    type:        'POST',
    url:         loris.BaseURL + "/videos/video_upload/",
    data:        formData,
    cache:       false,
    contentType: false,
    processData: false,
    xhr:         function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener(
        "progress",
        function (evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar"),
              progresslabel = $("#progresslabel"),
              percent = Math.round((evt.loaded / evt.total) * 100);
            $(progressbar).width(percent + "%");
            $(progresslabel).html(percent + "%");
            progressbar.attr('aria-valuenow', percent);
          }
        },
        false
      );
      return xhr;
    },
    success:     function (data) {
      document.open();
      document.write(data);
      document.close();
    }
  });
}