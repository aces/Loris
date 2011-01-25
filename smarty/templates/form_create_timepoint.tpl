{if $success}

<p>New time point successfully registered. <a href="main.php?test_name=timepoint_list&candID={$candID}">Click here to continue.</a></p>

{else}

<p>The suggested visit label appears in the field!</p>

<form method="post" name="create_timepoint" id="create_timepoint">
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">Create Time Point</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
		<td nowrap="nowrap">DCCID</td>
		<td nowrap="nowrap">{$candID}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">Subproject</td>
		<td nowrap="nowrap">{$form.subprojectID.html}</td>

	</tr>
	<tr>
		<td nowrap="nowrap">Visit label</td>
		<td nowrap="nowrap">{$form.visitLabel.html}</td>

	</tr>

	<tr>
		<td nowrap="nowrap" colspan="2"><input class="button" name="fire_away" value="Create Time Point" type="submit" /></td>
	</tr>
</table>
{$form.hidden}
</form>

{/if}
