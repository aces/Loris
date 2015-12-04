
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='/create_timepoint/?candID={$candID}&identifier={$candID}'">Create time point</button>
{/if}
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='/candidate_parameters/?candID={$candID}&identifier={$candID}'">Edit Candidate Info</button>
{/if}
