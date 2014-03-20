{if $success}

<p>Family added successful<br /></p>
<br />
{/if}


<form method="post" name="add_family" id="add_family" enctype="multipart/form-data">
{if not $success}
<table class="std">
<!-- table title -->
<tr><th colspan="2">Add Family Member Information</th></tr>

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
<td nowrap="nowrap">{$form.FamilyMemberID.label}</td>
<td nowrap="nowrap">{$form.FamilyMemberID.html}</td>
</tr>
<tr>
<td nowrap="nowrap">{$form.relation_type.label}</td>
<td nowrap="nowrap">{$form.relation_type.html}</td>
</tr>
<tr>
<td nowrap="nowrap">&nbsp;</td>
<td nowrap="nowrap" colspan="2">
<input class="button" name="fire_away" value="Save" type="submit" />
{/if}
<input class="button" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to Candidate Info" type="button" />

</td>
</tr>

</table>
