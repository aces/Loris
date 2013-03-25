<!-- start the selection table -->
<form method="post" action="main.php?test_name=mri_violations">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="4">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.TarchiveID.label}</td>
        <td nowrap="nowrap">{$form.TarchiveID.html}</td>
        <td nowrap="nowrap">{$form.SeriesUID.label}</td>
        <td nowrap="nowrap">{$form.SeriesUID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.PatientName.label}</td>
        <td nowrap="nowrap">{$form.PatientName.html}</td>
        <td nowrap="nowrap">{$form.CandID.label}</td>
        <td nowrap="nowrap">{$form.CandID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Actions:</td>
        <td colspan="3"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=mri_violations&reset=true'">
    </tr>

</table>
</form>

<!--  title table with pagination -->

<div id="pagelinks">
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td align="right">{$page_links}</td>
</tr>
</table>
</div>


<!-- start data table -->
<div id="datatable">
<table border="0" class="fancytable">
<tr>
 <th nowrap="nowrap">No.</th>
    <!-- print out column headings - quick & dirty hack -->
    {section name=header loop=$headers}
        <th nowrap="nowrap"><a href="main.php?test_name=mri_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr
    {if $items[item].severity == "exclude"}
        class="error"
    {elseif $items[item].severity == "warning"}
        class="warn"
        {/if}>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    <td nowrap="nowrap">
        {if $items[item][piece].name== "PatientName"}
            <a href="dicom_archive.php?TarchiveID={$items[item].TarchiveID}">{$items[item][piece].value}</a>
        {else}
            {$items[item][piece].value}
        {/if}
    </td>
    {/section}
    </tr>
{sectionelse}
    <tr><td colspan="8">Nothing found</td></tr>
{/section}

<!-- end data table -->
</table>
</div>
