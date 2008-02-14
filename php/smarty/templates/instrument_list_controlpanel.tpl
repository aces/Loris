                <tr><td class="controlPanelSection">Actions</td></tr>
                <tr>
                    <td class="controlPanelItem">
{if $access.next_stage}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=next_stage&candID={$candID}&sessionID={$sessionID}&identifier={$sessionID}">Start {$next_stage} Stage</a>
{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;Start Next Stage
{/if}
                    </td>
                </tr>
                <tr><td>&nbsp;</td></tr>

                <tr><td class="controlPanelSection">Stage: {$current_stage}</td></tr>
{section name=item loop=$status}
                <tr>
                    <td class="controlPanelItem">
{if $access.status and $status[item].showlink}
                        <img src="images/{$status[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setStageUpdate={$status[item].label}">{$status[item].label}</a>
{else}
                        <img src="images/{$status[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;{$status[item].label}
{/if}
                    </td>
                </tr>
{/section}
                <tr><td>&nbsp;</td></tr>

                <tr><td class="controlPanelSection">Send Time Point</td></tr>
                <tr>
                    <td class="controlPanelItem">
{if $access.send_to_dcc===true}
    {if $send_to_dcc.set_submitted=='Check'}
                        <img src="images/{$send_to_dcc.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=timepoint_flag&subtest=check_timepoint_flag&identifier={$sessionID}">{$send_to_dcc.reverse|default:"Send To DCC"}</a><br>
    {else}
                        <img src="images/{$send_to_dcc.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setSubmitted={$send_to_dcc.set_submitted}">{$send_to_dcc.reverse|default:"Send To DCC"}</a>
    {/if}
{else}
                        <span title='{$access.send_to_dcc_status_message}'><img src="images/{$send_to_dcc.icon|default:'locked'}.gif" alt="" border="0" width="12" height="12" />&nbsp;Send To DCC</span>
{/if}
                    </td>
                </tr>
                <tr><td>&nbsp;</td></tr>

                <tr><td class="controlPanelSection">BVL QC Type</td></tr>
                
                <tr>
                    <td class="controlPanelItem">
                    <img src="images/{$bvl_qc_type_none.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
{if $bvl_qc_type_none.showlink}
                        <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setBVLQCType=">Not Done</a>
{else}
						Not Done
{/if}
                    </td>
                </tr>
                <tr>
                    <td class="controlPanelItem">
                    <img src="images/{$bvl_qc_type_visual.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
{if $bvl_qc_type_visual.showlink}
                        <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setBVLQCType=Visual">Visual</a>
{else}
						Visual
{/if}
                    </td>
                </tr>
                <tr>
                    <td class="controlPanelItem">
                    <img src="images/{$bvl_qc_type_hardcopy.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
{if $bvl_qc_type_hardcopy.showlink}
                        <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setBVLQCType=Hardcopy">Hardcopy</a>
{else}
						Hardcopy
{/if}
                    </td>
                </tr>

                <tr><td>&nbsp;</td></tr>
                
                <tr><td class="controlPanelSection">BVL QC Status</td></tr>
                
                <tr>
                    <td class="controlPanelItem">
                    <img src="images/{$bvl_qc_status_none.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
{if $bvl_qc_status_none.showlink}
                        <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=">Not Done</a>
{else}
						Not Done
{/if}
                    </td>
                </tr>
                <tr>
                    <td class="controlPanelItem">
                    <img src="images/{$bvl_qc_status_complete.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
{if $bvl_qc_status_complete.showlink}
                        <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=Complete">Complete</a>
{else}
						Complete
{/if}
                    </td>
                </tr>

                <tr><td>&nbsp;</td></tr>



