<br />
{literal}
<script>
$(document).ready(function() {
    function toggleGroup(group) {
        if(group) {
            // id is the header that was clicked
            id = group.target.id;

            // chop off header_ to get section name
            section = id.substring(7);
            
            // hide (or show) the appropriate div for that section
            section_el = $("#perms_" + section);
            section_el.toggle();
        }
    }
    // define event handler for all the header sections
    $(".perm_header").click(toggleGroup);
    // Get rid of the extra <br /> tag that Quickform element adds at the top of each <div>
    $(".perm_header").each(function(idx, el) {
        id = el.id;
        section = id.substring(7);
        section_el = $("#perms_" + section + " br:nth-child(1)").hide();
    });
    
});
</script>
{/literal}
<form method="post" name="edit_user" id="edit_user">
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">Password Rules</th></tr>

    <tr>
        <td colspan="2">
            <ul>
                <li>The password must be at least 8 characters long</li>
                <li>The password must contain at least 1 letter, 1 number and 1 character from   !@#$%^&amp;*()</li>
                <li>The password and the user name must not be the same</li>
                <li>The password and the email address must not be the same</li>
            </ul>
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
		<td nowrap="nowrap">User name</td>
		<td nowrap="nowrap">{$form.UserID.html}{$form.UserID_Group.html}</td>
	</tr>
	<tr>
		<td colspan="2" nowrap="nowrap">
        NOTE: <BR><B>When generating a new password, please notify the user<BR>by checking 'Send email to user' box!</B>
        </td>
	</tr>
	<tr>
		<td nowrap="nowrap">{$form.Password_Group.label}</td>
		<td nowrap="nowrap">{$form.Password_Group.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">{$form.__Confirm.label}</td>
		<td nowrap="nowrap">{$form.__Confirm.html}</td>
	</tr>
{*	<tr>
        <td nowrap="nowrap">{$form.Real_name.label}</td>
		<td nowrap="nowrap">{$form.Real_name.html}</td>
	</tr>*}
	<tr>
        <td nowrap="nowrap">{$form.First_name.label}</td>
		<td nowrap="nowrap">{$form.First_name.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Last_name.label}</td>
		<td nowrap="nowrap">{$form.Last_name.html}</td>
	</tr>

	<tr>
        <td nowrap="nowrap">{$form.Degree.label}</td>
		<td nowrap="nowrap">{$form.Degree.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Position_title.label}</td>
		<td nowrap="nowrap">{$form.Position_title.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Institution.label}</td>
		<td nowrap="nowrap">{$form.Institution.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Department.label}</td>
		<td nowrap="nowrap">{$form.Department.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Address.label}</td>
		<td nowrap="nowrap">{$form.Address.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.City.label}</td>
		<td nowrap="nowrap">{$form.City.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.State.label}</td>
		<td nowrap="nowrap">{$form.State.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Zip_code.label}</td>
		<td nowrap="nowrap">{$form.Zip_code.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Country.label}</td>
		<td nowrap="nowrap">{$form.Country.html}</td>
	</tr>
	<tr>
        <td nowrap="nowrap">{$form.Fax.label}</td>
		<td nowrap="nowrap">{$form.Fax.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap">{$form.Email_Group.label}</td>
		<td nowrap="nowrap">{$form.Email_Group.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">{$form.CenterID.label}</td>
		<td nowrap="nowrap">{$form.CenterID.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">{$form.Active.label}</td>
		<td nowrap="nowrap">{$form.Active.html}</td>

	</tr>
	<tr>
		<td nowrap="nowrap">{$form.Pending_approval.label}</td>
		<td nowrap="nowrap">{$form.Pending_approval.html}</td>
	</tr>
	<tr>
		<td nowrap="nowrap">{$form.Examiner.label}</td>
		<td nowrap="nowrap">{$form.Examiner.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap" valign="top">Permissions</td>
		<td nowrap="nowrap"><div>{$form.PermID_Group.html}</div></td>
    </tr>

	<tr>
        <td nowrap="nowrap">&nbsp;</td>
		<td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
    {/if}
        <input class="button" onclick="location.href='main.php?test_name=user_accounts'" value="Back" type="button" />
        </td>
	</tr>
</table>
{$form.hidden}
</form>
