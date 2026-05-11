<div class="list-group bvl-feedback-item">
    {foreach from=$notifications item=link}
        <a href="{$baseURL}{$link.URL}" class="list-group-item">
            {if $link.new eq 1}
                <span class="pull-left new-flag">{dgettext("loris", "NEW")}</span>
            {/if}
            <span class="pull-right text-muted small">{dgettext("loris", "Updated")}: {$link.Testdate}</span>
            <br>
            {dgettext("bvl_feedback", "{$link.Name}")}: {dgettext("bvl_feedback", "{$link.Comment}")}
        </a>
    {/foreach}
</div>
