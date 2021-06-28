{if $isDataEntryPerson || $isImagingPerson}
    <!-- <div class="col-xs-1"> -->
        <h3>Actions:&nbsp&nbsp</h3>
    <!-- </div> -->
    <!-- <div class="col-xs-4"> -->
    {if $isDataEntryPerson}
        <a class="btn btn-default" role="button" href="{$baseurl}/create_timepoint/?candID={$candID}&identifier={$candID}">Create time point</a>
        <a class="btn btn-default" role="button" href="{$baseurl}/candidate_parameters/?candID={$candID}&identifier={$candID}">Candidate Info</a>
    {/if}
    {if $isImagingPerson}
        <a class="btn btn-default" role="button" href="{$baseurl}/imaging_browser/?DCCID={$candID}">View Imaging datasets</a>
    {/if}
    <!-- </div> -->
{/if}
