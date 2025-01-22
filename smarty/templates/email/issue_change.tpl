Subject: Change to Issue # - {$issueID}
{$firstname},

{$currentUser} has updated an issue "{$title}" you are watching.

{if $comment !== "null"}
    {$currentUser} commented: "{$comment}"
{/if}

Please view the changes here: {$url}

Thank you,

LORIS Team