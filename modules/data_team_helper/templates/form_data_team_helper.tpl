<script type ="text/javascript" src ="js/jquery/jquery.autocomplete.js"></script>
<link rel="stylesheet" href="css/auto-complete.css">
<!-- code for the jsx transformer -->
<script src="https://fb.me/JSXTransformer-0.13.3.js"></script>

<div class="row">
	<div class="col-sm-8 col-md-6">
		<div class="panel panel-primary">
			<div class="panel-heading" onclick="hideFilter();">
				Selection Filter
			</div>
			<div class="panel-body" id="panel-body">
				<form method="post">
					<div class="row">
						<div class="form-group col-xs-12">
							<label class="col-sm-4">Visit_labels</label>
							<div class="col-sm-8">
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
					</div>
					<div class="row">
						<div class="form-group col-xs-12">
							<label class="col-sm-4">Instruments:</label>
							<div class="col-sm-8">
								<select name="instrument" id="instrument" class="form-control input-sm">
									<option value="{$instrumentvalue}" selected="selected">{$instrumentvalue}></option>
								</select>
							</div>
						</div>
					</div>
					<div class ="row">
						<div class ="form-group col-xs-12">
							<label class ="col-sm-4">CANDID:</label>
							<div class="col-sm-8">
								<input name = "candidate" type="text" id="autocomplete-ajax" class="form-control form-autocomplete"/>
								<input type="text" id="autocomplete-ajax-x" class="form-control form-autocomplete-hint">													
							</div>							
						</div>					
					</div>
					<div class="row">
						<div id="selction-ajax" class="col-sm-8 col-md-offset-4"></div>
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
						<div class="form-group col-xs-12">
							<div class="col-sm-8 col-sm-offset-4">
								<input type="submit" name="filter" value="Show Data" id="filter" class="btn btn-sm btn-primary col-xs-12"/>
							</div>
						</div>
					</div>
					<input type="hidden" name="test_name" value="data_team_helper" />
				</form>
			</div>
		</div>
	</div>
</div>


 <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#incomplete" aria-controls="incomplete" role="tab" data-toggle="tab">Incomplete Candidates</a></li>
    <li role="presentation"><a href="#conflicts" aria-controls="conflicts" role="tab" data-toggle="tab">Data Conflicts</a></li>
    <li role="presentation"><a href="#feedback" aria-controls="feedback" role="tab" data-toggle="tab">Behavioural Feedback</a></li>    
  </ul>


  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="incomplete"></div>
    <div role="tabpanel" class="tab-pane" id="conflicts"></div>
    <div role="tabpanel" class="tab-pane" id="feedback"></div>    
  </div>


<script type="text/jsx" src="js/jsx/incompletes_candidates_panel.jsx"></script>

<script type="text/jsx">
var incomplete = {$Incomplete_candidates|@json_encode};
incomplete = JSON.parse(incomplete);

var header = ["Visit", "CandID", "Instrument"];

var CandiPanel = IncompleteCandidatesPanel({
	title: "Incomplete Candidates",
	header: ["Visit", "CandID", "Instrument"],
	incomplete_candidates: incomplete
});

var conflicts = {$Conflicts|@json_encode};
conflicts = JSON.parse(conflicts);

var ConflictsPanel = InstrumentConflictsPanel({
	title: "Data Entry Conflicts",
	header: ["Visit", "CandID", "Instrument", "Field Name"],
	conflicts: conflicts
}); 

var feedback = {$Bvl_Feedback|@json_encode};
feedback = JSON.parse(feedback);

var FeedbackTab = BehaviouralFeedbackTab({
	title: "Behvarioural Feedback",
	header:["CandID", "Feedback Level", "Field Name"],
	feedback: feedback
});

React.render(CandiPanel, document.getElementById("incomplete"));

React.render(ConflictsPanel, document.getElementById("conflicts"));

React.render(FeedbackTab, document.getElementById("feedback"));
  
</script>
