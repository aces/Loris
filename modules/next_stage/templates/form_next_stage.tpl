{if $success}

<p>Next stage started. <a href="{$baseURL}/instrument_list/?candID={$candID}&sessionID={$sessionID}">Click here to continue</a>.</p>

{else}

<br />
<form method="post" name="next_stage" id="next_stage">
    {foreach from=$form.errors item=error}
        <div class="col-sm-12">
            <label class="error col-sm-12">{$error}</label>
        </div>
    {/foreach}
    <div class="form-group row">
        <label class="col-sm-2">Date of {$stage}</label>
        <div class="col-sm-4 col-md-3">{$form.date1.html}</div>
    </div>
    <div class="form-group row">
        <label class="col-sm-2">Retype Date of {$stage}</label>
        <div class="col-sm-4 col-md-3">{$form.date2.html}</div>
    </div>
    {if $form.SubprojectID.html != ""}
    <div class="form-group row">
        <label class="col-sm-2">SubprojectID:</label>
        <div class="col-sm-4 col-md-3">{$form.SubprojectID.html}</div>
    </div>
    {/if}

    {if $form.scan_done.html != ""}
    <div class="form-group row">
        <label class="col-sm-2">Scan Done:</label>
        <div class="col-sm-4 col-md-3">{$form.scan_done.html}</div>
    </div>
    {/if}
    <div class="form-group row">
        <div class="col-sm-offset-2 col-sm-4 col-md-3"><input class="btn btn-primary col-xs-12" type="submit" name="fire_away" value="Start {$stage}" onClick="this.form.submit(); this.disabled=true;"/></div>
    </div>

    {$form.hidden}
</form>

{/if}

