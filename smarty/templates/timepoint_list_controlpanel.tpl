
{if $isDataEntryPerson}
<button class="button" onclick="location.href='main.php?test_name=create_timepoint&candID={$candID}&identifier={$candID}'">Create time point</button>
{else}
Create time point
{/if}
{if $isDataEntryPerson}
<button class="button" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'">Edit Candidate Info</button>
{else}
Edit Candidate Info
{/if}
