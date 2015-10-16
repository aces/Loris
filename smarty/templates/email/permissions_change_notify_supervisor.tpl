Subject: [LORIS Study {$study}] Permission Changes for {$realname}

You are receiving this email because user {$current_user} has edited the permissions for {$realname} (username: {$username}).

{if $permissions_added}
The following permissions have been added:
{foreach from=$permissions_added item=new_permission}
    - {$new_permission}
{/foreach}
{/if}

{if $permissions_removed}
The following permissions have been removed:
{foreach from=$permissions_removed item=old_permission}
    - {$old_permission}
{/foreach}
{/if}

Thank you,

LORIS Team
