{if $success}

<p>Participant Status was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_participant_status" id="update_participant_status" enctype="multipart/form-data">
{if not $success}
<div class="panel panel-primary">
    <div class="panel-heading">
        Update Participant Status
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
            <label class="col-sm-4">Participant Status</label>
            <div class="col-sm-8">
                {html_options id="participant_status" options=$pstatus_options name="participant_status" selected=$pstat}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">Specify Reason</br>(Required only for status Inactive/Incomplete)</label>
            <div class="col-sm-8">
                {html_options id="participant_suboptions" options=$pstatus_suboptions name="participant_suboptions" selected=$pstat_sub}
            </div>
        </div>
        <div class="row">
            <label class="col-sm-4">{$form.reason_specify_group.label}</label>
            <div class="col-sm-8">
                {$form.reason_specify_group.html}
            </div>
        </div>
        <input class="btn btn-sm btn-primary col-sm-offset-2" name="fire_away" value="Save" type="submit" />
        {/if}
        <input class="btn btn-sm btn-primary" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to Candidate Info" type="button" />
    </div>
</div>