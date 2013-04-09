<!-- start the selection table -->
<form method="post" action="main.php?test_name=final_radiological_review">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="4">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.site.label}</td>
        <td nowrap="nowrap">{$form.site.html}</td>
        <td nowrap="nowrap">&nbsp;</td>
        <td nowrap="nowrap">&nbsp;</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Conflict1.label}</td>
        <td nowrap="nowrap">{$form.Conflict1.html}</td>
        <td nowrap="nowrap">{$form.Conflict2.label}</td>
        <td nowrap="nowrap">{$form.Conflict2.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.pscid.label}</td>
        <td nowrap="nowrap">{$form.pscid.html}</td>
        <td nowrap="nowrap">{$form.dccid.label}</td>
        <td nowrap="nowrap">{$form.dccid.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Visit_label.label}</td>
        <td nowrap="nowrap">{$form.Visit_label.html}</td>
        <td nowrap="nowrap">{$form.Review_done.label}</td>
        <td nowrap="nowrap">{$form.Review_done.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.SAS.label}</td>
        <td nowrap="nowrap">{$form.SAS.html}</td>
        <td nowrap="nowrap">{$form.PVS.label}</td>
        <td nowrap="nowrap">{$form.PVS.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Final_Review_Results.label}</td>
        <td nowrap="nowrap">{$form.Final_Review_Results.html}</td>
        <td nowrap="nowrap">{$form.Exclusionary_Status.label}</td>
        <td nowrap="nowrap">{$form.Exclusionary_Status.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Finalized.label}</td>
        <td nowrap="nowrap">{$form.Finalized.html}</td>
        <td nowrap="nowrap" colspan="2">&nbsp;</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Actions:</td>
        <td colspan="3"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=final_radiological_review&reset=true'">
    </tr>

</table>
</form>

<!--  title table with pagination -->

<div id="pagelinks">
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    {* Comment 
    <td class="controlPanelSection"><a href="main.php?test_name=final_radiological_review&subtest=final_radiological_review">Create new review</a></td>
    *}
    <!-- display pagination links -->
    <td align="left">{$page_links}</td>
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
        <th nowrap="nowrap"><a href="main.php?test_name=final_radiological_review&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    <td nowrap="nowrap">
        {if $items[item][piece].name == "PSCID"}
            <a href="main.php?test_name=final_radiological_review&subtest=final_radiological_review&identifier={$items[item][piece].CommentID}">{$items[item][piece].value}</a>
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

