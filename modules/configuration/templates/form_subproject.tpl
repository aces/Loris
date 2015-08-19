<script language="javascript" src="GetJS.php?Module=configuration&file=subproject.js">

</script>
<p>Use this page to manage the configuration of existing subprojects, or to add a new one.</p>


<div class="col-md-3">
<ul class="nav nav-pills nav-stacked" role="tablist" data-tabs="tabs">
    {foreach from=$subprojects key=subprojectID item=subproject name=configContent}
    <li {if $smarty.foreach.configContent.first}class="active"{/if}><a href="#subproject{$subprojectID}" data-toggle="tab" {if $smarty.foreach.configContent.first}class="active"{/if}>{$subproject.title}</a></li>
    {/foreach}
    <li {if $smarty.foreach.configContent.first}class="active"{/if}><a href="#subprojectnew" data-toggle="tab" {if $smarty.foreach.configContent.first}class="active"{/if}>New SubprojectID</a></li>
</ul>
</div>

<div class="col-md-9">
    <div class="tab-content">
    {foreach from=$subprojects key=subprojectID item=subproject name=tabContent}
    <div id="subproject{$subprojectID}" class="tab-pane {if $smarty.foreach.tabContent.first} active{/if}">
        <h2>{$subproject.title} (SubprojectID: {$subprojectID})</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$subprojectID}">
            <fieldset>
                <input type="hidden" name="subprojectID" value="{$subprojectID}" class="subprojectID">
                <div class="form-group">
                    <label class="col-sm-12 col-md-4">Subproject Title</label>
                    <div class="col-sm-12 col-md-8">
                        <input class="form-control subprojectTitle" name="title" value="{$subproject.title}">
                    </div>
                </div>
                <div class="form-group">

                    <label class="col-sm-12 col-md-4">Use <abbr title="Expect Date of Confinement (ie. baby's due date)">EDC</abbr></label>
                    <div class="col-sm-12 col-md-8">
                        {html_options options=$useEDCOptions name="useEDC" selected=$subproject.options.useEDC class="form-control subprojectuseEDC"}
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-12 col-md-4">Calculate Window Difference for instruments based on:</label>
                    <div class="col-sm-12 col-md-8">
                        {html_options options=$WindowDifferenceOptions name="WindowDifference" selected=$subproject.options.WindowDifference class="form-control subprojectWindowDifference"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-4 col-sm-8 submit-area">
                        <button id="savesubproject{$subprojectID}" class="btn btn-primary savesubproject">Save</button>
                        <button class="btn btn-default" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>

            </fieldset>
        </form>
    </div>
    {/foreach}
    <div id="subprojectnew" class="tab-pane {if $smarty.foreach.tabContent.first} active{/if}">
        <h2>New Subproject</h2>
        <br>
        <form class="form-horizontal" role="form" method="post" id="form{$subprojectID}">
            <fieldset>
                <input type="hidden" name="subprojectID" value="new" class="subprojectID">
                <div class="form-group">
                    <label class="col-sm-12 col-md-4">Subproject Title</label>
                    <div class="col-sm-12 col-md-8">
                        <input class="form-control subprojectTitle" name="title" placeholder="Subroject Title goes here" value="">
                    </div>
                </div>
                <div class="form-group">

                    <label class="col-sm-12 col-md-4">Use <abbr title="Expect Date of Confinement (ie. baby's due date)">EDC</abbr></label>
                    <div class="col-sm-12 col-md-8">
                        {html_options options=$useEDCOptions name="useEDC" selected="Yes" class="form-control subprojectuseEDC"}
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-12 col-md-4">Calculate Window Difference for instruments based on:</label>
                    <div class="col-sm-12 col-md-8">
                        {html_options options=$WindowDifferenceOptions name="WindowDifference" selected="battery" class="form-control subprojectWindowDifference"}
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-4 col-sm-8 submit-area">
                        <button id="savesubprojectnew" class="btn btn-primary savesubproject">Save</button>
                        <button class="btn btn-default" type="reset">Reset</button>
                        <label class="saveStatus"></label>
                    </div>
                </div>

            </fieldset>
        </form>
    </div>
</div>
