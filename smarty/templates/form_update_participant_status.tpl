{if $success}

<p>Participant Status was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_participant_status" id="update_participant_status" enctype="multipart/form-data">
{if not $success}
<table class="std">
<!-- table title -->
<tr><th colspan="2">Update Participant Status</th></tr>

{foreach from=$form.errors item=error}
<tr>
<td nowrap="nowrap" colspan="2" class="error">{$error}</td>
</tr>
{/foreach}
<tr>
<td nowrap="nowrap" id="pscid">PSCID: {$pscid}</td>
<td nowrap="nowrap" >DCCID: {$candID}</td>
</tr>
<tr>

<td nowrap="nowrap">Participant Status</td>
<td>
{html_options id="participant_status" options=$pstatus_options name="participant_status" selected=$pstat}
</td>
<tr>
    <td>
Specify Reason</br>(Required only for status Inactive/Incomplete)
    </td>
    <td>
    <div>
    <select name="participant_suboptions" id="participant_suboptions">
    </select>
    </div>
    </td>
    <tr>
    <td nowrap="nowrap" >{$form.reason_specify_group.label}</td>
    <td nowrap="nowrap" >{$form.reason_specify_group.html}</td>
    </tr>

<tr>
<td nowrap="nowrap">&nbsp;</td>
<td nowrap="nowrap" colspan="2">
<input class="button" name="fire_away" value="Save" type="submit" />
{/if}
<input class="button" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to profile" type="button" />

</td>
</tr>

</table>
