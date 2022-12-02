<script language="javascript" src="{$baseurl}/configuration/js/cohort.js">

</script>
<p>Use this page to manage the configuration of existing cohorts, or to add a new one.</p>


<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    <li class="active"><a id="#cohortnew" href="#cohortnew" data-toggle="tab" class="active"}>New CohortID</a></li>
    {foreach from=$cohorts key=cohortID item=cohort name=configContent}
    <li><a id="#cohort{$cohortID}" href="#cohort{$cohortID}" data-toggle="tab">{$cohort.title}</a></li>
    {/foreach}
</ul>
</div>

<div class="col-md-7">
    <div class="tab-content">
    {foreach from=$cohorts key=cohortID item=cohort name=tabContent}
    <div id="cohort{$cohortID}" class="tab-pane">
        <h2>{$cohort.title} (CohortID: {$cohortID})</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$cohortID}">
            <fieldset>
                <input type="hidden" name="cohortID" value="{$cohortID}" class="cohortID">
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the cohort'}">
                        <label class="col-sm-12 control-label">Cohort Name</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control cohortTitle" name="title" value="{$cohort.title}">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{"Include field for EDC (Expected Date of Confinement) in Candidate Parameters to record subject's due date if applicable"}">
                        <label class="col-sm-12 control-label">Use EDC</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        {html_options options=$useEDCOptions name="useEDC" selected=$cohort.options.useEDC class="form-control cohortuseEDC"}
                    </div>
                </div>
                <div class="form-group">
		            <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Choose a method by which Window Difference will be calculated. It will be displayed in days at the head of every instrument form'}">
                        <label class="col-sm-12 control-label">Calculate Window Difference For Instruments Based On</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        {html_options options=$WindowDifferenceOptions name="WindowDifference" selected=$cohort.options.WindowDifference class="form-control cohortWindowDifference"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                        <label class="col-sm-12 control-label">Recruitment Target</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control cohortRecruitmentTarget" name="target" placeholder="Please add a recruitment target here" value="{$cohort.RecruitmentTarget}">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button id="savecohort{$cohortID}" class="btn btn-primary savecohort">Save</button>
                        <button class="btn btn-default" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    {/foreach}
    <div id="cohortnew" class="tab-pane active">
        <h2>New Cohort</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$cohortID}">
            <fieldset>
                <input type="hidden" name="cohortID" value="new" class="cohortID">
                <div class="form-group">
                    <div class="alert alert-warning">
                          <strong>Note</strong> After adding a new cohort, Visit labels for this cohort can only be created by editing the configuration file, "config.xml". Please contact your administrator if you need more information.
                    </div>
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the cohort'}">
                        <label class="col-sm-12 control-label">Cohort Name</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        <input class="form-control cohortTitle" name="title" placeholder="Please add a cohort title here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{"Include field for EDC (Expected Date of Confinement) in Candidate Parameters to record subject's due date if applicable"}">
                        <label class="col-sm-12 control-label">Use EDC</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        {html_options options=$useEDCOptions name="useEDC" selected="Yes" class="form-control cohortuseEDC"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Choose a method by which Window Difference will be calculated. It will be displayed in days at the head of every instrument form'}">
                        <label class="col-sm-12 control-label">Calculate Window Difference For Instruments Based On</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        {html_options options=$WindowDifferenceOptions name="WindowDifference" selected="battery" class="form-control cohortWindowDifference"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                        <label class="col-sm-12 control-label">Recruitment Target</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        <input class="form-control cohortRecruitmentTarget" name="target" placeholder="Please add a recruitment target here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button id="savecohortnew" class="btn btn-primary savecohort">Save</button>
                        <button class="btn btn-default" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</div>
