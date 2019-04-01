<!-- table title -->
<h3>Behavioral Battery of Instruments</h3>

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
                <a href="{$baseurl}/instruments/{$instruments[group][instrument].testName}/?commentID={$instruments[group][instrument].commentID}&sessionID={$sessionID}&candID={$candID}">
	            {$instruments[group][instrument].fullName}</a></td>
	    	<td>{$instruments[group][instrument].dataEntryStatus}</td>
	    	<td>{$instruments[group][instrument].administrationStatus}</td>
	    	<td bgcolor="{$instruments[group][instrument].feedbackColor}">
		    	{$instruments[group][instrument].feedbackStatus}
	        </td>
			<td>
				{if $instruments[group][instrument].isDdeEnabled }
				    	<a href="{$baseurl}/instruments/{$instruments[group][instrument].testName}/?commentID={$instruments[group][instrument].ddeCommentID}&sessionID={$sessionID}&candID={$candID}">Double Data Entry</a>
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
  <div class="col-xs-12 row">
  </div>
  <div class="col-xs-12 row">
    <button class="btn btn-primary" onclick="location.href='{$baseurl}/imaging_browser/viewSession/?sessionID={$sessionID}'">View Imaging data</button>
  </div>
</div>
