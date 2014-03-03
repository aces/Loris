{if $success}
<p>Survey was added successful.<br/> Click here to go back to view the list of survey's created : <a href=main.php?test_name=participant_accounts> Participant Survey List</a><br /></p>
<br />
{/if}
<br />
<form method="post" name="participant_accounts" id="participant_accounts_form">
{if not $success}
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">Usage</th></tr>

    <tr>
        <td colspan="2">
            Use this form to create a link for a study participant to use in order to directly enter a form/data into Loris. 
        </td>
    </tr>

    <!-- table title -->
    <tr><th colspan="2">Add Survey</th></tr>

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
        <input class="button" name="fire_away" value="Create survey" type="submit" />
        <input class="button email" name="fire_away" value="Create and email" type="submit">

    {/if}
        </td>
	</tr>
</table>
{$form.hidden}
<div id="email_dialog">
    <textarea name="email_dialog" rows="24" cols="80">This is where your message goes.</textarea>
</div>
</form>
