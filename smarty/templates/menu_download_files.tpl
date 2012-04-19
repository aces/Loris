<!-- start the selection table -->
<form method="post" action="main.php?test_name=download_files">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="4">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.Filename.label}</td>
        <td nowrap="nowrap">{$form.Filename.html}</td>
        <td nowrap="nowrap">&nbsp;</td>
        <td nowrap="nowrap">&nbsp;</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Actions:</td>
        <td colspan="3"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=download_files&reset=true'">
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
        <th nowrap="nowrap"><a href="main.php?test_name=download_files&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    {if $items[item][piece].name == 'File'}
    <td nowrap="nowrap">
        {* column 4 is the status *}
        {if $items[item][4].value == 'ready'}
            <a href="downloads/{$items[item][piece].value}">{$items[item][piece].value}</a>
        {else}
            {$items[item][piece].value}
        {/if}

            
    </td>
    {else}
    <td nowrap="nowrap">
            {$items[item][piece].value}
    </td>
    {/if}
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="8">Nothing found</td></tr>
{/section}
                    
<!-- end data table -->
</table>
</div>

