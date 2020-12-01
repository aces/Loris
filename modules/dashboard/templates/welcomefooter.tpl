{foreach from=$dashboard_links item=link name=links}
    {if !isset($link.windowName)}
        {$link.windowName = ''}
    {/if}
    <a href="{$link.url}" target="{$link.windowName}">{$link.label}</a>
    {if !$smarty.foreach.links.last}|{/if}
{/foreach}
