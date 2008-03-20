<!-- selection filter -->
<form>
Site {html_options options=$site_options selected=$filter.site name=filter[site]}
DCCID <input type='text' name='filter[candID]' value='{$filter.candID}' size="10">
PSCID <input type='text' name='filter[pscID]' value='{$filter.pscID}' size="12">
Visit label <input type='text' name='filter[visitLabel]' value='{$filter.visitLabel}' size="4">
QC Status {html_options options=$qcStatus_options selected=$filter.qcStatus name=filter[qcStatus]}
Subproject {html_options options=$SubprojectID_options selected=$filter.SubprojectID name=filter[SubprojectID]}
Pending and new <input type='checkbox' name='filter[pending]' value='1' {if $filter.pending}checked{/if}>
<input type="submit">
</form>
<!-- listing of visits -->
{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}

<table width="100%" border="1">
    <tr>
        <th>Site</th>
        <th>DCCID</th>
        <th>PSCID</th>
        <th>Visit Label</th>
        <th>QC Status</th>
        <th>New data</th>
        <th>Subproject</th>
        <th>First acq date</th>
        <th>First added to DB</th>
        <th>First QC</th>
        <th>Last QC</th>
        <th colspan="{$numOutputTypes}">Links</th>
    </tr>
   {section name=timepointIdx loop=$timepoints}
    <tr>
        <td>{$timepoints[timepointIdx].centerName}</td>
        <td>{$timepoints[timepointIdx].candID}</td>
        <td>{$timepoints[timepointIdx].PSCID}</td>
        <td>{$timepoints[timepointIdx].visitLabel}</td>
        <td>{if $timepoints[timepointIdx].QCStatus}{$timepoints[timepointIdx].QCStatus}{else}&nbsp;{/if}</td>
        <td>{if $timepoints[timepointIdx].newData}<font color="red">NEW</font>{else}&nbsp;{/if}</td>
        <td>{if $timepoints[timepointIdx].SubprojectID}{$timepoints[timepointIdx].SubprojectID}{else}&nbsp;{/if}</td>
        <td>{if $timepoints[timepointIdx].firstAcqDate > 0}{$timepoints[timepointIdx].firstAcqDate|date_format}{else}&nbsp;{/if}</td>
        <td>{$timepoints[timepointIdx].firstInsertDate|date_format}</td>
        <td>{$timepoints[timepointIdx].firstQCDate|date_format}</td>
        <td>{$timepoints[timepointIdx].lastQCDate|date_format}</td>
        {section name=typeIdx loop=$outputTypes}
            <td><a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&outputType={if $outputTypes[typeIdx].outputType == 'selected'}native&selectedOnly=1{else}{$outputTypes[typeIdx].outputType|escape:"url"}{/if}&backURL={$backURL|escape:"url"}">{$outputTypes[typeIdx].outputType}</a></td>
        {/section}
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
