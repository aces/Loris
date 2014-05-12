<!-- table title -->
<br />
<table border="0" valign="bottom" width="100%"><td class="controlPanelSection"><strong>Behavioral Battery of Instruments</strong></td></table>

<!-- table with list of instruments and links to open them -->
<div class="table-responsive">
<table class="table table-hover" cellpadding="2">
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
		    	<a href="main.php?test_name={$instruments[group][instrument].testName}&candID={$candID}&sessionID={$sessionID}&commentID={$instruments[group][instrument].commentID}">
	            {$instruments[group][instrument].fullName}</a></td>
	    	<td>{$instruments[group][instrument].dataEntryStatus}</td>
	    	<td>{$instruments[group][instrument].administrationStatus}</td>
	    	<td bgcolor="{$instruments[group][instrument].feedbackColor}">
		    	{$instruments[group][instrument].feedbackStatus}
	        </td>
			<td>
				{if $instruments[group][instrument].isDdeEnabled }
				    	<a href="main.php?test_name={$instruments[group][instrument].testName}&candID={$candID}&sessionID={$sessionID}&commentID={$instruments[group][instrument].ddeCommentID}">Double Data Entry</a>
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
</div>
