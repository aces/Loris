<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">My Tasks</h3>
        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
    </div>
    <div class="panel-body">
    {if !empty($tasks)}
    {foreach from=$tasks item=task}
    {if $task->Number() neq 0}
        <a href="{$task->Link()}" class="list-group-item new-scans">
            <div class="row">
                <div class="col-xs-8 text-left">
                    <div class="huge">{$task->Number()}</div>
                    {$task->Label()}
                </div>
                <div class="col-xs-4 text-right alert-chevron">
                    <span class="glyphicon glyphicon-chevron-right medium"></span>
                    <p class="small task-site">{$task->SiteLabel()}</p>
                </div>
            </div>
        </a>
    {/if}
    {/foreach}	
    {else}
    No open tasks for you.
    {/if}
</div>
</div>
