<br />
<form method="post" name="demographics" id="demographics">
<table class="std">

    <!-- table title -->
    <tr><th colspan="2">Candidate Demographics</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
		<td nowrap="nowrap">Ethnicity</td>
		<td nowrap="nowrap">{$form.Ethnicity.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap">ZIP Code</td>
		<td nowrap="nowrap">{$form.ZIP.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap" colspan="2">Candidate's Siblings who are also participanting in the study</td>
	</tr>
	
	<tr>
		<td nowrap="nowrap">Sibling 1</td>
		<td nowrap="nowrap">{$form.Sibling1.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap">Sibling 2</td>
		<td nowrap="nowrap">{$form.Sibling2.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap">Sibling 3</td>
		<td nowrap="nowrap">{$form.Sibling3.html}</td>
	</tr>

	<tr>
        <td nowrap="nowrap">&nbsp;</td>
		<td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
    {/if}
        <input class="button" onclick="location.href='main.php?test_name=timepoint_list&candID={$candID}'" value="Return to profile" type="button" />
        </td>
	</tr>
</table>
{$form.hidden}
</form>