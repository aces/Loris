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

<br>
{if $test_name}
	<table border="1" valign="top" class="std">
		<tr>
			<td> Current Single Data_entry Completion Percentage (for <b>{$visit_label}</b> and instrument: <b>{$test_name}</b> {if $candidate}and candID: <b>{$candidate}</b> {/if})&nbsp&nbsp  </td>
			<td> &nbsp&nbsp&nbsp{$percent_completed}%</td>
		</tr>
		
	</table>
{/if}
<table>
	<tr>
 		<td>
 			<p style="font-family:arial;color:red;font-size:13px;">Currently only Behavioural Feedbacks tied to fields are shown</p>
	</tr>
</table>
<div id="myDiv"></div>
<script type="text/jsx" src="js/jsx/incompletes_candidates_panel.jsx"></script>

<script type="text/jsx">
var incomplete = {$Incomplete_candidates|@json_encode};
incomplete = JSON.parse(incomplete);

/* var CandiPanel = IncompleteCandidatesPanel({
   RowsPerPage : 5, 
   incomplete_candidates: incomplete	  	  
   });

   React.render(CandiPanel, document.getElementById("myDiv")); */

var header = ["hi, bye, bye"];

var CandiPanel = IncompleteCandidatesPanel({
	header: header,
	incomplete_candidates: incomplete
});

React.render(CandiPanel, document.getElementById("myDiv"));
  
  </script>
  <div id="otherDiv"></div>
