Subject: [LORIS Study {$study}] Document Repository Changes 

You are receiving this automated email because: 

{if isset($newDocument)}
New document named "{$document}" was added!
Visit {$newDocument} to view the updates.
{/if}
{if isset($updatedDocument)}
Existing document named "{$document}" was updated!
Visit {$updatedDocument} to view the updates.
{/if}
{if isset($deleteDocument)}
Existing document named "{$document}" was deleted!
Visit {$deleteDocument} to view the updates.
{/if}
{if isset($newCategory)}
New category named "{$category}" was added!
Visit {$newCategory} to view the updates.
{/if}

Thank you,

LORIS Team
