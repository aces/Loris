<!-- selection filter -->
<!-- qnts fixme this modified version does not display certain fields in the mri browser selection window-->
<form>

<!-- The colspan is only there to make quick changes possible -->
<table class="std">
<tr>                                                                                                                                                          
    <th nowrap="nowrap" colspan="5">Selection Filter</th>
</tr>
<tr>
   <th>Projects</th><td class="MenuWidth">{html_options options=$projects selected=$filter.project name="filter[project]"}</td>
    <th>DCCID</th><td colspan="1" class="MenuWidth"><input type='text' name='filter[candID]' value='{$filter.candID}' size="30"></td>
</tr>
<tr>
    <th>Site</th><td colspan="1" class="MenuWidth">{html_options options=$site_options selected=$filter.site name="filter[site]"}</td>
    <th>PSCID</th><td colspan="1" class="MenuWidth"><input type='text' name='filter[pscID]' value='{$filter.pscID}' size="30"></td><td>&nbsp;</td>
</tr>

<tr>
    <th>QC Status</th><td class="MenuWidth">{html_options options=$qcStatus_options selected=$filter.qcStatus name="filter[qcStatus]"}</td>    
    <th>Visit label</th><td class="MenuWidth"><input type='text' name='filter[visitLabel]' value='{$filter.visitLabel}' size="4"></td></td><td>&nbsp;</td>
    <!--th>Subproject</th><td colspan="2">{html_options options=$SubprojectID_options selected=$filter.SubprojectID name="filter[SubprojectID]"}</td-->
</tr>
<tr>
   <th>Pending and New</th><td class="MenuWidth">{html_options options=$pending_new_options selected=$filter.pending name=filter[pending]}</td>   
<td></td> 
    <td colspan="4"><input class="button" type="submit"></td>
</tr>
</table>

</form>
<!-- listing of visits -->
{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}

<table class="fancytable" width="100%" border="1">
    <tr>
    {foreach from=$headers item=item key=key}
        <th {if $key eq 'Links'}colspan="{$numOutputTypes+1}"{/if}>
        {if $item neq ''}<a href="?filter[order][field]={$key}&filter[order][asc]={if $filter.order.field eq $key && $filter.order.asc eq 'ASC'}DESC{else}ASC{/if}">{/if}
            {$key}
        {if $item neq ''}</a>{/if}
        </th>
    {/foreach}
    </tr>
   {section name=timepointIdx loop=$timepoints}
    <tr>
        <td>{$timepoints[timepointIdx].rownum}</td>
        <td>{$timepoints[timepointIdx].centerName}</td>
        <td>{$timepoints[timepointIdx].candID}</td>
        <td>{$timepoints[timepointIdx].PSCID}</td>
        <td>{$timepoints[timepointIdx].visitLabel}</td>
        <td>{if $timepoints[timepointIdx].QCStatus}{$timepoints[timepointIdx].QCStatus}{else}&nbsp;{/if}</td>
{*        <td>{if $timepoints[timepointIdx].SubprojectID}{$timepoints[timepointIdx].SubprojectID}{else}&nbsp;{/if}</td> 	*}
        <td>{if $timepoints[timepointIdx].firstAcqDate > 0}{$timepoints[timepointIdx].firstAcqDate|date_format}{else}&nbsp;{/if}</td>
{*        <td>{$timepoints[timepointIdx].firstInsertDate|date_format}</td>	*}
{*        <td>{$timepoints[timepointIdx].firstQCDate|date_format}</td>	*}
        <td>{$timepoints[timepointIdx].lastQCDate|date_format}</td>
        <td>{if $timepoints[timepointIdx].newData}<font color="red">NEW</font>{else}&nbsp;{/if}</td>
        <td>{$timepoints[timepointIdx].T1Pass}</td>
        <td>{$timepoints[timepointIdx].T2Pass}</td>
        {section name=typeIdx loop=$outputTypes}
        <td><a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&outputType={if $outputTypes[typeIdx].outputType == 'selected'}native&selectedOnly=1
            {else}{$outputTypes[typeIdx].outputType|escape:"url"}{/if}&backURL={$backURL|escape:"url"}">{$outputTypes[typeIdx].outputType}</a>
        </td>
        {/section}
        <td><a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&backURL={$backURL|escape:"url"}">all types</a></td>
    </tr>
    {sectionelse}
    <tr>
        <td colspan="12">No data selected</td>
    </tr>
    {/section}
</table>

{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}
