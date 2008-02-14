{if $showFilterForm}
<form method="post" action="main.php?test_name=mri_safety">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="6">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">Site:</td>
        <td nowrap="nowrap">{$form.centerID.html}</td>
        <td nowrap="nowrap">DCC-ID:</td>
        <td nowrap="nowrap">{$form.DCCID.html}</td>
        <td nowrap="nowrap">PSC-ID:</td>
        <td nowrap="nowrap">{$form.PSCID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Acquisition Date:</td>
        <td nowrap="nowrap">{$form.acquisition_date.html}</td>
        <td nowrap="nowrap">Reported:</td>
        <td nowrap="nowrap">{$form.reported.html}</td>
        <td nowrap="nowrap">Medical Review Outcome:</td>
        <td nowrap="nowrap">{$form.findings_confirmed.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Actions:</td>
        <td colspan="4" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=mri_safety&reset=true'" /></td>
    </tr>
<table>
</form>
{/if}

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of MRI Safety Form</td>
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
        <th nowrap="nowrap">{$headers[header].displayName}</th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- data rows -->
    {section name=piece loop=$items[item]}
        {if $items[item][piece].name ne "CenterID" && $items[item][piece].name ne "RecordID" && $items[item][piece].name ne "SessionID" && $items[item][piece].name ne "Scan_date"}
            {if $items[item][piece].name ne "Reviewers_comment" && $items[item][piece].name ne "DCC_comment"}
                <td nowrap="nowrap">
            {else}
                <td>
            {/if}
                {$items[item][piece].value}
            </td>
        {/if}
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="13">No records found</td></tr>
{/section}
<!-- end data table -->
</table>