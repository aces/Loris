<div class="row">
  <div class="col-md-10">
    <div id="issue-edit-form"></div>
  </div>
</div>

<script>
  var issue = RIssueEditForm({
    "DataURL": "{$baseurl}/issue_tracker/ajax/EditIssue.php?action=getData&issueID=" + {$smarty.get.issueID},
    "action": "{$baseurl}/issue_tracker/ajax/EditIssue.php?action=edit"
  });
  ReactDOM.render(issue, document.getElementById("issue-edit-form"));
</script>