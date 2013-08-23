<form method="post" action="main.php?test_name=user_accounts">
<!-- start the selection table -->
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="8">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">Site:</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.centerID.html}</td>
        <td nowrap="nowrap">Username:</td>
        <td nowrap="nowrap">{$form.userID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Active:</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.active.html}</td>
        <td nowrap="nowrap">Full name:</td>
        <td nowrap="nowrap">{$form.real_name.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Pending approval:</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.pending.html}</td>
        <td nowrap="nowrap">Email:</td>
        <td nowrap="nowrap">{$form.email.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Examiner:</td>
        <td nowrap="nowrap" class="MenuWidth">{$form.examiner.html}</td>
    
    </tr>
    <tr>
        <td nowrap="nowrap"><input type="button" name="button" value="Add User" class="button" onclick="location.href='main.php?test_name=user_accounts&subtest=edit_user'" /></td>
        <td colspan="7" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=user_accounts&reset=true'" /></td>
    </tr>
<table>
</form>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection"></td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table border="0" width="100%" class="listColorCoded">
<tr>
 <th nowrap="nowrap">No.</th>
    <!-- print out column headings - quick & dirty hack -->
    {section name=header loop=$headers}
        <th nowrap="nowrap"><a href="main.php?test_name=user_accounts&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    <td nowrap="nowrap">
        {if  $items[item][piece].name == "Username"}
        <a href="main.php?test_name=user_accounts&subtest=edit_user&identifier={$items[item][piece].value}">{$items[item][piece].value}</a>
        {else}
        {$items[item][piece].value}
        {/if}
    </td>
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="8">No users found</td></tr>
{/section}
                    
<!-- end data table -->
</table>

