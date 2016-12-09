/* global ReactDOM, formatColumn */

$(document).ready(function() {
  const querystring = QueryString.get();
  if (loris.Subtest) {
    createEditIssue(querystring);
  } else {
    issueTracker(querystring);
  }
});

/**
 * Renders DynamicTable for all tabs on the main issue tracker page
 *
 * @param querystring
 */
function issueTracker(querystring) {
  let url = loris.BaseURL + '/issue_tracker/?format=json';
  if (querystring && querystring.submenu) {
    url += '&submenu=' + querystring.submenu;
  }

  ReactDOM.render(
    <DynamicDataTable
      DataURL={url}
      getFormattedCell={formatColumn}
    />,
    document.getElementById("datatable")
  );
}

/**
 * Renders the form when creating or editing an issue
 *
 * @param querystring
 */
function createEditIssue(querystring) {
  const url = loris.BaseURL + '/issue_tracker/ajax/EditIssue.php';
  const issueID = querystring.issueID ? querystring.issueID : '';

  ReactDOM.render(
    <IssueEditForm
      DataURL={url + '?action=getData&issueID=' + issueID}
      action={url + '?action=edit'}
    />,
    document.getElementById("issue-form")
  );
}
