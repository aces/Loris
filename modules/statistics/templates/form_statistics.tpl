<div id="tabs" style="background: white">
    <div class="hidden-xs hidden-sm">
        <ul class="nav nav-tabs">
            {foreach from=$StatsTabs item=tab name=tabs}
            <li class="statsTab{if $smarty.foreach.tabs.first} active onLoad{/if}">
                <a class="statsTabLink" value="{$baseurl}/{$tab.ModuleName}/{$tab.SubModuleName}/?dynamictabs=dynamictabs">{$tab.Description}</a>
            </li>
            {/foreach}
        </ul>
    </div>
    <div class="visible-xs visible-sm panel panel-primary">
        <div class="panel-heading" onclick="toggleTabs()">
            <label id="hiddenTabs">General Description</label>
            <span class="glyphicon glyphicon-chevron-down pull-right" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up" style="display:none"></span>
        </div>
        <ul class="list-group" style="display:none" id="tabsContent">
            {foreach from=$StatsTabs item=tab}
            <li class="statsTab list-group-item">
                <a class="statsTabLink" value="{$baseurl}/{$tab.ModuleName}/{$tab.SubModuleName}/?dynamictabs=dynamictabs">{$tab.Description}</a>
            </li>
            {/foreach}
        </ul>
    </div>
    <div class="tab-content">
        <div class="tab-pane active">
        </div>
    </div>
</div>
