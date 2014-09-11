<!-- start the selection table -->
<form method="post" action="main.php?test_name=instrument_manager" enctype="multipart/form-data">
<table border="0" valign="top" class="std">
    <tr>
        <th nowrap="nowrap" colspan="4">Selection Filter</th>
    </tr>
    <tr>
        <td nowrap="nowrap">Actions:</td>
        <td colspan="3"><input type="file" name="install_file">&nbsp;<input type="submit" name="install" value="Install Instrument" class="button">
        <!--td colspan="3"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=instrument_installer&reset=true'"-->
    </tr>

</table>
</form>

<!--  title table with pagination -->

<div id="pagelinks">
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
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
        <th nowrap="nowrap">{$headers[header].displayName}</a></th>
    {/section}
</tr>

{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    {if $items[item][piece]}
    <td nowrap="nowrap">{$items[item][piece].value}</td>
    {/if}
    {/section}
    </tr>           
{sectionelse}
    <tr><td colspan="8">Nothing found</td></tr>
{/section}
                    
<!-- end data table -->
</table>
</div>

