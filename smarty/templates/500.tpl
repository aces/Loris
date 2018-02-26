<div class="container">
{foreach from=$error_message item=message}
    <h2>{$message}</h2>
{/foreach}
    <div><a href="{$baseurl}">Go to login page</a></div>
</div>
