<script type ="text/javascript" src ="{$baseurl}/js/jquery/jquery.autocomplete.js"></script>
<link rel="stylesheet" href="{$baseurl}/css/auto-complete.css">
<link rel="stylesheet" href="{$baseurl}/css/c3.css">

<script src="{$baseurl}/js/d3.min.js" charset="utf-8"></script>
<script src="{$baseurl}/js/c3.min.js"></script>

<div class="row">
	<div class="col-sm-12 col-md-7">
		<div class="panel panel-primary">
			<div class="panel-heading">
				Selection Filter
			</div>
			<div class="panel-body" id="panel-body">
				<form method="post">
					<div class="row">
						<div class="form-group col-sm-6">
							<label class="col-sm-12 col-md-4">Visit Labels:</label>
							<div class="col-sm-12 col-md-8">
								<select name="visit_label" onchange="changefieldOptions()" id="visit_label" class="form-control input-sm">
									<option value="All Visits" selected="selected">All Visits</option>
									{foreach from=$visitLabels item=name key=val}
										{if $name eq $visit_label}
											<option value="{$name}" selected="selected"> {$name}</option>
										{else}
											<option value="{$name}"> {$name}</option>
										{/if}
									{/foreach}
								</select>
							</div>
						</div>

						<div class="form-group col-sm-6">
							<label class="col-sm-12 col-md-4">Instruments:</label>
							<div class="col-sm-12 col-md-8">
								<select name="instrument" id="instrument" class="form-control input-sm">
									<option value="{$instrumentvalue}" selected="selected">{$instrumentvalue}></option>
								</select>
							</div>
						</div>
					</div>
					<div class ="row">
						<div class ="form-group col-sm-6">
							<label class ="col-sm-12 col-md-4">DCCID:</label>
							<div class="col-sm-12 col-md-8">
								<input name = "candidate" value="{$candID}" type="text" id="autocomplete-ajax" class="form-control"/>
							</div>
						</div>
						<div class ="form-group col-sm-6">
							<label class ="col-sm-12 col-md-4">PSCID:</label>
							<div class="col-sm-12 col-md-8">
								<input name = "PSCID" value="{$PSCID}" type="text" class="form-control"/>
							</div>
						</div>
					</div>
					<div class ="row">
						<div class ="form-group col-sm-6">
							<label class ="col-sm-12 col-md-4">Site:</label>
							<div class="col-sm-12 col-md-8">
								<select name="site" id="site" class="form-control input-sm">
                                    {foreach from=$siteList item=val key=name}
                                        {if $name eq $site}
											<option value="{$name}" selected="selected"> {$val}</option>
                                        {else}
											<option value="{$name}"> {$val}</option>
                                        {/if}
                                    {/foreach}
								</select>
							</div>
						</div>
						<div class ="form-group col-sm-6">
							<label class ="col-sm-12 col-md-4">Project:</label>
							<div class="col-sm-12 col-md-8">
								<select name="project" id="project" class="form-control input-sm">
									<option value="All Projects" selected="selected">All Projects</option>
                                    {foreach from=$projectList item=val key=name}
                                        {if $name eq $project}
											<option value="{$name}" selected="selected"> {$val}</option>
                                        {else}
											<option value="{$name}"> {$val}</option>
                                        {/if}
                                    {/foreach}
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div id="selction-ajax" class="col-sm-12 col-md-offset-2"></div>
					</div>
					<div class="row">
						<div class="form-group col-xs-12">
							<label class="col-sm-4">{$form.users.label}</label>
							<div class="col-sm-8">
								{$form.users.html}
							</div>
						</div>
					</div>
					<div class="row">
					  <div class="col-md-6 col-md-offset-6">
					    <div class="col-sm-6 col-md-offset-6">
					      <input type="submit" name="filter" value="Show Data" id="filter" class="btn btn-sm btn-primary col-xs-12"/>
					    </div>

							</div>
					</div>
					<input type="hidden" name="test_name" value="behavioural_qc" />
				</form>
			</div>
		</div>
	</div>
	<div id="graphics">

	</div>
</div>


 <ul class="nav nav-tabs" role="tablist">
   <li role="presentation" class="active"><a href="#incomplete" aria-controls="incomplete" role="tab" data-toggle="tab">Incomplete Forms <span class="badge">{$Incomplete_candidates_length}</span></a></li>
   <li role="presentation"><a href="#conflicts" aria-controls="conflicts" role="tab" data-toggle="tab">Data Conflicts <span class="badge">{$Conflicts_length}</span></a></li>
   <li role="presentation"><a href="#feedback" aria-controls="feedback" role="tab" data-toggle="tab">Behavioural Feedback <span class="badge">{$Bvl_Feedback_length}</span></a></li>
  </ul>


  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="incomplete"></div>
    <div role="tabpanel" class="tab-pane" id="conflicts"></div>
    <div role="tabpanel" class="tab-pane" id="feedback"></div>
  </div>


<script type="text/javascript" src="{$baseurl}/behavioural_qc/js/behavioural_qc_module.js"></script>

<script type="text/javascript">
var incomplete = {$Incomplete_candidates|@json_encode};
incomplete = JSON.parse(incomplete);

var CandiPanel = IncompleteCandidatesPanel({
	title: "Incomplete Forms",
	header: ["Visit", "DCCID", "PSCID", "Instrument"],
	incomplete_candidates: incomplete,
    BaseURL : loris.BaseURL
});

var conflicts = {$Conflicts|@json_encode};
conflicts = JSON.parse(conflicts);

var ConflictsPanel = InstrumentConflictsPanel({
	title: "Data Entry Conflicts",
	header: ["Visit", "DCCID", "PSCID", "Instrument", "Field Name"],
	conflicts: conflicts,
    BaseURL : loris.BaseURL
});

var feedback = {$Bvl_Feedback|@json_encode};
feedback = JSON.parse(feedback);

var FeedbackTab = BehaviouralFeedbackTab({
	title: "Behvarioural Feedback",
	header:["DCCID", "PSCID", "Feedback Level", "Field Name"],
	feedback: feedback,
    BaseURL : loris.BaseURL
});

var percentCompleted = {$percent_completed|@json_encode};
var pscid = {$candidate|@json_encode};
var visit = {$visit_label|@json_encode};
var instrument = {$test_name|@json_encode};
var site = $("#site option:selected").text();
var project =$("#project option:selected").text();

var BeahaviouralQCGraphics = GraphicsPanel({
	percentCompleted: percentCompleted,
    pscid: pscid,
    visit: visit,
    instrument: instrument,
	site: site,
	project: project
});

ReactDOM.render(CandiPanel, document.getElementById("incomplete"));

ReactDOM.render(ConflictsPanel, document.getElementById("conflicts"));

ReactDOM.render(FeedbackTab, document.getElementById("feedback"));

ReactDOM.render(BeahaviouralQCGraphics, document.getElementById("graphics"));

</script>
