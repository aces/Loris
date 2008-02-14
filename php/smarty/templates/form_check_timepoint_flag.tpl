<br />
<form method="post" name="timepoint_flag" id="timepoint_flag">
<table class="std">

    <!-- table title -->
    <tr>
        <th colspan="2">
            DCC-ID: {$candID} / Timepoint:{$timepointLabel}
            &nbsp;
            <input class="button" onclick="location.href='main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}'" value="Return to profile" type="button" />
        </th>
        <tr>
           <td nowrap="nowrap" colspan="2">&nbsp;</td>
        </tr>
    </tr>

    {foreach from=$form.errors item=error}
        <tr>
            <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
        </tr>
    {/foreach}
    
        {if $elements_list_DERR}
            	<tr>
            		<td nowrap="nowrap" colspan="2" align="center"><b>Data Entry Errors</b></td>
            	</tr>
        	{foreach from=$elements_list_DERR item=element}
            	<!-- display the list of triggered flags -->
                <tr>
            		<td nowrap="nowrap">{$form.$element.label}</td>
            		<td nowrap="nowrap">{$form.$element.html}</td>
            	</tr>
        	{/foreach}
      	{/if}
        {if $elements_list_MI}
            	<tr>
            		<td nowrap="nowrap" colspan="2" align="center"><b>Missing Instruments</b></td>
            	</tr>
        	{foreach from=$elements_list_MI item=element}
            	<!-- display the list of triggered flags -->
                <tr>
            		<td nowrap="nowrap">{$form.$element.label}</td>
            		<td nowrap="nowrap">{$form.$element.html}</td>
            	</tr>
        	{/foreach}
    	{/if}
    	
    	<!-- The following is commented-out in PROD -->
<!--
        {if $elements_list_1}
            	<tr>
            		<td nowrap="nowrap" colspan="2" align="center"><b>New Flags</b></td>
            	</tr>
        	{foreach from=$elements_list_1 item=element}
                <tr>
            		<td nowrap="nowrap">{$form.$element.label}</td>
            		<td nowrap="nowrap">{$form.$element.html}</td>
            	</tr>
        	{/foreach}
    	{/if}
        {if $elements_list_exists}
            	<tr>
            		<td nowrap="nowrap" colspan="2" align="center"><b>Previously Triggered Flags</b></td>
            	</tr>
        	{foreach from=$elements_list_exists item=element}
                <tr>
            		<td nowrap="nowrap">{$form.$element.label}</td>
            		<td nowrap="nowrap">{$form.$element.html}</td>
            	</tr>
        	{/foreach}
    	{/if}
-->
    	
    	{if $elements_list_DERR}
                 <tr>
                    <th nowrap="nowrap" colspan="2">
                            Please return to the profile and complete or correct data entry errors.
                        &nbsp;
                        <input class="button" onclick="location.href='main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}'" value="Return to profile" type="button" />
                    </th>
                 </tr>
    	{else}
        	{if $elements_list_MI}
                 <tr>
                    <td nowrap="nowrap" colspan="2">&nbsp;</td>
                 </tr>
                 <tr>
                    <th nowrap="nowrap" colspan="2">Prior to sending this timepoint to DCC,<BR>please note that the reported missing instruments will be flagged for review.</th>
                 </tr>
        	{/if}
                 <tr>
                    <td nowrap="nowrap" colspan="2">
                    <input class="button" onclick="location.href='main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setSubmitted=Y'" value="Send To DCC (Confirm)" type="button" />
                    </td>
                 </tr>
    	{/if}
</table>
{$form.hidden}
</form> 