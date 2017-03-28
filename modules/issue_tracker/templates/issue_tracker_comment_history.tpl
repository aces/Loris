<p></p>
{foreach $commentHistory as $comment }
    {if $comment.fieldChanged == 'comment'}
        <p> [{$comment.dateAdded}] {$comment.addedBy} commented <i> {$comment.newValue} </i> </p>
    {else}
        <p> [{$comment.dateAdded}] {$comment.addedBy} updated the <b>{$comment.fieldChanged} </b> to {$comment.newValue} </p>
    {/if}
{/foreach}