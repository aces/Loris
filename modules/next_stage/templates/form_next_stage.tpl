{if $success}

<p>{dgettext("next_stage", "Next stage started.")} <a href="{$baseURL}/instrument_list/?candID={$candID}&sessionID={$sessionID}">{dgettext("next_stage", "Click here to continue.")}</a>.</p>

{else}

<br />
<form method="post" name="next_stage" id="next_stage">
    {foreach from=$form.errors item=error}
        <div class="col-sm-12">
            <label class="error col-sm-12">{$error}</label>
        </div>
    {/foreach}
    <div class="form-group row">
        <label class="col-sm-2">{sprintf(dgettext("next_stage", "Date of %s"), dgettext("loris", $stage))}</label>
        <div class="col-sm-4 col-md-3">{$form.date1.html}</div>
    </div>
    <div class="form-group row">
        <label class="col-sm-2">{sprintf(dgettext("next_stage", "Retype Date of %s"), dgettext("loris", $stage))}</label>
        <div class="col-sm-4 col-md-3">{$form.date2.html}</div>
    </div>
    {if $form.CohortID.html != ""}
    <div class="form-group row">
        <label class="col-sm-2">{dgettext("next_stage", "CohortID:")}</label>
        <div class="col-sm-4 col-md-3">{$form.CohortID.html}</div>
    </div>
    {/if}

    <div class="form-group row">
        <div class="col-sm-offset-2 col-sm-4 col-md-3"><input class="btn btn-primary col-xs-12" type="submit" name="fire_away" value="{sprintf(dgettext("next_stage", "Start %s"), dgettext("loris", $stage))}" onClick="this.form.submit(); this.disabled=true;"/></div>
    </div>

    {$form.hidden}
</form>

{/if}

