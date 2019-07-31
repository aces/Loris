<script language="javascript" src="{$baseurl}/configuration/js/project.js">
</script>
<p>Use this page to manage the configuration of existing projects, or to add a new one.</p>
<p>To configure study subprojects <a href="{$baseurl}/configuration/subproject/">click here</a>.</p>

<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    {foreach from=$projects key=ProjectID item=project name=configContent}
    <li {if $smarty.foreach.configContent.first}class="active"{/if}><a href="#project{$ProjectID}" data-toggle="tab" {if $smarty.foreach.configContent.first}class="active"{/if}>{$project.Name}</a></li>
    {/foreach}
    <li {if count($projects) == 0}class="active"{/if}><a href="#projectnew" data-toggle="tab" {if count($projects) == 0}class="active"{/if}>New ProjectID</a></li>
</ul>
</div>

<div class="col-md-7">
    <div class="tab-content">
    {foreach from=$projects key=ProjectID item=project name=tabContent}
    <div id="project{$ProjectID}" class="tab-pane {if $smarty.foreach.tabContent.first} active{/if}">
        <h2>{$project.Name} (ProjectID: {$ProjectID})</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$ProjectID}">
            <fieldset>
                <input type="hidden" name="ProjectID" value="{$ProjectID}" class="ProjectID">
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the project'}">
                            <label class="col-sm-12 control-label">Project Name</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <input class="form-control projectName" name="Name" value="{$project.Name}">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                            <label class="col-sm-12 control-label">Recruitment Target</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <input class="form-control projectrecruitmentTarget" name="recruitmentTarget" value="{$project.recruitmentTarget}">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'These subprojects will be automatically displayed for any candidate affiliated with this project at timepoint creation.'}">
                            <label class="col-sm-12 control-label">Affiliated Subprojects</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <select name="SubprojectIDs" class="form-control projectSubprojectIDs" multiple>
                              {foreach from=$subprojects key=SubprojectID item=subproject}
                                  {if $subproject|in_array:$project.projectSubprojects}
                                      <option value="{$SubprojectID}" selected>{$subproject}</option>
                                  {else}
                                      <option value="{$SubprojectID}">{$subproject}</option>
                                  {/if}
                              {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-3 col-sm-9">
                            <button id="saveproject{$ProjectID}" class="btn btn-primary saveproject submit-area">Save</button>
                            <button class="btn btn-default submit-area" type="reset">Reset</button>
                            <label class="saveStatus"></label>
                        </div>
                    </div>

            </fieldset>
        </form>
    </div>
    {/foreach}
    <div id="projectnew" class="tab-pane {if count($projects) == 0}{count($projects)} active{/if}">
        <h2>New Project</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$ProjectID}">
            <fieldset>
                <input type="hidden" name="ProjectID" value="new" class="ProjectID">
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the project'}">
                        <label class="col-sm-12 control-label">Project Name</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control projectName" name="Name" placeholder="Please add a project title here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                        <label class="col-sm-12 control-label">Recruitment Target</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
			            <input class="form-control projectrecruitmentTarget" name="recruitmentTarget" placeholder="Please add a recruitment target here" value="">
                    </div>
                </div>
                <div>
                  <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'These subprojects will be automatically displayed for any candidate affiliated with this project at timepoint creation.'}">
                    <label class="col-sm-12 control-label">Affiliated Subprojects</label>
                  </div>
                  <div class="col-sm-12 col-md-9">
                    <div class="col-sm-12 col-md-9">
                      <select name="SubprojectIDs" class="form-control projectSubprojectIDs" multiple>
                        {foreach from=$subprojects key=SubprojectID item=subproject}
                            <option value="{$SubprojectID}">{$subproject}</option>
                        {/foreach}
                      </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button id="saveprojectnew" class="btn btn-primary saveproject submit-area">Save</button>
                        <button class="btn btn-default submit-area" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>

            </fieldset>
        </form>
    </div>
</div>
