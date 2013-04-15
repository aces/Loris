<br />
<form method="post" name="participant_status" id="participant_status">
<table class="std">
    <tr><th colspan="2">Participant Status</th></tr>
    <tr>
        <td nowrap="nowrap">{$form.entry_staff.label}</td>
        <td nowrap="nowrap">{$form.entry_staff.html}</td>
    </tr>

    <tr>
        <td nowrap="nowrap">{$form.data_entry_date.label}</td>
        <td nowrap="nowrap">{$form.data_entry_date.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.pscid.label}</td>
        <td nowrap="nowrap">{$pscid}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.participant_status.label}</td>
        <td nowrap="nowrap">{$form.participant_status.html}
        {if $form.errors.participant_status}
            <span class='error'>{$form.errors.participant_status}</span>
        {/if}
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.reason_specify_group.label}</td>
        <td nowrap="nowrap">{$form.reason_specify_group.html}
        {if $form.reason_specify_group.error}
            <span class='error'>{$form.reason_specify_group.error}</span>
        {/if}
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.withdrawal_reasons.label}</td>
        <td nowrap="nowrap">{$form.withdrawal_reasons.html}
        {if $form.withdrawal_reasons.error}
            <span class='error'>{$form.withdrawal_reasons.error}</span>
        {/if}
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.withdrawal_reasons_other_specify_group.label}</td>
        <td nowrap="nowrap">{$form.withdrawal_reasons_other_specify_group.html}
        {if $form.withdrawal_reasons_other_specify_group.error}
            <span class='error'>{$form.withdrawal_reasons_other_specify_group.error}</span>
        {/if}
        </td>
    </tr>
    
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

