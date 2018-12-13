<script language="javascript" src="{$baseurl}/configuration/js/subproject.js">

</script>
<p>Use this page to manage the configuration of existing subprojects, or to add a new one.</p>


<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    {foreach from=$subprojects key=subprojectID item=subproject name=configContent}
    <li {if $smarty.foreach.configContent.first}class="active"{/if}><a href="#subproject{$subprojectID}" data-toggle="tab" {if $smarty.foreach.configContent.first}class="active"{/if}>{$subproject.title}</a></li>
    {/foreach}
    <li {if count($subprojects) == 0}class="active"{/if}><a href="#subprojectnew" data-toggle="tab" {if count($subprojects) == 0}class="active"{/if}>New SubprojectID</a></li>
</ul>
</div>

<div class="col-md-7">
    <div class="tab-content">
    {foreach from=$subprojects key=subprojectID item=subproject name=tabContent}
    <div id="subproject{$subprojectID}" class="tab-pane {if $smarty.foreach.tabContent.first} active{/if}">
        <h2>{$subproject.title} (SubprojectID: {$subprojectID})</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$subprojectID}">
            <fieldset>
                <input type="hidden" name="subprojectID" value="{$subprojectID}" class="subprojectID">
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the subproject'}">
                        <label class="col-sm-12 control-label">Subproject Name</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control subprojectTitle" name="title" value="{$subproject.title}">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{"Include field for EDC (Expected Date of Confinement) in Candidate Parameters to record subject's due date if applicable"}">
                        <label class="col-sm-12 control-label">Use EDC</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        {html_options options=$useEDCOptions name="useEDC" selected=$subproject.options.useEDC class="form-control subprojectuseEDC"}
                    </div>
                </div>
                <div class="form-group">
		            <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Choose a method by which Window Difference will be calculated. It will be displayed in days at the head of every instrument form'}">
                        <label class="col-sm-12 control-label">Calculate Window Difference For Instruments Based On</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        {html_options options=$WindowDifferenceOptions name="WindowDifference" selected=$subproject.options.WindowDifference class="form-control subprojectWindowDifference"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                        <label class="col-sm-12 control-label">Recruitment Target</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control subprojectRecruitmentTarget" name="target" placeholder="Please add a recruitment target here" value="{$subproject.RecruitmentTarget}">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button id="savesubproject{$subprojectID}" class="btn btn-primary savesubproject">Save</button>
                        <button class="btn btn-default" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    {/foreach}
    <div id="subprojectnew" class="tab-pane {if count($subprojects) == 0} active{/if}">
        <h2>New Subproject</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$subprojectID}">
            <fieldset>
                <input type="hidden" name="subprojectID" value="new" class="subprojectID">
                <div class="form-group">
                    <div class="alert alert-warning">
                          <strong>Note</strong> After adding a new subproject, Visit labels for this subproject can only be created by editing the configuration file, "config.xml". Please contact your administrator if you need more information.
                    </div>
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the subproject'}">
                        <label class="col-sm-12 control-label">Subproject Name</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        <input class="form-control subprojectTitle" name="title" placeholder="Please add a subproject title here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{"Include field for EDC (Expected Date of Confinement) in Candidate Parameters to record subject's due date if applicable"}">
                        <label class="col-sm-12 control-label">Use EDC</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        {html_options options=$useEDCOptions name="useEDC" selected="Yes" class="form-control subprojectuseEDC"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Choose a method by which Window Difference will be calculated. It will be displayed in days at the head of every instrument form'}">
                        <label class="col-sm-12 control-label">Calculate Window Difference For Instruments Based On</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        {html_options options=$WindowDifferenceOptions name="WindowDifference" selected="battery" class="form-control subprojectWindowDifference"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                        <label class="col-sm-12 control-label">Recruitment Target</label>
                    </div>
                    <div class="col-sm-12 col-md-7">
                        <input class="form-control subprojectRecruitmentTarget" name="target" placeholder="Please add a recruitment target here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button id="savesubprojectnew" class="btn btn-primary savesubproject">Save</button>
                        <button class="btn btn-default" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</div>
