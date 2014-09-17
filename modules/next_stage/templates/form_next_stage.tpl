{if $success}

<p>Next stage started. <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}">Click here to continue</a>.</p>

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
        <div class="col-sm-offset-2 col-sm-4 col-md-3"><input class="btn btn-primary col-xs-12" type="submit" name="fire_away" value="Start {$stage}" /></div>
    </div>

    {$form.hidden}
</form>
<div class="row">
    {if $stage == "Screening"}
    <p>The date of {$stage|lower} is the <em>administration date of the first behavioural instrument</em>.</p>
    {elseif $stage == "Visit"}
    <p>The date of {$stage|lower} is the <em>date of the first MR scan</em>.<br />
    In case the scan was not done,<br />enter the date of the subject"s visit to the site.<br />
    <em>Scan Done Field</em>: As per Scanning and Evaluation Report.</p>
    {else}
    <p>This is not a valid stage to start!</p>
    {/if}
</div>

{/if}

