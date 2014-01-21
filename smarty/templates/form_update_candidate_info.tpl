{if $success}

<p>Candidate Information was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_candidate_info" id="update_candidate_info" enctype="multipart/form-data">
{if not $success}
<table class="std">
<!-- table title -->
<tr><th colspan="2">Update Candidate Information</th></tr>

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
<td nowrap="nowrap">{$form.flagged_caveatemptor.label}</td>
<td nowrap="nowrap">{$form.flagged_caveatemptor.html}</td>
</tr>
<tr>
<td nowrap="nowrap">{$form.flagged_reason.label}</td>
<td nowrap="nowrap">{$form.flagged_reason.html}</td>
</tr>
<tr>
<td nowrap="nowrap">{$form.flagged_other_group.label}</td>
<td nowrap="nowrap">{$form.flagged_other_group.html}</td>
</tr>

</br>


    {foreach from=$elements_list item=element}
	<tr>
		<td nowrap="nowrap">{$form.$element.label}</td>
		<td nowrap="nowrap">{$form.$element.html}</td>
	</tr>
	{/foreach}



<tr>
    <td nowrap="nowrap">&nbsp;</td>
    <td nowrap="nowrap" colspan="2">
    <input class="button" name="fire_away" value="Save" type="submit" />
{/if}
<input class="button" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to profile" type="button" />

</td>
</tr>

</table>

