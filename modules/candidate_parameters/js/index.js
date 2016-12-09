'use strict';

var queryStringArgs = QueryString.get();
var scriptArgs = QueryString.get(document.currentScript.src);

var candID = queryStringArgs.candID;
var getDataUrl = loris.BaseURL + '/candidate_parameters/ajax/getData.php?candID=' + candID;
var formHandlerUrl = loris.BaseURL + '/candidate_parameters/ajax/formHandler.php';

$(function () {
  // Adds tab href to url + opens tab based on hash on page load
  // See: http://bit.ly/292MDI8
  var hash = window.location.hash;
  if (hash) $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-tabs a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop() || $('html').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });

  var candidateInfo = React.createElement(CandidateInfo, {
    dataURL: getDataUrl + '&data=candidateInfo',
    action: formHandlerUrl,
    tabName: 'candidateInfo'
  });

  ReactDOM.render(candidateInfo, document.getElementById("cand-info"));

  if (loris.config('useProband') === "true") {
    var probandInfo = React.createElement(ProbandInfo, {
      dataURL: getDataUrl + '&data=probandInfo',
      action: formHandlerUrl,
      tabName: 'probandInfo'
    });
    ReactDOM.render(probandInfo, document.getElementById("proband-info"));
  } else {
    $('#proband-info-tab').hide();
  }

  if (loris.config('useFamilyID') === "true") {
    var familyInfo = React.createElement(FamilyInfo, {
      dataURL: getDataUrl + '&data=familyInfo',
      action: formHandlerUrl,
      tabName: 'familyInfo'
    });
    ReactDOM.render(familyInfo, document.getElementById("family-info"));
  } else {
    $('#family-info-tab').hide();
  }

  var participantStatus = React.createElement(ParticipantStatus, {
    dataURL: getDataUrl + '&data=participantStatus',
    action: formHandlerUrl,
    tabName: 'participantStatus'
  });

  ReactDOM.render(participantStatus, document.getElementById("participant-status"));

  if (scriptArgs.useConsent) {
    var consentStatus = React.createElement(ConsentStatus, {
      dataURL: getDataUrl + '&data=consentStatus',
      action: formHandlerUrl,
      tabName: 'consentStatus'
    });
    ReactDOM.render(consentStatus, document.getElementById("consent-status"));
  }
});
