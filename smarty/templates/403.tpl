<div class="container">
    <h2>403: Forbidden</h2>
    <h3>{$message}</h3>
    <div>
        <a href="{$baseurl}">Go to main page</a>
        | <a onclick="window.history.back();" href="#">Go back one page</a>
        {if $anonymous}
            | <a href="/login?redirect={$url}">Try logging in</a>
        {/if}
    </div>
</div>
