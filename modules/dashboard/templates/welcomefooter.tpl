{foreach from=$dashboard_links item=link name=links}
    <a href="{$link.url}" target="{$link.windowName|default}">{$link.label}</a>
    {if !$smarty.foreach.links.last}|{/if}
{/foreach}
