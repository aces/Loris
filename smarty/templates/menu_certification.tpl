<form method="post" action="main.php?test_name=certification">
<!-- start the selection table -->
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="7">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">Site:</td>
        <td nowrap="nowrap">{$form.centerID.html}</td>
        <td nowrap="nowrap">Full name:</td>
        <td nowrap="nowrap">{$form.full_name.html}</td>
        <td nowrap="nowrap">Measure:</td>
        <td nowrap="nowrap">{$form.measure.html}</td>
<!--        <td nowrap="nowrap">Date:</td>
        <td nowrap="nowrap">{$form.date_cert.html}</td>
        <td nowrap="nowrap">DCCID:</td>
        <td nowrap="nowrap">{$form.subject.html}</td>-->
    <tr>
        <td colspan="2" nowrap="nowrap"><input type="button" name="button" value="Add Certification" class="button" onclick="location.href='main.php?test_name=certification&subtest=edit_event'" /></td>
        <td colspan="6" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=certification&reset=true'" /></td>
    </tr>
<table>
</form>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Certification Events</td>
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
    {if $headers[header].name != subject && $headers[header].name != date}
        <th nowrap="nowrap"><a href="main.php?test_name=certification&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/if}
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    {if $items[item][piece].name != "ID"} 
    <td nowrap="nowrap">
		{if $items[item][piece].name == "full_name"}
		<a href="main.php?test_name=certification&subtest=edit_event&identifier={$items[item][piece].ID}">{$items[item][piece].value}</a>
        {elseif $items[item][piece].name != "date"}
        {$items[item][piece].value}
        {/if}
    </td>
    {/if}
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="6">No certification events found</td></tr>
{/section}

<!-- end data table -->
</table>

