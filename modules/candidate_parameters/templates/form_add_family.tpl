{if $success}

<p>Family added successful<br /></p>
<br />
{/if}


<form method="post" name="add_family" id="add_family" enctype="multipart/form-data">
{if not $success}
<div class="panel panel-primary">
    <div class="panel-heading">
        Add Family Member Information
    </div>
    <div class="panel-body">
        {foreach from=$form.errors item=error}
            <font class="error">{$error}</font>
        {/foreach}
        <div class="row">
            <label class="col-sm-2">{$form.pscid.label}</label>
            <div class="col-sm-10" id="pscid">
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
            <label class="col-sm-4">{$form.FamilyMemberID.label}</label>
            <div class="col-sm-8">
                {$form.FamilyMemberID.html}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">{$form.relation_type.label}</label>
            <div class="col-sm-8">
                {$form.relation_type.html}
            </div>
        </div>
        <input class="btn btn-sm btn-primary col-sm-offset-2" name="fire_away" value="Save" type="submit" />
        {/if}
        <input class="btn btn-sm btn-primary" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to Candidate Info" type="button" />
    </div>
</div>