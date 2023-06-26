<script language="javascript" src="{$baseurl|default}/configuration/js/visit.js">
</script>
<p>Use this page to manage the configuration of existing visits, or to add a new one.</p>

<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    <li class="active"><a id="#visitnew{$VisitID|default}" href="#visitnew" data-toggle="tab" class="active">New VisitID</a></li>
    {foreach from=$visits key=VisitID item=visit name=configContent}
    <li><a id="#visit{$VisitID}" href="#visit{$VisitID}" data-toggle="tab">{$visit.VisitName}</a></li>
    {/foreach}
</ul>
</div>

<div class="col-md-7">
    <div class="tab-content">
    {foreach from=$visits key=VisitID item=visit name=tabContent}
    <div id="visit{$VisitID}" class="tab-pane">
        <h2>{$visit.VisitName} (VisitID: {$VisitID})</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$VisitID}">
            <fieldset>
                <input type="hidden" name="VisitID" value="{$VisitID}" class="VisitID">
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the visit'}">
                            <label class="col-sm-12 control-label">Visit Name</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <input class="form-control visitName" name="Name" value="{$visit.VisitName}">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Short name of the visit (4 characters or less)'}">
                            <label class="col-sm-12 control-label">Alias</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <input class="form-control visitAlias" name="Alias" value="{$visit.Alias}">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                            <label class="col-sm-12 control-label">Recruitment Target</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <input class="form-control visitrecruitmentTarget" name="recruitmentTarget" value="{$visit.recruitmentTarget}">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'These subvisits will be automatically displayed for any candidate affiliated with this visit at timepoint creation.'}">
                            <label class="col-sm-12 control-label">Affiliated Subvisits</label>
                        </div>
                        <div class="col-sm-12 col-md-9">
                            <select name="SubvisitIDs" class="form-control visitSubvisitIDs" multiple>
                              {foreach from=$subvisits key=SubvisitID item=subvisit}
                                  {if $subvisit|in_array:$visit.visitSubvisits}
                                      <option value="{$SubvisitID}" selected>{$subvisit}</option>
                                  {else}
                                      <option value="{$SubvisitID}">{$subvisit}</option>
                                  {/if}
                              {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-3 col-sm-9">
                            <button id="savevisit{$VisitID}" class="btn btn-primary savevisit submit-area">Save</button>
                            <button class="btn btn-default submit-area" type="reset">Reset</button>
                            <label class="saveStatus"></label>
                        </div>
                    </div>

            </fieldset>
        </form>
    </div>
    {/foreach}
    <div id="visitnew" class="tab-pane active">
        <h2>New Visit</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$VisitID}">
            <fieldset>
                <input type="hidden" name="VisitID" value="new" class="VisitID">
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Full descriptive title of the visit'}">
                        <label class="col-sm-12 control-label">Visit Name</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control visitName" name="Name" placeholder="Please add a visit title here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'Short name of the visit (4 characters or less)'}">
                        <label class="col-sm-12 control-label">Alias</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <input class="form-control visitAlias" name="Alias" placeholder="Please add an alias here" value="">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'The target number will be used to generate the recruitment progress bar on the dashboard'}">
                        <label class="col-sm-12 control-label">Recruitment Target</label>
                    </div>
                    <div class="col-sm-12 col-md-9">
			            <input class="form-control visitrecruitmentTarget" name="recruitmentTarget" placeholder="Please add a recruitment target here" value="">
                    </div>
                </div>
                <div>
                  <div class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="right" title="{'These subvisits will be automatically displayed for any candidate affiliated with this visit at timepoint creation.'}">
                    <label class="col-sm-12 control-label">Affiliated Subvisits</label>
                  </div>
                  <div class="col-sm-12 col-md-9">
                    <div class="col-sm-12 col-md-9">
                      <select name="SubvisitIDs" class="form-control visitSubvisitIDs" multiple>
                        {foreach from=$subvisits key=SubvisitID item=subvisit}
                            <option value="{$SubvisitID}">{$subvisit}</option>
                        {/foreach}
                      </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button id="savevisitnew" class="btn btn-primary savevisit submit-area">Save</button>
                        <button class="btn btn-default submit-area" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>

            </fieldset>
        </form>
    </div>
</div>
