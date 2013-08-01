<br />
<form method="post" name="edit_user" id="edit_user">
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">Password Rules</th></tr>

    <tr>
        <td colspan="2">
            <ul>
                <li>The password must be at least 8 characters long</li>
                <li>The password must contain at least 1 letter, 1 number and 1 character from !@#$%^&amp;*()</li>
                <li>The password and the user name must not be the same</li>
                <li>The password and the email address must not be the same</li>
            </ul>
        </td>
    </tr>

    <!-- table title -->
    <tr><th colspan="2">Edit My Information</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
		<td nowrap="nowrap">User name</td>
		<td nowrap="nowrap">{$form.UserID.html}</td>
	</tr>

{*	<tr>
		<td nowrap="nowrap">Full name</td>
		<td nowrap="nowrap">{$form.Real_name.html}</td>
	</tr>
*}
        <tr>
        <td nowrap="nowrap">First name</td>
                <td nowrap="nowrap">{$form.First_name.html}</td>
        </tr>
        <tr>
        <td nowrap="nowrap">Last name</td>
                <td nowrap="nowrap">{$form.Last_name.html}</td>
        </tr>

	<tr>
		<td nowrap="nowrap">Email address</td>
		<td nowrap="nowrap">{$form.Email.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap">Password</td>
		<td nowrap="nowrap">{$form.Password_md5.html}</td>
	</tr>
	<tr>

		<td nowrap="nowrap">Confirm Password</td>
		<td nowrap="nowrap">{$form.__Confirm.html}</td>
	</tr>

	<tr>
        <td nowrap="nowrap">&nbsp;</td>
		<td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
    {/if}
        </td>
	</tr>
</table>
{$form.hidden}
</form>
