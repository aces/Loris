<form method="post" name="edit_user" id="edit_user">
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">Password Rules</th></tr>

    <tr>
        <td colspan="2">
            Use this form to create a link for a study participant to use in order to directly enter a form/data into Loris. 
        </td>
    </tr>

    <!-- table title -->
    <tr><th colspan="2">Add/Edit User</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
        <td nowrap="nowrap">{$form.CandID.label}</td>
		<td nowrap="nowrap">{$form.CandID.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.PSCID.label}</td>
		<td nowrap="nowrap">{$form.PSCID.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.VL.label}</td>
		<td nowrap="nowrap">{$form.VL.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Test_name.label}</td>
		<td nowrap="nowrap">{$form.Test_name.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Email.label}</td>
		<td nowrap="nowrap">{$form.Email.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Create survey" type="submit" />
        <input class="button" name="fire_away" value="Create and email participant">

    {/if}
        </td>
	</tr>
</table>
{$form.hidden}
</form>
