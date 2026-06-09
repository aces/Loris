Subject: Issue Assigned - #{$issueID} [{$study}]
{$firstname},

The issue "{$title}" that is assigned to you has been modified.

{if $comment !== "null"}
    {$currentUser} commented: "{$comment}"

{/if}
Please see the issue here: {$url}

Thank you,

LORIS Team