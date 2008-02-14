<!-- table title -->
<br />
<table border="0" valign="bottom" width="100%"><td class="controlPanelSection">Behavioral Battery of Instruments</td></table>

<!-- table with list of instruments and links to open them -->
<table class="listColorCoded" cellpadding="2">
{section name=group loop=$instruments}
    <!-- print the sub group header row -->
    <tr>
	    <th nowrap="nowrap">{$instrument_groups[group].title}
	       <!-- show the instruction only one time -->
	       {if $smarty.section.group.iteration == 1}
	       <br />(Click To Open)
	       {/if}
	    </th>
	    <th nowrap="nowrap">Data Entry</th>
	    <th nowrap="nowrap">Administration</th>
	    <th nowrap="nowrap">Feedback</th>
    </tr>	
	{section name=instrument loop=$instruments[group]}
   	<tr>
    	<td nowrap="nowrap">
	    	<a href="main.php?test_name={$instruments[group][instrument].testName}&candID={$candID}&sessionID={$sessionID}&commentID={$instruments[group][instrument].commentID}">
            {$instruments[group][instrument].fullName}</a></td>
    	<td nowrap="nowrap">{$instruments[group][instrument].dataEntryStatus}</td>
    	<td nowrap="nowrap">{$instruments[group][instrument].administrationStatus}</td>
    	<td nowrap="nowrap" bgcolor="{$instruments[group][instrument].feedbackColor}">
	    	{$instruments[group][instrument].feedbackStatus}
        </td>
   	</tr>
	{/section}
{sectionelse}
     <tr><td nowrap="nowrap">The battery has no registered instruments</td></tr>
{/section}
</table>
