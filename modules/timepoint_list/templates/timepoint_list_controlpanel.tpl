
{if $isDataEntryPerson}
<a class="btn btn-default" role="button" href="{$baseurl}/create_timepoint/?candID={$candID}&identifier={$candID}">Create time point</a>
{/if}
{if $isDataEntryPerson}
    {if $candidate_parameters_edit}
        <a class="btn btn-default" role="button" href="{$baseurl}/candidate_parameters/?candID={$candID}&identifier={$candID}">Edit Candidate Info</a>
    {elseif $candidate_parameters_view}
        <a class="btn btn-default" role="button" href="{$baseurl}/candidate_parameters/?candID={$candID}&identifier={$candID}">View Candidate Info</a>
    {/if}
{/if}