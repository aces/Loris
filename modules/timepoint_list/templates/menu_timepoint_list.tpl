<div class="col-xs-12 row">
    <!-- <div class="col-xs-1"> -->
        <h3>Actions:&nbsp&nbsp</h3> 
    <!-- </div> -->
    <!-- <div class="col-xs-4"> -->
        {$actions}
        <a href="#" class="scanDoneLink" data-pscid="{$PSCID}">
           <button class="btn btn-primary">
              View Imaging datasets</button>
        </a>

    <!-- </div> -->
</div>
<br>
<br>
<br>
<br>
<br>
<br>

<!-- table title -->
<strong>List of Visits (Time Points)</strong>
<!-- list of timepoints table -->
<table style="margin-top:0" class="table table-hover table-primary table-bordered dynamictable" cellpadding="2">
    <!-- table column headings -->
    <thead>
        <tr class="info">
            <th>Visit Label<BR>(Click to Open)</th>
            <th>Subproject</th>
            <th>Stage</th>
            <th>Stage Status</th>
            <th>Date of Stage</th>
            <th>Sent To DCC</th>
            <th>Imaging Scan Done</th>
            <th>Feedback</th>
            <th>BVL QC</th>
            <th>BVL Exclusion</th>
            <th>Registered By</th>
        </tr>
    </thead>
    <tbody>
    {section name=timepoint loop=$timePoints}
        <tr>
            <td><a href="{$baseurl}/main.php?test_name=instrument_list&candID={$candID}&sessionID={$timePoints[timepoint].SessionID}">{$timePoints[timepoint].Visit_label}</a></td>

            <td>{$timePoints[timepoint].SubprojectTitle}</td>

            {if $timePoints[timepoint].staticStage != "" || $timePoints[timepoint].Current_stage == "Not Started"}
            <td colspan="3">{$timePoints[timepoint].Current_stage}</td>
            {else}
            <td>{$timePoints[timepoint].Current_stage}</td>
            <td>{$timePoints[timepoint].currentStatus}</td>
            <td>{$timePoints[timepoint].currentDate}</td>
            {/if}

            <td>
            {if $timePoints[timepoint].Submitted == "Y"}
        	    <img src="images/check_blue.gif" border="0" />
            {else}
        	    -
            {/if}
            </td>
            <td>
            {if $timePoints[timepoint].Scan_done != ""}
                    {if $timePoints[timepoint].Scan_done == 'Y'}
                        {assign var="scan_done" value="Yes"}
                        <a href="#" class="timepoint_list" 
                            data-visitlabel="{$timePoints[timepoint].Visit_label}"
                            data-pscid="{$PSCID}">
                        {$scan_done}</a>
                    {else}
                        {assign var="scan_done" value="No"}
                        {$scan_done}
                    {/if}
            {else}
                <img alt="Data Missing" src="images/help2.gif" border=0>
            {/if}
            </td>
   
            <td bgColor="{$timePoints[timepoint].feedbackColor}">
            {if $timePoints[timepoint].feedbackCount}
                {$timePoints[timepoint].feedbackStatus}
            {else}
                -
            {/if}
            </td>

            <td>
            {if $timePoints[timepoint].BVLQCStatus}
                {$timePoints[timepoint].BVLQCType}
            {else}
                <img src="images/delete.gif" border="0" />
            {/if}
            </td>

            <td>
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

            <td>
                {$timePoints[timepoint].Real_name}
            </td>
        </tr>
    {sectionelse}
        <tr><td colspan="10">No timepoints have been registered yet.</td></tr>
    {/section}
    </tbody>
</table>
