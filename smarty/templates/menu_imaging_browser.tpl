<!-- selection filter -->
<!-- qnts fixme this modified version does not display certain fields in the mri browser selection window-->
<form method="post" action="main.php?test_name=imaging_browser">
<!-- The colspan is only there to make quick changes possible -->
<table class="std">
<tr>                                                                                                                                                          
    <th nowrap="nowrap" colspan="5">Selection Filter</th>
</tr>
<tr>
   <th>{$form.ProjectID.label}</th><td class="MenuWidth">{$form.ProjectID.html}</td>
    <th>{$form.DCCID.label}</th><td class="MenuWidth">{$form.DCCID.html}</td>
</tr>
<tr>
    <th>{$form.SiteID.label}</th><td class="MenuWidth">{$form.SiteID.html}</td>
    <th>{$form.pscid.label}</th><td class="MenuWidth">{$form.pscid.html}</td>
</tr>

<tr>
    <th>{$form.VisitQCStatus.label}</th><td class="MenuWidth">{$form.VisitQCStatus.html}</td>    
    <th>{$form.VL.label}</th><td class="MenuWidth">{$form.VL.html}</td>
</tr>
<tr>
    <th>Pending and new</th><td><input type='checkbox' name='pending' value='1' {if $pending}checked{/if}></td>
    <td colspan="4"><input type="submit" class="button" name="filter" value="Show Data"></td>
</tr>
</table>

</form>
<!-- listing of visits -->
{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}

<table class="fancytable" width="100%" border="1">
    <tr>
        <th>No.</th>
    {foreach from=$headers item=item key=key}
        {* Add 3 to the numOutputTypes (native, selected, all types plus
           other types in the database *}
        <th {if $item.name eq 'Links'}colspan="{$numOutputTypes+3}"{/if}>
        {if $item neq ''}<a href="main.php?test_name=imaging_browser&filter[order][field]={$item.name}&filter[order][fieldOrder]={$item.fieldOrder}">{/if}
            {$item.displayName}
        {if $item neq ''}</a>{/if}
        </th>
    {/foreach}
    </tr>
    <tr>
    
    {section name=item loop=$items}
            <!-- print out data rows -->
            <td nowrap="nowrap">{$items[item][0].value}</td>
            {section name=piece loop=$items[item]}
            {if $items[item][piece].name neq 'Links' && $items[item][piece].name neq ''} 
                <td nowrap="nowrap">
                {if $items[item][piece].name == "First_Acq_Date" || $items[item][piece].name == "Last_QC"}
                    {$items[item][piece].value|date_format}
                {elseif $items[item][piece].name == "New_Data" && $items[item][piece].value == "new"}
                    <span class="newdata">NEW</span>
                {else}
                    {$items[item][piece].value}
                {/if}
                </td>
            {/if}
    {/section}
    {* Links to files/output types *}
    {section name=typeIdx loop=$outputTypes}
            <td><a href="main.php?test_name=imaging_browser&subtest=view_session&sessionID={$items[item].sessionID}">{$outputTypes[typeIdx].outputType}</a>
            </td>
    {/section}
                                                <td><a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&backURL={$backURL|escape:"url"}">all types</a></td>

    </tr>
    {sectionelse}
    <tr><td colspan="8">Nothing found</td></tr>
    {/section}
</table>

{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}
