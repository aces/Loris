<div class="list-group bvl-feedback-item">
    {foreach from=$notifications item=link}
        <a href="{$baseURL}{$link.URL}" class="list-group-item">
            {if $link.new eq 1}
                <span class="pull-left new-flag">NEW</span>
            {/if}
            <span class="pull-right text-muted small">Updated: {$link.Testdate}</span>
            <br>
            {$link.Name}: {$link.Comment}
        </a>
    {/foreach}
</div>
