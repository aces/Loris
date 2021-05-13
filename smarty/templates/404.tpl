<div class="container">
    <h2>404: Not Found</h2>
    <h3>{$message}</h3>
    <div><a href="{$baseurl|default}">Go to main page</a>{if $canReport|default}or <a href="{$issueTrackerURL}">report an issue</a>{/if}.

    {if $contact|default}
    If you have any questions, please <a href="mailto:{$contact|default}">contact your project administrator.</a></div>
{/if}
</div>
