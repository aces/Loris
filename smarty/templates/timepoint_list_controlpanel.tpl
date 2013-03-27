<h3 class="controlPanelSection">Actions</h3>
<ul class="controlPanel">
	<li>
		{if $isDataEntryPerson}
                        <a href="main.php?test_name=create_timepoint&candID={$candID}&identifier={$candID}">Create time point</a>
		{else}
                        Create time point
		{/if}
	</li>
	<li>
		{if $isDataEntryPerson}
                        <a href="main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}">Edit Candidate Info</a>
		{else}
                        Edit Candidate Info
		{/if}
	</li>

	<li>
       {if $isDataEntryPerson}
                        <a href="main.php?test_name=participant_status&candID={$candID}&identifier={$candID}"> Participant Status Form</a>
       {else}
                        Participant Status Form
       {/if}

	</li>
	
	<li>
    {*
		{if $isDataEntryPerson}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=demographics&candID={$candID}&identifier={$candID}">Demographics Form</a>
		{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;Demographic Form
		{/if}

	<li>
		{if $isDataEntryPerson}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=mri_safety&candID={$candID}&identifier={$candID}">MRI Safety Form</a>
		{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;MRI Safety Form
		{/if}
	</li>
    *}
</ul>
