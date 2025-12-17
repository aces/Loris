<!-- table with candidate profile info -->
<table cellpadding="2" class="table table-info table-bordered dynamictable" style="max-width:auto">
  <!-- column headings -->
  <thead>
  <tr class="info">
    {assign var="DoB" value=$candidate->getDisplayDoB()}
    <th>
      {dgettext("timepoint_list", "Derived Age")}
    </th>
    <th>
      {dgettext("timepoint_list", "EDC Age")}
    </th>
    <th>
      {dgettext("timepoint_list", "Biological Sex")}
    </th>
    {if $display.ProjectTitle == $display.ProjectName && $display.ProjectName != ""}
      <th>
        {dgettext("loris", "Project")}
      </th>
    {else}
      {if $display.ProjectTitle != ""}
        <th>
          {dgettext("loris", "Candidate Registration Project")}
        </th>
      {/if}
      {if $display.ProjectName != ""}
        <th>
          {dgettext("loris", "Timepoint Project")}
        </th>
      {/if}
    {/if}
    {foreach from=$display.DisplayParameters item=value key=name}
      <th>
        {$name}
      </th>
    {/foreach}
    {if $sessionID != ""}
      <th>
        {dgettext("loris", "Visit Label")}
      </th>
      <th>
        {dgettext("instrument_list", "Visit to Site")}
      </th>
      <th>
        {dgettext("loris", "Cohort")}
      </th>
      <th>
        {dgettext("timepoint_list", "Imaging Scan Uploaded")}
      </th>
      <th>
        {dgettext("instrument_list", "Within Optimal")}
      </th>
      <th>
        {dgettext("instrument_list", "Within Permitted")}
      </th>
      {if $SupplementalSessionStatuses|default}
        {foreach from=$timePoint.status item=status key=name}
          <th>
            {$name}
          </th>
        {/foreach}
      {/if}
    {/if}
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
      {$display.Sex}
    </td>
    {if $display.ProjectName != "" && $display.ProjectName == $display.ProjectTitle}  
      <td>
        {$display.ProjectName}
      </td>
    {else}
      {if $display.ProjectTitle != ""}  
        <td>
          {$display.ProjectTitle}
        </td>
      {/if}
      {if $display.ProjectName != ""}  
        <td>
          {$display.ProjectName}
        </td>
      {/if}
    {/if}
    {foreach from=$display.DisplayParameters item=value key=name}
      <td>
        {$value}
      </td>
    {/foreach}

    {if $sessionID != ""}
      <!-- timepoint data -->
      <td>
        {$display.Visit_label}
      </td>
      <td>
        {$display.PSC}
      </td>
      <td>
        {$display.CohortTitle}
      </td>
      <td>
        {if $display.scanUploaded != ""}
            {if $display.scanUploaded == 'Y'}
                {assign var="scanUploaded" value=dgettext("loris", "Yes")}
                <a href="{$baseurl|default}/imaging_browser/viewSession/?sessionID={$sessionID}" class="timepoint_list">
                {$scanUploaded}</a>
            {else}
                {assign var="scanUploaded" value={dgettext("loris", "No")}}
                {$scanUploaded}
            {/if}
        {else}
            <img alt="Data Missing" src="{$baseurl|default}/images/delete.gif" border=0>
        {/if}
      </td>
      <td>
        {if $display.WindowInfo.Optimum|default}
          {dgettext("loris", "Yes")}
        {else}
          {dgettext("loris", "No")}
        {/if}
      </td>
      <td {if not $display.WindowInfo.Optimum|default}class="error"{/if}>
        {if $display.WindowInfo.Permitted|default}
          {dgettext("loris", "Yes")}
        {else}
          {dgettext("loris", "No")}
        {/if}
      </td>
      {if $SupplementalSessionStatuses|default}
        {foreach from=$display.status item=status}
          <td>
            {$status}
          </td>
        {/foreach}
      {/if}
    {/if}
  </tr>
  </tbody>
