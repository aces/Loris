
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='main.php?test_name=create_timepoint&candID={$candID}&identifier={$candID}'">Create time point</button>
{/if}
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'">Edit Candidate Info</button>
{/if}
