<!-- table with candidate profile info -->
<table cellpadding="2" class="table table-info table-bordered dynamictable" style="max-width:auto">
  <!-- column headings -->
  <thead>
  <tr class="info">
    <th>
      {dgettext("timepoint_list", "Derived Age")}
    </th>
    <th>
      {dgettext("timepoint_list", "EDC Age")}
    </th>
    <th>
      {dgettext("timepoint_list", "Biological Sex")}
    </th>
    <th>
      {dgettext("loris", "Project")}
    </th>
    {foreach from=$candidate.DisplayParameters item=value key=name}
      <th>
        {$name}
      </th>
    {/foreach}
  </tr>
  </thead>
  <!-- candidate data -->
  <tbody>
  <tr>
    <td>
      {$dob_age}
    </td>
    <td>
      {$edc_age}
    </td>
    <td>
      {$candidate.Sex}
    </td>
      <td>
        {$candidate.ProjectTitle}
      </td>
    {foreach from=$candidate.DisplayParameters item=value key=name}
      <td>
        {$value}
      </td>
    {/foreach}
  </tr>
  </tbody>
</table>

<div class="col-xs-12 row">
    {$actions}
</div>
<br>
<br>
<br>
<br>
<br>
<br>

<!-- table title -->
<strong>{dgettext("timepoint_list", "List of Visits (Time Points)")}</strong>
<!-- list of timepoints table -->
<table style="margin-top:0" class="table table-hover table-primary table-bordered dynamictable" cellpadding="2">
    <!-- table column headings -->
    <thead>
        <tr class="info">
            <th>{dgettext("loris", "Visit Label")}<BR>({dgettext("timepoint_list", "Click to Open")})</th>
            <th>{dgettext("loris", "Cohort")}</th>
            <th>{dgettext("loris", "Site")}</th>
            <th>{dgettext("loris", "Project")}</th>
            <th>{dgettext("loris", "Stage")}</th>
            <th>{dgettext("timepoint_list", "Stage Status")}</th>
            <th>{dgettext("timepoint_list", "Date of Stage")}</th>
            <th>{dgettext("loris", "Sent To DCC")}</th>
            <th>{dgettext("timepoint_list", "Imaging Scan Done")}</th>
            <th>{dgettext("loris", "Feedback")}</th>
            <th>{dgettext("timepoint_list", "BVL QC")}</th>
            <th>{dgettext("timepoint_list", "BVL Exclusion")}</th>
            <th>{dgettext("timepoint_list", "Registered By")}</th>
            <th>{dgettext("loris", "Language")}</th>
        </tr>
    </thead>
    <tbody>
    {section name=timepoint loop=$timePoints}
        <tr>
            <td>
              <a href="{$baseurl|default}/instrument_list/?candID={$candID}&sessionID={$timePoints[timepoint].SessionID}">
                  {$timePoints[timepoint].Visit_label}
              </a>
            </td>
            <td>{$timePoints[timepoint].CohortTitle}</td>

            <td>{$timePoints[timepoint].SiteAlias}</td>
            <td>{$timePoints[timepoint].ProjectName}</td>

            {if $timePoints[timepoint].staticStage|default != "" || $timePoints[timepoint].Current_stage == "Not Started"}
            <td colspan="3">{dgettext("loris", $timePoints[timepoint].Current_stage)}</td>
            {else}
            <td>{dgettext("loris", $timePoints[timepoint].Current_stage)}</td>
            <td>{dgettext("loris", $timePoints[timepoint].currentStatus)}</td>
            <td>{$timePoints[timepoint].currentDate}</td>
            {/if}

            <td>
            {if $timePoints[timepoint].Submitted == "Y"}
        	    <img src="{$baseurl|default}/images/check_blue.gif" border="0" />
            {else}
        	    -
            {/if}
            </td>
            <td>
            {if $timePoints[timepoint].scanDone != ""}
                    {if $timePoints[timepoint].scanDone}
                        {assign var="scanDone" value={dgettext("loris", "Yes")}}
                        <a href="{$baseurl|default}/imaging_browser/viewSession/?sessionID={$timePoints[timepoint].SessionID}" class="timepoint_list">
                        {dgettext('loris', $scanDone)}</a>
                    {else}
                        {assign var="scanDone" value={dgettext("loris", "No")}}
                        {$scanDone}
                    {/if}
            {else}
                <img alt="Data Missing" src="{$baseurl|default}/images/delete.gif" border=0>
            {/if}
            </td>

            <td bgColor="{$timePoints[timepoint].feedbackColor}">
            {if $timePoints[timepoint].feedbackCount}
                {dgettext("timepoint_list", $timePoints[timepoint].feedbackStatus)}
            {else}
                -
            {/if}
            </td>

            <td>
            {if $timePoints[timepoint].BVLQCStatus}
                {if $timePoints[timepoint].BVLQCType != ""}
		    {dgettext("timepoint_list", $timePoints[timepoint].BVLQCType)}
                {/if}
            {else}
                <img src="{$baseurl|default}/images/delete.gif" border="0" />
            {/if}
            </td>

            <td>
            {if $timePoints[timepoint].BVLQCExclusion}
                {if $timePoints[timepoint].BVLQCExclusion == 'Not Excluded'}
                {dgettext("loris", "Pass")}
                {else}
                {dgettext("loris", "Failure")}
                {/if}
            {else}
                <img src="{$baseurl|default}/images/delete.gif" border="0" />
            {/if}
            </td>

            <td>
                {$timePoints[timepoint].Real_name}
            </td>
<td>
                {$timePoints[timepoint].language->label}
</td>
        </tr>
    {sectionelse}
        <tr><td colspan="10">{dgettext("timepoint_list", "You do not have access to any timepoints registered for this candidate.")}</td></tr>
    {/section}
    </tbody>
</table>
