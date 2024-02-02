<!-- table with candidate profile info -->
<table cellpadding="2" class="table table-info table-bordered dynamictable" style="max-width:auto">
  <!-- column headings -->
  <thead>
  <tr class="info">
    {assign var="DoB" value=$candidate->getDisplayDoB()}
    <th>
      {$DoB['label']}
    </th>
    {if $display.EDC!=""}
      <th>
        EDC
      </th>
    {/if}
    <th>
      Biological Sex
    </th>
    {if $display.ProjectTitle == $display.ProjectName && $display.ProjectName != ""}
      <th>
        Project
      </th>
    {else}
      {if $display.ProjectTitle != ""}
        <th>
          Candidate Registration Project
        </th>
      {/if}
      {if $display.ProjectName != ""}
        <th>
          Timepoint Project
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
        Visit Label
      </th>
      <th>
        Visit to Site
      </th>
      <th>
        Cohort
      </th>
      <th>
        MR Scan Done
      </th>
      <th>
        Within Optimal
      </th>
      <th>
        Within Permitted
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
      {$DoB['value']}
    </td>
    {if $display.EDC!=""}
      <td>
        {$display.EDC}
      </td>
    {/if}
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
        {$display.Scan_done|default:"<img alt=\"Data Missing\" src=\"{$baseurl|default}/images/help2.gif\" width=\"12\" height=\"12\" />"}
      </td>
      <td>
        {if $display.WindowInfo.Optimum|default}
          Yes
        {else}
          No
        {/if}
      </td>
      <td {if not $display.WindowInfo.Optimum|default}class="error"{/if}>
        {if $display.WindowInfo.Permitted|default}
          Yes
        {else}
          No
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
        Stage
      </th>
      <th nowrap="nowrap" colspan="3">
        Status
      </th>
      <th nowrap="nowrap" colspan="2">
        Date
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td nowrap="nowrap" colspan="3">
        Screening
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
        Visit
      </td>
      <td nowrap="nowrap" colspan="3">
        {$display.Visit}
      </td>
      <td nowrap="nowrap" colspan="2">
        {$display.Date_visit}
      </td>
    </tr>
    <tr>
      <td nowrap="nowrap" colspan="3">
        Approval
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
<h3>Behavioural Battery of Instruments</h3>

<!-- table with list of instruments and links to open them -->
<table class="table table-hover table-bordered dynamictable" cellpadding="2">
{section name=group loop=$instruments}
    <!-- print the sub group header row -->
    <thead>
    <tr class="info">
	    <th>{$instrument_groups[group].title}
	       <!-- show the instruction only one time -->
	       {if $smarty.section.group.iteration == 1}
	       <br />(Click To Open)
	       {/if}
	    </th>
	    <th>Data Entry</th>
	    <th>Administration</th>
	    <th>Feedback</th>
	    <th>Double Data Entry Form</th>
	    <th>Double Data Entry Status</th>
    </tr>
    </thead>
	{section name=instrument loop=$instruments[group]}
	<tbody>
	   	<tr{if $instruments[group][instrument].isDirectEntry} class="directentry"{/if}>
	    	<td>
                <a href="{$baseurl|default}/instruments/{$instruments[group][instrument].testName}/?commentID={$instruments[group][instrument].commentID}&sessionID={$sessionID}&candID={$candID}">
	            {$instruments[group][instrument].fullName}</a></td>
	    	<td>{$instruments[group][instrument].dataEntryStatus}</td>
	    	<td>{$instruments[group][instrument].administrationStatus}</td>
	    	<td bgcolor="{$instruments[group][instrument].feedbackColor|default}">
		    	{$instruments[group][instrument].feedbackStatus}
	        </td>
			<td>
				{if $instruments[group][instrument].isDdeEnabled }
				    	<a href="{$baseurl|default}/instruments/{$instruments[group][instrument].testName}/?commentID={$instruments[group][instrument].ddeCommentID}&sessionID={$sessionID}&candID={$candID}">Double Data Entry</a>
			   {/if}&nbsp;
			</td>
			<td>{if $instruments[group][instrument].isDdeEnabled }{$instruments[group][instrument].ddeDataEntryStatus}{/if}&nbsp;</td>
	   	</tr>
	   </tbody>
	{/section}
{sectionelse}
     <tr><td nowrap="nowrap">The battery has no registered instruments</td></tr>
{/section}
</table>
{if $imaging_browser_permission}
  <div class="col-xs-12 row">
  </div>
  <div class="col-xs-12 row">
    <button class="btn btn-primary" onclick="location.href='{$baseurl|default}/imaging_browser/viewSession/?sessionID={$sessionID}'">View Imaging data</button>
  </div>
{/if}
</div>
