<!-- Welcome panel -->
<div class="panel panel-default">
    <div class="panel-body">
        <h3 class="welcome">Welcome, {$username}.</h3>
        <p class="pull-right small login-time">Last login: {$last_login}</p>
        {if !is_null($project_description)}
        <p class="project-description">{$project_description}</p>
        {/if}
    </div>
    <!-- Only add the welcome panel footer if there are links -->
    {if $dashboard_links neq ""}
    <div class="panel-footer">|
        {foreach from=$dashboard_links item=link}
            <a href="{$link.url}" target="{$link.windowName}">{$link.label}</a>
        |
        {/foreach}
    </div>
    {/if}
</div>
