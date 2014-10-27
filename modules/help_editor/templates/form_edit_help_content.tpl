{if $success}

<p>Content was updated successful<br /></p>
<br />
{/if}
<form method="post" name="edit_help_content" id="edit_help_content" enctype="multipart/form-data">
{if not $success}
<div class="panel panel-primary">
   
    <div class="panel-body">
        {foreach from=$form.errors item=error}
            <font class="error">{$error}</font>
        {/foreach}
        <div class="row">
            <label class="col-sm-2">{$form.title.label}</label>
            <div class="col-sm-4">
                {$form.title.html}
            </div>
        </div>
        <br>  
        <div class="row">
            <div class="col-sm-8">
                {$form.content.html}
            </div>
        </div>
        {foreach from=$elements_list item=element}
            <div class="row">
                <label class="col-sm-4">{$form.$element.label}</label>
                <div class="col-sm-8">
                    {$form.$element.html}
                </div>
            </div>
            <div class="col-xs-12"></div>
            <div class="col-xs-12"></div>
            <div class="col-xs-12"></div>
        {/foreach}
        <br>
        <input class="btn btn-sm btn-primary col-sm-offset-3" name="fire_away" value="Save" type="submit" />
        {/if}
        <input class="btn btn-sm btn-primary" onclick="location.href='{$url}'" value="Return to {$module_name}" type="button" />

    </div>
</div>
