<div class="panel panel-default">
    {if $title}
    <div class="panel-heading">
        <h3 class="panel-title">{$title}</h3>
        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
    </div>
    {/if}
    <div class="panel-body">
        {$body}
    </div>
    {if $footer}
    <div class="panel-footer">
        {$footer}
    </div>
    {/if}

</div>

