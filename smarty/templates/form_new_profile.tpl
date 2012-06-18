{if $success}

<p>New candidate created. DCCID: {$candID} PSCID: {$PSCID}<br />
<a href="main.php?test_name=timepoint_list&candID={$candID}">Access this candidate</a><br />
<a href="main.php?test_name=new_profile">Recruit another candidate</a></p>

{else}

<br />
<form method="post" name="new_profile" id="new_profile">
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">New Profile</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
		<td nowrap="nowrap">Date of Birth</td>
		<td nowrap="nowrap">{$form.dob1.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">Confirm Date of Birth</td>
		<td nowrap="nowrap">{$form.dob2.html}</td>
	</tr>

    {if $form.edc1.html != ""}
	<tr>
		<td nowrap="nowrap">Expected Date of Confinement</td>
		<td nowrap="nowrap">{$form.edc1.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">Confirm EDC</td>
		<td nowrap="nowrap">{$form.edc2.html}</td>
	</tr>
    {/if}

	<tr>
		<td nowrap="nowrap">Gender</td>
		<td nowrap="nowrap">{$form.gender.html}</td>
	</tr>

    {if $form.PSCID.html != ""}
	<tr>
		<td nowrap="nowrap">PSCID</td>
		<td nowrap="nowrap">{$form.PSCID.html}</td>
	</tr>
    {/if}

	<tr>
		<td nowrap="nowrap" colspan="2" align="right"><input class="button" name="fire_away" value="Create" type="submit" /></td>
	</tr>
</table>
{$form.hidden}
</form>

{/if}
