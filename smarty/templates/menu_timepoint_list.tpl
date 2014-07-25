<div class="col-xs-12 row">
    <!-- <div class="col-xs-1"> -->
        <h3>Actions:&nbsp&nbsp</h3> 
    <!-- </div> -->
    <!-- <div class="col-xs-4"> -->
        {$actions}
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
<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
        <!-- <div class="col-xs-10 col-xs-offset-1" style="overflow-y:auto"> -->
        <div class="table-scroll-static" id="content">
            <table style="margin-top:0" class="table table-hover table-primary table-bordered" cellpadding="2">
                <!-- table column headings -->
                <thead>
                    <tr class="info">
                        <th class="static-col headcol">Visit Label<BR>(Click to Open)</th>
                        <th>Subproject</th>
                        <th>Stage</th>
                        <th>Stage Status</th>
                        <th>Date of Stage</th>
                        <th>Sent To DCC</th>
                        <th>MR Scan Done</th>
                        <th>Feedback</th>
                        <th>BVL QC</th>
                        <th>BVL Exclusion</th>
                        <th>Registered By</th>
                    </tr>
                </thead>
                <tbody>
                {section name=timepoint loop=$timePoints}
                    <tr>
                        <td class="static-col headcol"><a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$timePoints[timepoint].SessionID}">{$timePoints[timepoint].Visit_label}</a></td>

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
                        					<a href="main.php?test_name=imaging_browser&pscid={$PSCID}&filter=true">{$scan_done}</a>
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
        </div>
        <a class="left carousel-control"  id="scrollLeft" href="#carousel-example-generic">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a class="right carousel-control" id="scrollRight" href="#carousel-example-generic" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </a>
    </div>
</div>
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
<div class="table-responsive">
    <table class="table table-hover table-primary table-bordered" cellpadding="2">
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
</div>
{/if}
{/if}