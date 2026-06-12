<div class="{if empty($smallwidgets)}col-lg-12{else}col-lg-8{/if}">{section name=widget loop=$mainwidgets}{$mainwidgets[widget]}{/section}</div>
{if !empty($smallwidgets)}
<div class="col-lg-4">{section name=widget loop=$smallwidgets}{$smallwidgets[widget]}{/section}</div>
{/if}
