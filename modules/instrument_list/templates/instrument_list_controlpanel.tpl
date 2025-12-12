	<h3 class="controlPanelSection">{dgettext("timepoint_list", "Actions:")}</h3>
	<ul class="controlPanel">
	    	<li>
		{if $access.next_stage}
                        <i class="fas fa-folder-open fa-sm" width="12" height="12"></i>&nbsp;<a
				href="{$baseurl}/next_stage/?candID={$candID}&sessionID={$sessionID}&identifier={$sessionID}">{sprintf(dgettext("instrument_list", "Start %s Stage"), dgettext("loris", $next_stage))}</a>
{else}
                        <small>({dgettext("instrument_list", "No actions")})</small>
{/if}
	    	</li>

	</ul>

	<h3 class="controlPanelSection">{sprintf(dgettext("instrument_list", "Stage: %s"), dgettext("loris", $current_stage))}</h3>
	<ul class="controlPanel fa-ul">
		{section name=item loop=$status}
		<li>
			{if $access.status and $status[item].showlink|default}
				{assign var="onclickValue" value="{$status[item].label}"}
                <span class="fa-li">
					<i class="{$status[item].icon|default:'far fa-square'}"></i>
				</span>
				<a
					onclick="sendUpdate('/instrument_list/?candID={$candID}&sessionID={$sessionID}&setStageUpdate=' + '{$onclickValue}')"
					style="cursor: pointer;"
				>
					{dgettext("loris", $status[item].label)}
				</a>
			{else}
                <span class="fa-li"><i class="{$status[item].icon|default:'far fa-square'}"></i></span>{dgettext("loris", $status[item].label)}
			{/if}
		</li>
		{/section}
	</ul>

	<h3 class="controlPanelSection">{dgettext("instrument_list", "Send TimePoint")}</h3>
	<ul class="controlPanel fa-ul">
		<li>
			{if $access.send_to_dcc===true}
    				{if $send_to_dcc.set_submitted=='Check'}
                                        <span class="fa-li"><i class="{$send_to_dcc.icon|default:'far fa-square'}"></i></span><a href="{$baseurl}/timepoint_flag/check_timepoint_flag/?identifier={$sessionID}">{$send_to_dcc.reverse|default:dgettext("loris", "Send To DCC")}</a><br>
	    			{else}
						<a
                                                        onclick="sendUpdate('/instrument_list/?candID={$candID}&sessionID={$sessionID}&setSubmitted={$send_to_dcc.set_submitted}')"
                                                        style="cursor: pointer;"
						>
                                                        {if ($send_to_dcc.reverse) }
                                                            {dgettext("loris", $send_to_dcc.reverse)}
                                                        {else}
                                                            {dgettext("loris", "Send To DCC")}
                                                        {/if}
						</a>
    				{/if}
			{else}
                        <span title='{$access.send_to_dcc_status_message}'><span class="fa-li"><i class="{$send_to_dcc.icon|default:'fas fa-times'}"></i></span>{dgettext("loris", "Send To DCC")}</span>
			{/if}
		</li>
	</ul>


	<h3 class="controlPanelSection">{dgettext("timepoint_list", "BVL QC")}</h3>
	<ul class="controlPanel fa-ul">
		<li>
			<span class="fa-li"><i class="{$bvl_qc_type_none.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_type_none.showlink|default}
                                <a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=">{dgettext("timepoint_list", "Not Done")}</a>
			{else}
                                                {dgettext("timepoint_list", "Not Done")}
			{/if}
		</li>

		<li>
		          <span class="fa-li"><i class="{$bvl_qc_type_visual.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_type_visual.showlink|default}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=Visual">{dgettext("timepoint_list", "Visual")}</a>
			{else}
                                                {dgettext("timepoint_list", "Visual")}
			{/if}
		</li>
		<li>
                	<span class="fa-li"><i class="{$bvl_qc_type_hardcopy.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_type_hardcopy.showlink|default}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=Hardcopy">{dgettext("timepoint_list", "Hardcopy")}</a>
			{else}
                                                {dgettext("timepoint_list", "Hardcopy")}
			{/if}
		</li>
	</ul>

	<h3 class="controlPanelSection">{dgettext("timepoint_list", "BVL QC")}</h3>
	<ul class="controlPanel fa-ul">
		<li>
			<span class="fa-li"><i class="{$bvl_qc_status_none.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_status_none.showlink|default}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=">{dgettext("timepoint_list", "Not Done")}</a>
			{else}
                                                {dgettext("timepoint_list", "Not Done")}
			{/if}
		</li>

		<li>
                	<span class="fa-li"><i class="{$bvl_qc_status_complete.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_status_complete.showlink|default}
                                <a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=Complete">{dgettext("timepoint_list", "Complete")}</a>
			{else}
                                                {dgettext("timepoint_list", "Complete")}
			{/if}
		</li>
	</ul>

<script>
function sendUpdate(suffix) {
	try {
		fetch(loris.BaseURL + suffix, {}).then((response) => {
			if (response.ok) {
				window.location.reload(true);
			}
		})
	} catch (e) {
		console.error("An error occurred: " + e.message);
	}
}
</script>
