<br />
<form method="post" name="patient_status" id="patient_status">
<table class="std">

    <!-- table title -->
    <tr><th colspan="2">Patient Status</th></tr>

    {foreach from=$element_list item=element}

    {if $element eq 'ssid'}
    
    <tr>
        <td nowrap="nowrap">{$form.$element.label}</td>
        <td nowrap="nowrap">{$ssid}</td>
    </tr>
    {else}
    <tr>
        <td nowrap="nowrap">{$form.$element.label}</td>
        <td nowrap="nowrap">{$form.$element.html} 
	        {if $form.errors.$element}
        		<span class='error'>{$form.errors.$element}</span>
        	{/if}
        </td>
    </tr>
    {/if}
    {/foreach}
    
	<tr>
        <td nowrap="nowrap">&nbsp;</td>
		<td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
    {/if}
        <input class="button" onclick="location.href='main.php?test_name=timepoint_list&candID={$candID}'" value="Return to profile" type="button" />
        </td>
	</tr>
</table>
{$form.hidden}
</form>

