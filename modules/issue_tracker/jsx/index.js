import IssueForm from './IssueForm';

/**
 * Render IssueForm on page load
 */
window.addEventListener('load', () => {
  const id = location.href.split('/issue/')[1];
  ReactDOM.render(
    <IssueForm
      Module='issue_tracker'
      DataURL={`${loris.BaseURL}/issue_tracker/ajax/EditIssue.php?action=getData&issueID=${id}`}
      action={`${loris.BaseURL}/issue_tracker/ajax/EditIssue.php?action=edit`}
      issue={id}
    />,
    document.getElementById('lorisworkspace')
  );
});
