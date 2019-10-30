	<h3 class="controlPanelSection">Actions</h3>
	<ul class="controlPanel">
	    	<li>
		{if $access.next_stage}
                        <i class="fas fa-folder-open fa-sm" width="12" height="12"></i>&nbsp;<a
				href="{$baseurl}/next_stage/?candID={$candID}&sessionID={$sessionID}&identifier={$sessionID}">Start {$next_stage} Stage</a>
{else}
                        <small>(No actions)</small>
{/if}
	    	</li>

	</ul>

	<h3 class="controlPanelSection">Stage: {$current_stage}</h3>
	<ul class="controlPanel fa-ul">
		{section name=item loop=$status}
		<li>
			{if $access.status and $status[item].showlink}
                        	<span class="fa-li"><i class="{$status[item].icon|default:'far fa-square'}"></i></span><a href="?candID={$candID}&sessionID={$sessionID}&setStageUpdate={$status[item].label}">{$status[item].label}</a>
			{else}
                        	<span class="fa-li"><i class="{$status[item].icon|default:'far fa-square'}"></i></span>{$status[item].label}
			{/if}
		</li>
		{/section}

	</ul>

	<h3 class="controlPanelSection">Send Time Point</h3>
	<ul class="controlPanel fa-ul">
		<li>
			{if $access.send_to_dcc===true}
    				{if $send_to_dcc.set_submitted=='Check'}
                        		<span class="fa-li"><i class="{$send_to_dcc.icon|default:'far fa-square'}"></i></span><a href="{$baseurl}/timepoint_flag/check_timepoint_flag/?identifier={$sessionID}">{$send_to_dcc.reverse|default:"Send To DCC"}</a><br>
	    			{else}
                        	<span class="fa-li"><i class="{$send_to_dcc.icon|default:'far fa-square'}"></i></span><a href="?candID={$candID}&sessionID={$sessionID}&setSubmitted={$send_to_dcc.set_submitted}">{$send_to_dcc.reverse|default:"Send To DCC"}</a>
    				{/if}
			{else}
                        <span title='{$access.send_to_dcc_status_message}'><span class="fa-li"><i class="{$send_to_dcc.icon|default:'fas fa-times'}"></i></span>Send To DCC</span>
			{/if}
		</li>		
	</ul>


	<h3 class="controlPanelSection">BVL QC Type</h3>
	<ul class="controlPanel fa-ul">
		<li>
			<span class="fa-li"><i class="{$bvl_qc_type_none.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_type_none.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=">Not Done</a>
			{else}
                                                Not Done
			{/if}
		</li>
		
		<li>
		          <span class="fa-li"><i class="{$bvl_qc_type_visual.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_type_visual.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=Visual">Visual</a>
			{else}
                                                Visual
			{/if}
		</li>
		<li>
                	<span class="fa-li"><i class="{$bvl_qc_type_hardcopy.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_type_hardcopy.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCType=Hardcopy">Hardcopy</a>
			{else}
                                                Hardcopy
			{/if}
		</li>
	</ul>

	<h3 class="controlPanelSection">BVL QC Status</h3>
	<ul class="controlPanel fa-ul">
		<li>
			<span class="fa-li"><i class="{$bvl_qc_status_none.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_status_none.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=">Not Done</a>
			{else}
                                                Not Done
			{/if}
		</li>
		
		<li>
                	<span class="fa-li"><i class="{$bvl_qc_status_complete.icon|default:'far fa-square'}"></i></span>
			{if $bvl_qc_status_complete.showlink}
                        	<a href="?candID={$candID}&sessionID={$sessionID}&setBVLQCStatus=Complete">Complete</a>
			{else}
                                                Complete
			{/if}
		</li>
	</ul>
