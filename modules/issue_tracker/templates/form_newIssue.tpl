<div class="row">
    <div class="col-md-10">
        <div id="issue-newIssue-form"></div>
    </div>
</div>

<script>
    var issue = RIssueEditForm({
        "DataURL": "{$baseurl}/issue_tracker/ajax/EditIssue.php?action=getData&issueID=" + {$smarty.get.issueID},
        "action": "{$baseurl}/issue_tracker/ajax/EditIssue.php?action=edit"
    });
    React.render(issue, document.getElementById("issue-newIssue-form"));
</script>