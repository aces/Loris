<input class="btn btn-sm btn-primary" onclick="location.href='{$baseurl}/timepoint_list/?candID={$candID}'" value="Return to timepoint list" type="button" />
<br><br>

<!-- Nav tabs -->
<ul class="nav nav-tabs nav-tabs-loris" role="tablist">
    <li role="presentation" class="active">
        <a href="#cand-info" aria-controls="browse" role="tab" data-toggle="tab" id="cand-info-tab">
            Candidate Information
        </a>
    </li>
    <li role="presentation">
        <a href="#proband-info" aria-controls="upload" role="tab" data-toggle="tab" id="proband-info-tab">
            Proband Information
        </a>
    </li>
    <li role="presentation">
        <a href="#family-info" aria-controls="upload" role="tab" data-toggle="tab" id="family-info-tab">
            Family Information
        </a>
    </li>
    <li role="presentation">
        <a href="#participant-status" aria-controls="upload" role="tab" data-toggle="tab" id="participant-status-tab">
            Participant Status
        </a>
    </li>
    {if $useConsent === "true"}
        <li role="presentation">
            <a href="#consent-status" aria-controls="upload" role="tab" data-toggle="tab" id="consent-status-tab">
                Consent Status
            </a>
        </li>
    {/if}
</ul>

<!-- Tab panes -->
<div class="tab-content">

    <div role="tabpanel" class="tab-pane active" id="cand-info">
        Candidate info
    </div>

    <div role="tabpanel" class="tab-pane" id="proband-info">
        Proband info
    </div>

    <div role="tabpanel" class="tab-pane" id="family-info">
        Family info
    </div>

    <div role="tabpanel" class="tab-pane" id="participant-status">
        Participant info
    </div>

    <div role="tabpanel" class="tab-pane" id="consent-status">
        Consent Status info
    </div>

</div>
