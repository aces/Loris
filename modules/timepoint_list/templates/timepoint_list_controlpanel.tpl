
{if $isDataEntryPerson}
<button class="btn btn-primary" onclick="location.href='{$baseurl}/create_timepoint/?candID={$candID}&identifier={$candID}'">Create time point</button>
{/if}
{if $isDataEntryPerson}
    {if $candidate_parameters_edit}
        <button class="btn btn-primary" onclick="location.href='{$baseurl}/candidate_parameters/?candID={$candID}&identifier={$candID}'">Edit Candidate Info</button>
    {elseif $candidate_parameters_view}
        <button class="btn btn-primary" onclick="location.href='{$baseurl}/candidate_parameters/?candID={$candID}&identifier={$candID}'">View Candidate Info</button>
    {/if}
{/if}