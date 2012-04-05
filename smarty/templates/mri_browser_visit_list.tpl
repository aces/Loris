<!-- selection filter -->
<!-- fixme this modified version does not display certain fields in the mri browser selection window-->
<form>

<!-- The colspan is only there to make quick changes possible -->
<table class="std">
<tr>                                                                                                                                                          
    <th nowrap="nowrap" colspan="5">Selection Filter</th>
</tr>
<tr>
    <th>DCCID</th><td colspan="1"><input type='text' name='filter[candID]' value='{$filter.candID}' size="30"></td>
    <th>PSCID</th><td colspan="1"><input type='text' name='filter[pscID]' value='{$filter.pscID}' size="30"></td><td>&nbsp;</td>
</tr>

<tr>
    <th>Site</th><td colspan="1">{html_options options=$site_options selected=$filter.site name=filter[site]}</td>
<!--    <th>Visit label</th><td><input type='text' name='filter[visitLabel]' value='{$filter.visitLabel}' size="4"></td></td><td>&nbsp;</td>-->
    <th>Visit label</th><td colspan="1">{html_options options=$visit_options selected=$filter.visit name=filter[visit]}</td>
    <!--th>Subproject</th><td colspan="2">{html_options options=$SubprojectID_options selected=$filter.SubprojectID name=filter[SubprojectID]}</td-->
</tr>
<tr>
    <th>QC Status</th><td>{html_options options=$qcStatus_options selected=$filter.qcStatus name=filter[qcStatus]}</td>
    <th>Pending and new</th><td><input type='checkbox' name='filter[pending]' value='1' {if $filter.pending}checked{/if}></td>
    <td colspan="4"><input class="button" type="submit"></td>
</tr>
</table>

</form>
<!-- listing of visits -->
{if $numTimepoints}
    <p>
    {$numTimepoints} subject timepoint(s) selected. &nbsp;
    {if $filter.site}<a href="passfile.php?file={$MRI_Alias[$filter.site]}-qc.xls">Download {$MRI_Alias[$filter.site]} QC-report</a>
    {else}<a href="passfile.php?file=all-qc.xls">Download combined QC-report</a>
    {/if}
    </p>
{/if}

<table class="fancytable" width="100%" border="1">
    <tr>
        <th>Site</th>
        <th>DCCID</th>
        <th>PSCID</th>
        <th>Visit Label</th>
        <th>QC Status</th>
{*        <th>Subproject</th> *}
        <th>First acq date</th>
{*        <th>First added to DB</th> 	*}
{*        <th>First QC</th>		*}
        <th>Last QC</th>
        <th>New data</th>
        <th colspan="{$numOutputTypes+2}">Links</th>
    </tr>
   {section name=timepointIdx loop=$timepoints}
    <tr>
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
        {section name=typeIdx loop=$outputTypes}
            <td>
                <a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&outputType={if $outputTypes[typeIdx].outputType == 'selected'}native&selectedOnly=1{else}{$outputTypes[typeIdx].outputType|escape:"url"}{/if}&backURL={$backURL|escape:"url"}">{$outputTypes[typeIdx].outputType}</a>
            </td>
        {/section}
        <td><a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&outputType=processed&backURL={$backURL|escape:"url"}">processed</a></td>
        <td><a href="mri_browser.php?sessionID={$timepoints[timepointIdx].sessionID}&backURL={$backURL|escape:"url"}">all types</a></td>
    </tr>
    {sectionelse}
    <tr>
        <td colspan="13">No data selected</td>
    </tr>
    {/section}
</table>

{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}
