	<h3 class="controlPanelSection">Actions</h3>
	<ul class="controlPanel">
	    	<li>
		{if $access.next_stage}
                        <img src="{$baseurl}/images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a
				href="{$baseurl}/next_stage/?candID={$candID}&sessionID={$sessionID}&identifier={$sessionID}">Start {$next_stage} Stage</a>
{else}
                        <img src="{$baseurl}/images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;Start Next Stage
{/if}
	    	</li>

	</ul>

	<h3 class="controlPanelSection">Stage: {$current_stage}</h3>
	<ul class="controlPanel">
		{section name=item loop=$status}
		<li>
			{if $access.status and $status[item].showlink}
                        	<img src="{$baseurl}/images/{$status[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="?candID={$candID}&sessionID={$sessionID}&setStageUpdate={$status[item].label}">{$status[item].label}</a>
			{else}
                        	<img src="{$baseurl}/images/{$status[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;{$status[item].label}
			{/if}
		</li>
		{/section}

	</ul>

	<h3 class="controlPanelSection">Send Time Point</h3>
	<ul class="controlPanel">
		<li>
			{if $access.send_to_dcc===true}
    				{if $send_to_dcc.set_submitted=='Check'}
                        		<img src="{$baseurl}/images/{$send_to_dcc.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="{$baseurl}/timepoint_flag/check_timepoint_flag/?identifier={$sessionID}">{$send_to_dcc.reverse|default:"Send To DCC"}</a><br>
	    			{else}
                        	<img src="{$baseurl}/images/{$send_to_dcc.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="?candID={$candID}&sessionID={$sessionID}&setSubmitted={$send_to_dcc.set_submitted}">{$send_to_dcc.reverse|default:"Send To DCC"}</a>
    				{/if}
			{else}
                        <span title='{$access.send_to_dcc_status_message}'><img src="{$baseurl}/images/{$send_to_dcc.icon|default:'locked'}.gif" alt="" border="0" width="12" height="12" />&nbsp;Send To DCC</span>
			{/if}
		</li>		
	</ul>


	<h3 class="controlPanelSection">BVL QC Type</h3>
	<ul class="controlPanel">
		<li>
			<img src="{$baseurl}/images/{$bvl_qc_type_none.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
			{if $bvl_qc_type_none.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=">Not Done</a>
			{else}
                                                Not Done
			{/if}
		</li>
		
		<li>
		          <img src="{$baseurl}/images/{$bvl_qc_type_visual.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
			{if $bvl_qc_type_visual.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=Visual">Visual</a>
			{else}
                                                Visual
			{/if}
		</li>
		<li>
                	<img src="{$baseurl}/images/{$bvl_qc_type_hardcopy.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
			{if $bvl_qc_type_hardcopy.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=Hardcopy">Hardcopy</a>
			{else}
                                                Hardcopy
			{/if}
		</li>
	</ul>

	<h3 class="controlPanelSection">BVL QC Status</h3>
	<ul class="controlPanel">
		<li>
			<img src="{$baseurl}/images/{$bvl_qc_status_none.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
			{if $bvl_qc_status_none.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=">Not Done</a>
			{else}
                                                Not Done
			{/if}
		</li>
		
		<li>
                	<img src="{$baseurl}/images/{$bvl_qc_status_complete.icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;
			{if $bvl_qc_status_complete.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=Complete">Complete</a>
			{else}
                                                Complete
			{/if}
		</li>
	</ul>
