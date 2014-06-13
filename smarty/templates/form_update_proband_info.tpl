{if $success}

<p>Proband Information was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_proband_info" id="update_proband_info" enctype="multipart/form-data">
{if not $success}
<div class="panel panel-primary">
    <div class="panel-heading">
        Update Proband Information
    </div>
    <div class="panel-body">
        {foreach from=$form.errors item=error}
            <font class="error">{$error}</font>
        {/foreach}
        <div class="row">
            <label class="col-sm-2">{$form.pscid.label}</label>
            <div class="col-sm-10">
                {$pscid}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-2">DCCID:</label>
            <div class="col-sm-10">
                {$candID}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">{$form.ProbandGUID.label}</label>
            <div class="col-sm-8">
                {$form.ProbandGUID.html}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">{$form.ProbandGender.label}</label>
            <div class="col-sm-8">
                {$form.ProbandGender.html}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">{$form.ProbandDoB.label}</label>
            <div class="col-sm-8">
                {$form.ProbandDoB.html}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">{$form.ProbandDoB2.label}</label>
            <div class="col-sm-8">
                {$form.ProbandDoB2.html}
            </div>
        </div>
        <input class="btn btn-sm btn-primary col-sm-offset-2" name="fire_away" value="Save" type="submit" />
        {/if}
        <input class="btn btn-sm btn-primary" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to Candidate Info" type="button" />
    </div>
</div>