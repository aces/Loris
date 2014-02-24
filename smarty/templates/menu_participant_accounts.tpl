<form method="post" action="main.php?test_name=participant_accounts">
<!-- start the selection table -->
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="8">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.PSCID.label}</td>
        <td nowrap="nowrap">{$form.PSCID.html}</td>
        <td nowrap="nowrap">{$form.VisitLabel.label}</td>
        <td nowrap="nowrap">{$form.VisitLabel.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Email.label}</td>
        <td nowrap="nowrap">{$form.Email.html}</td>
        <td nowrap="nowrap">{$form.Instrument.label}</td>
        <td nowrap="nowrap">{$form.Instrument.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap"><input type="button" name="button" value="Add Survey" class="button" onclick="location.href='main.php?test_name=participant_accounts&subtest=add_survey'" /></td>
        <td colspan="7" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=participant_accounts&reset=true'" /></td>
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
        <th nowrap="nowrap"><a href="main.php?test_name=participant_accounts&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    <td nowrap="nowrap">
        {if  $items[item][piece].name == "URL"}
        <a href="submit.php?key={$items[item][piece].value}">{$items[item][piece].value}</a>
        {else}
        {$items[item][piece].value}
        {/if}
    </td>
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="8">No surveys found</td></tr>
{/section}
                    
<!-- end data table -->
</table>

