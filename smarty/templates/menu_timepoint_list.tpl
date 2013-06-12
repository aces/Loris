<br />
<!-- table title -->
<table border="0" valign="bottom" width="100%"><td class="controlPanelSection">List of Visits (Time Points)</td></table>

<!-- list of timepoints table -->
<table class="listColorCoded" cellpadding="2">
<!-- table column headings -->
    <tr>
        <th nowrap="nowrap">Visit Label<BR>(Click to Open)</th>
        <th nowrap="nowrap">Subproject</th>
        <th nowrap="nowrap">Stage</th>
        <th nowrap="nowrap">Stage Status</th>
        <th nowrap="nowrap">Date of Stage</th>
        <th nowrap="nowrap">Sent To DCC</th>
        <th nowrap="nowrap">MR Scan Done</th>
        <th nowrap="nowrap">Feedback</th>
        <th nowrap="nowrap">BVL QC</th>
        <th nowrap="nowrap">BVL Exclusion</th>
        <th nowrap="nowrap">Registered By</th>
    </tr>

{section name=timepoint loop=$timePoints}
    <tr>
        <td nowrap="nowrap"><a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$timePoints[timepoint].SessionID}">{$timePoints[timepoint].Visit_label}</a></td>

        <td nowrap="nowrap">{$timePoints[timepoint].SubprojectTitle}</td>

        {if $timePoints[timepoint].staticStage != "" || $timePoints[timepoint].Current_stage == "Not Started"}
        <td nowrap="nowrap" colspan="3">{$timePoints[timepoint].Current_stage}</td>
        {else}
        <td nowrap="nowrap">{$timePoints[timepoint].Current_stage}</td>
        <td nowrap="nowrap">{$timePoints[timepoint].currentStatus}</td>
        <td nowrap="nowrap">{$timePoints[timepoint].currentDate}</td>
        {/if}

        <td nowrap="nowrap">
        {if $timePoints[timepoint].Submitted == "Y"}
    	    <img src="images/check_blue.gif" border="0" />
        {else}
    	    -
        {/if}
        </td>

        <td nowrap="nowrap">
        {if $timePoints[timepoint].Scan_done != ""}
                   {if $timePoints[timepoint].Scan_done == 'Y'}
        					{assign var="scan_done" value="Yes"}
        					<a href="mri_browser.php?filter%5BpscID%5D={$PSCID}">{$scan_done}</a>
						{else}
							{assign var="scan_done" value="No"}
							{$scan_done}
		        		{/if}
        {else}
            <img alt="Data Missing" src="images/help2.gif" border=0>
        {/if}
        </td>

        <td nowrap="nowrap" bgColor="{$timePoints[timepoint].feedbackColor}">
        {if $timePoints[timepoint].feedbackCount}
            {$timePoints[timepoint].feedbackStatus}
        {else}
            -
        {/if}
        </td>

        <td nowrap="nowrap">
        {if $timePoints[timepoint].BVLQCStatus}
            {$timePoints[timepoint].BVLQCType}
        {else}
            <img src="images/delete.gif" border="0" />
        {/if}
        </td>

        <td nowrap="nowrap">
        {if $timePoints[timepoint].BVLQCExclusion}
            {if $timePoints[timepoint].BVLQCExclusion == 'Not Excluded'}
            Pass
            {else}
            Fail
            {/if}
        {else}
            <img src="images/delete.gif" border="0" />
        {/if}
        </td>

        <td nowrap="nowrap">
            {$timePoints[timepoint].Real_name}
        </td>
    </tr>
{sectionelse}
    <tr><td colspan="10">No timepoints have been registered yet.</td></tr>
{/section}
</table>
<br />
{if $isNIHPD}
<!--  show future time points  -->
{if $SubprojectID == 2}
<!--  need to add Obj2 time window handler -->
Subproject 2 Time Window Control is Under Construction
{elseif $SubprojectID == 1}

<!-- table title -->
<table border="0" valign="bottom" width="100%"><td class="controlPanelSection">Projected dates for future visits (time points) based on the first date of visit</td></table>

<!--  get the list of future timepoints -->
<table class="list" cellpadding="2">
    <!-- table column headings -->
    <tr>
        <th nowrap="nowrap">Target Date</th>
        <th nowrap="nowrap">Earliest Date</th>
        <th nowrap="nowrap">Latest Date</th>
        <th nowrap="nowrap">Time Window Status</th>
    </tr>

    <!--  show Database Windows for future time points and Start Button for the next Time Point -->
    {section name=visit loop=$visits}
    <tr>
        <td nowrap="nowrap"><strong>{$visits[visit].windowTarget|date_format:"%Y-%m-%d"}</strong></td>
        <td nowrap="nowrap">{$visits[visit].min|date_format:"%Y-%m-%d"}</td>
        <td nowrap="nowrap">{$visits[visit].max|date_format:"%Y-%m-%d"}</td>
        <td nowrap="nowrap">
        {if $now == $visits[visit].windowTarget}
            <span style="color: green">Target Date is Today</span>
        {elseif $visits[visit].min <= $now and $now <= $visits[visit].max}
            <span style="color: green">In Window</span>
        {else}
            <span style="color: red">-</span>
        {/if}
        </td>
    </tr>
    {sectionelse}
    <tr><td colspan="4">No timepoints available</td></tr>
    {/section}
</table>
{/if}
{/if}
