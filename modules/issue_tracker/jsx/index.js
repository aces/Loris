import IssueForm from './IssueForm';

/**
 * Render IssueForm on page load
 */
$(function() {
  const args = QueryString.get();
  const issueTracker = (
    <div className="page-issue-tracker">
      <IssueForm
        Module="issue_tracker"
        DataURL={`${loris.BaseURL}/issue_tracker/ajax/EditIssue.php?action=getData&issueID=${args.issueID}`}
        action={`${loris.BaseURL}/issue_tracker/ajax/EditIssue.php?action=edit`}
      />
    </div>
  );

  ReactDOM.render(issueTracker, document.getElementById('lorisworkspace'));
});