</table>
<div class="table-responsive">
  <table class="table table-bordered">
    <!-- visit statuses -->
    <thead>
    <tr class="info">
      <th nowrap="nowrap" colspan="3">
        {dgettext("loris", "Stage")}
      </th>
      <th nowrap="nowrap" colspan="3">
        {dgettext("timepoint_list", "Stage Status")}
      </th>
      <th nowrap="nowrap" colspan="2">
        {dgettext("timepoint_list", "Date of Stage")}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td nowrap="nowrap" colspan="3">
        {dgettext("loris", "Screening")}
      </td>
      <td nowrap="nowrap" colspan="3">
        {$display.Screening}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$display.Date_screening}
      </td>
    </tr>
    <tr>
      <td nowrap="nowrap" colspan="3">
        {dgettext("loris", "Visit")}
      </td>
      <td nowrap="nowrap" colspan="3">
        {if $display.Visit != ""}
            {dgettext("loris", $display.Visit)}
        {/if}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$display.Date_visit}
      </td>
    </tr>
    <tr>
      <td nowrap="nowrap" colspan="3">
        {dgettext("loris", "Approval")}
      </td>
      <td nowrap="nowrap" colspan="3">
        {$display.Approval}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$display.Date_approval}
      </td>
    </tr>
    </tbody>
  </table>
</div>

<!-- table title -->
<h3>{dgettext("instrument_list", "Behavioural Battery of Instruments")}</h3>

<!-- table with list of instruments and links to open them -->
<table class="table table-hover table-bordered dynamictable" cellpadding="2">
{section name=group loop=$instruments}
    <!-- print the sub group header row -->
    <thead>
    <tr class="info">
	    <th>{dgettext("loris", $instrument_groups[group].title)}
	       <!-- show the instruction only one time -->
	       {if $smarty.section.group.iteration == 1}
	       <br />({dgettext("timepoint_list", "Click to Open")})
	       {/if}
	    </th>
	    <th>{dgettext("loris", "Data Entry")}</th>
	    <th>{dgettext("loris", "Administration")}</th>
	    <th>{dgettext("loris", "Feedback")}</th>
	    <th>{dgettext("loris", "Double Data Entry Form")}</th>
	    <th>{dgettext("loris", "Double Data Entry Status")}</th>
    </tr>
    </thead>
	{section name=instrument loop=$instruments[group]}
	<tbody>
	   	<tr{if $instruments[group][instrument].isDirectEntry} class="directentry"{/if}>
	    	<td>
                <a href="{$baseurl|default}/instruments/{$instruments[group][instrument].testName}/?commentID={$instruments[group][instrument].commentID}&sessionID={$sessionID}&candID={$candID}">
	            {$instruments[group][instrument].fullName}</a></td>
	    	<td>
                    {if $instruments[group][instrument].dataEntryStatus != ""}
                        {dgettext("loris", $instruments[group][instrument].dataEntryStatus)}</td>
                    {/if}
	    	<td>
                    {if $instruments[group][instrument].administrationStatus != ""}
                        {dgettext("loris", $instruments[group][instrument].administrationStatus)}
                    {/if}
                </td>
	    	<td bgcolor="{$instruments[group][instrument].feedbackColor|default}">
                    {dgettext("timepoint_list", $instruments[group][instrument].feedbackStatus)}
	        </td>
			<td>
                            {if $instruments[group][instrument].isDdeEnabled }
				    	<a href="{$baseurl|default}/instruments/{$instruments[group][instrument].testName}/?commentID={$instruments[group][instrument].ddeCommentID}&sessionID={$sessionID}&candID={$candID}">{dgettext("loris", "Double Data Entry")}</a>
                            {/if}&nbsp;
			</td>
			<td>
                            {if $instruments[group][instrument].isDdeEnabled && $instruments[group][instrument].ddeDataEntryStatus != "" }
                                {dgettext("loris", $instruments[group][instrument].ddeDataEntryStatus)}
                            {/if}&nbsp;
                        </td>
	   	</tr>
	   </tbody>
	{/section}
{sectionelse}
     <tr><td nowrap="nowrap">{dgettext("instrument_list", "The battery has no registered instruments")}</td></tr>
{/section}
</table>
{if $imaging_browser_permission}
  <div class="col-xs-12 row">
  </div>
  <div class="col-xs-12 row">
      <button class="btn btn-primary" onclick="location.href='{$baseurl|default}/imaging_browser/viewSession/?sessionID={$sessionID}'">
          {dgettext("instrument_list", "View Imaging data")}
      </button>
  </div>
{/if}
</div>
