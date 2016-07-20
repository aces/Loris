
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='{$baseurl}/create_timepoint/?candID={$candID}&identifier={$candID}'">Create time point</button>
{else}
Create time point
{/if}
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='{$baseurl}/candidate_parameters/?candID={$candID}&identifier={$candID}'">Edit Candidate Info</button>
{else}
Edit Candidate Info
{/if}
