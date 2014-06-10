<!-- selection filter -->
<form method="post" action="main.php?test_name=dicom_archive">
<!-- The colspan is only there to make quick changes possible -->
<table class="std">
    <tr>
        <th nowrap="nowrap" colspan="6">Selection Filter</th>
    </tr>
    <tr>
        <td>{$form.SiteID.label}</td>
        <td>{$form.SiteID.html}</td>
	<td></td><td></td>
    </tr>
    <tr>
        <td>{$form.PatientID.label}</td>
        <td class="MenuWidth">{$form.PatientID.html}</td>
        <td>{$form.PatientName.label}</td>
        <td class="MenuWidth">{$form.PatientName.html}</td>
    </tr>
    <tr>
        <td>{$form.Gender.label}</td>
        <td class="MenuWidth">{$form.Gender.html}</td>
        <td>{$form.DoB.label}</td>
        <td class="MenuWidth">{$form.DoB.html}</td>
    </tr>
    <tr>
        <td>{$form.Acquisition.label}</td>
        <td class="MenuWidth">{$form.Acquisition.html}</td>
        <td>{$form.Location.label}</td>
        <td class="MenuWidth">{$form.Location.html}</td>
    </tr>
    <tr>
        <td colspan='2'></td>
        <td colspan='2' align='center'><input type="submit" class="button" name="filter" value="Show Data">&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=dicom_archive&reset=true'">
        </td>
    </tr>
</table>

</form>
<!-- listing of visits -->
{if $numTimepoints}
{$numTimepoints} study dicom archive(s) selected.<br>
{/if}

<table class="fancytable">
    <tr>
	<th>No.</th>
{section name=header loop=$headers}
        <th nowrap="nowrap">
            <a href="main.php?test_name=dicom_archive&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a>
        </th>
{/section}
    </tr>
    <tr>
{section name=item loop=$items}
{section name=piece loop=$items[item]}
    <td{if $items[item][piece].name == "Transfer_Status"} class="{$items[item][piece].class}"{elseif $items[item][piece].class == "error"} class="{$items[item][piece].class}"{/if}>
        {if $items[item][piece].name == "Metadata"}
        <a href="main.php?test_name=dicom_archive&subtest=viewDetails&tarchiveID={$items[item][piece].tarchiveID}&backURL={$backURL|escape:"url"}">{$items[item][piece].value}</a>
        {elseif $items[item][piece].name == "MRI_Browser"}
            {if $items[item][piece].sessionID != ""}
        <a href="main.php?test_name=imaging_browser&subtest=viewSession&sessionID={$items[item][piece].sessionID}&outputType=native&backURL={$backURL|escape:"url"}">{$items[item][piece].value}</a>{else}&nbsp;{/if}
        {else}
             {$items[item][piece].value}
        {/if}
        </td>
    {/section}
    </tr>
{sectionelse}
    <tr><td colspan="8">Nothing found</td></tr>
{/section}
</table>

