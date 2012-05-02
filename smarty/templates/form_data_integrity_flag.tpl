{**
Todo:
1) Allow the drop down to be set to the previously selected content
ISSUES: it fails for hubble 7.5month...
**}
{literal}

<script language="javascript" type="text/javascript">


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return unescape(pair[1]);
		}
	}
}




function changefieldOptions() {
	changeFieldNames();
	changeVisitLabels();
}


function changeFieldNames() {
	//get the value for the visit selected
	var instrument_dropdown = document.getElementById('instrument');
	var field_name_dropdown = document.getElementById('FieldName');
	var field_name_value = field_name_dropdown.value;
	request = getQueryVariable("FieldName");
	$.get("GetFields.php?instrument=" + instrument_dropdown.value ,
	function(data){
		fields = data.split("\n");
		field_name_dropdown.options.length = 0;
		var i, numFields = fields.length, val, selected = "";
		for (i=0; i<numFields;i++){
			val = fields[i];
			if(val !=''){
				field_name_dropdown.options[i] = new Option(val,val);
				if (val==request){
					field_name_dropdown.options[i].selected = "selected";
				}
			}
		}
	});
}


function changeVisitLabels() {
	//get the value for the visit selected
	var instrument_dropdown = document.getElementById('instrument');
	var visit_label_dropdown = document.getElementById('visit_label');
	var visit_label_value = visit_label_dropdown.value;
	request = getQueryVariable("visit_label");
	$.get("GetVisits.php?instrument=" + instrument_dropdown.value ,
	function(data){
		visits = data.split("\n");
		visit_label_dropdown.options.length = 0;
		var i, numVisits = visits.length, val, selected = "";
		for (i=0; i<numVisits;i++){
			val = visits[i];
			if(val !=''){
				visit_label_dropdown.options[i] = new Option(val,val);
				if (val==request){
					visit_label_dropdown.options[i].selected = "selected";
				}
			}
		}
		//jQuery('#visits').change();
	});
	//alert(request);
}

//runs the function when the page is loaded..
$(function(){
	changefieldOptions();
});
</script>
{/literal}


<form>
<table border="0" valign="top" class="std">
<tr>
<th colspan="4">Selection Filter</th>
</tr>
<tr>
{php}
	$selected =  $_REQUEST['instrument'];
	$this->assign('instrument_selected',$selected);
{/php}
<td>
Instruments
</td>
<td>
	<div>
		<select name="instrument" onchange="changefieldOptions()" id="instrument">
			{foreach from=$instrument item=name key=val}
				{if $name eq $instrument_selected}
					<option value="{$name}" selected="selected"> {$name}</option>
				{else}
					<option value="{$name}"> {$name}</option>
				{/if}
			{/foreach}
		</select>
	</div>
</td>
</tr>



<tr>
	<td>
		Visit Labels:
	</td>
	<td>
		<div>
			<select name="visit_label" id="visit_label">
			</select>
		</div>

	</td>
	
</tr>

<tr>
	<td>
		Fields:
	</td>
	<td>
		<div>
			<select name="FieldName" id="FieldName">
			
			</select>
		</div>
	</td>
</tr>

<tr>
<td>{$form.initial_check.label}</td>
<td>{$form.initial_check.html}</td>
</tr>


{***********************name hidden************}
<td nowrap="nowrap" valign="top">{$elements_array[$element][$visit_label].name}</td>
<tr>
<td>{$form.initial_check.label}</td>
<td>{$form.initial_check.html}</td>
</tr>


<tr>

<td>{$form.test_name.label}</td>
<td>{$form.test_name.html}</td>
</tr>


<tr>
<td>{$form.feedback_status.label}</td>
<td>{$form.feedback_status.html}</td>
</tr>

<tr>
<td>{$form.completion_status.label}</td>
<td>{$form.completion_status.html}</td>
</tr>

<tr>
<td>{$form.sent_to_dcc_status.label}</td>
<td>{$form.sent_to_dcc_status.html}</td>
</tr>

<tr>
<td>Actions</td>
<td colspan="3">
<input type="submit" name="filter" value="Show Data" id="filter" class="button"/>

</td>
</tr>
</table>
<input type="hidden" name="test_name" value="data_integrity_flag" />

</form>
<br>

<table border="1" valign="top" class="std">
<tr>
<td> Current Data_entry Completion Percentage (for <b>{$visit_label}</b> and instrument: <b>{$test_name}</b>)&nbsp&nbsp  </td>
<td> &nbsp&nbsp&nbsp{$percent_completed}%</td>
</tr>




</table>
<form method="post" name="data_integrity_flag" id="data_integrity_flag">
<table class="fancytable" border="0">
{if $form.total.html}
<tr class="nohover">
<td colspan="11" align="right" style="border: none;" class="nohover">Showing <em>{$form.total.html}</em> results.</td>
</tr>
{/if}
{foreach from=$form.errors item=error}
<tr>
<td nowrap="nowrap" colspan="11" class="error">{$error}</td>
</tr>
{/foreach}
<tr>
<th>Instrument</th>
<th>Visit label</th>
<th>Names (Instrument_Fieldname)</th>
<th>Check Stage</th>
<th>Date of Data Cleaning/Extraction</th>
<th>Date of Flag Change at save</th>
<th>Data Completion percentage at save</th>
<th>Comment</th>
<th>Link to BVL feedback</th>
<th> Feedback Status</th>
<th> Conflict</th>
<th> Incomplete candidates</th>
</tr>

{assign var="show" value="TRUE"}
{*$elements_array|@print_r*} 
{foreach from=$elements_list_names item=element name = element_name}
{assign var="visit_label" value=$Visit_label_list[$smarty.foreach.element_name.index]}
<tr>
{***********************instrument name************}
<td nowrap="nowrap" valign="top">{$elements_array[$element][$visit_label].sourcefrom}</td>

{***********************Visit Label************}
<td nowrap="nowrap" valign="top">{$visit_label}</td>

<!---Create a hidden field to keep track of the visit_labels--->
<!--input type="hidden" name="{$elements_array[$element][$visit_label].visit_label}" value ="{$visit_label}"/-->


{***********************field name************}
{assign var="source_field" value=$elements_array[$element][$visit_label].sourcefield}
<td nowrap="nowrap" valign="top"> <a href="get_csv.php?instrument={$elements_array[$element][$visit_label].sourcefrom}&sourcefield={$elements_array[$element][$visit_label].sourcefield}&completion_status={$completion_status}&sent_to_dcc_status={$sent_to_dcc_status}" target="_blank"> <span title = '{$elements_array[$element][$visit_label].Description}'> {$element}</span></a></td>

{***********************initial_check************}
{assign var="initial_check" value=$elements_array[$element][$visit_label].initial_check}
<td nowrap="nowrap" valign="top">{$form.$initial_check.html}</td>

{***********************Date of Data Cleaning/Extraction************}
{assign var="date" value=$elements_array[$element][$visit_label].date}
<td nowrap="nowrap" valign="top">{$form.$date.html}</td>


{***********************Date of Flag Change************}
{assign var="Last_access" value=$elements_array[$element][$visit_label].Last_access}
<td nowrap="nowrap" valign="top"><input type="hidden" name="{$Last_access}" value ="{$form.$Last_access.html}"/>{$form.$Last_access.html}</td>


{***********************Visit_label************}
{**assign var="the_visit_label" value=$elements_array[$element][$visit_label].fieldname_visit_label**}
<!--td nowrap="nowrap" valign="top"> <input type="hidden" name="{$the_visit_label}" value ="{$form.$the_visit_label.html}"/>asfsfsfs{$elements_array[$element][$visit_label].fieldname_visit_label} </td-->


{***********************percent_completed************}
{assign var="percent_completed" value=$elements_array[$element][$visit_label].percent_completed}
<td nowrap="nowrap" valign="top"><input type="hidden" name="{$percent_completed}" value="{$form.$percent_completed.html}" />{$form.$percent_completed.html}</td>

{***********************Comments************}
{assign var="Comment" value=$elements_array[$element][$visit_label].Comment}
<td nowrap="nowrap" valign="top">{$form.$Comment.html}</td>

{***********************Feedbacklist************}
{if isset($elements_array[$element][$visit_label].FeedbackList) }
	<td nowrap="nowrap" width="40" valign="top">
		{foreach from=$elements_array[$element][$visit_label].FeedbackList key=feedback item=FeedbackList}
			 <a href="#" onClick="javascript:window.open('feedback_bvl_popup.php?test_name={$FeedbackList.test_name}&candID={$FeedbackList.CandID}&sessionID={$FeedbackList.session_id}&commentID={$FeedbackList.commentid}#{$FeedbackList.feedbackid}','bvl_feedback','width=900,height=500,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes')">{$FeedbackList.PSCID}_{$FeedbackList.visit_label}</a>
		{/foreach}
	</td>
	{**Currently the color option only works if the status is created as a separate cell (tr or td)...otherwise ...the color will be unreadable
	So for now it is commented out...
	
	**}
	<td nowrap="nowrap" width="40" valign="top" bgcolor="{$thread_list_data[thread].QC_color}">

			{foreach from=$elements_array[$element][$visit_label].FeedbackList key=feedback item=FeedbackList}
				 <!--font solid color="{$FeedbackList.QC_color}"><b> {$FeedbackList.Status}</b> </font-->
				 <!--font solid color="{$FeedbackList.QC_color}"><b> {$FeedbackList.Status}</b> </font-->
				 {$FeedbackList.Status}
			{/foreach}
	</td>

{else}

	<td class="error" nowrap="nowrap" valign="top"> N/A </td>
	<td class="error" nowrap="nowrap" valign="top"> N/A</td>
{/if}

{***********************Conflicts************}
<td nowrap="nowrap" valign="top">
{foreach from=$Conflicts item=conflict}
{if ($conflict.FieldName eq  $elements_array[$element][$visit_label].sourcefield) and $conflict.visit_label eq $visit_label}
<a href="main.php?Question={$conflict.FieldName}&Instruments={$conflict.test_name_display}&Visits={$conflict.visit_label}&site=all&test_name=conflicts_resolve" target="_blank">{$conflict.PSCID}_{$conflict.visit_label}<BR></a>
{/if}
{/foreach}
</td>

{***********************INCOMPLETE CANDIDATES************}

{if $show=='TRUE'}
<td valign="top" width="23%" nowrap="nowrap" rowspan="{$form.total.html}">
{foreach from=$Incomplete_candidates item=incomp_cands}
<a href="main.php?test_name={$incomp_cands.test_name}&candID={$incomp_cands.candid}&sessionID={$incomp_cands.ID}&commentID={$incomp_cands.commentid}" target="_blank">
{if strpos($incomp_cands.commentid, "DDE") !== false}
DDE_{$incomp_cands.PSCID}_{$incomp_cands.visit_label} <BR> {else} {$incomp_cands.PSCID}_{$incomp_cands.visit_label} <BR>{/if}
</a>
{/foreach}
	{assign var="show" value="FALSE"}
		</td>
	{/if}
{/foreach}
</tr>
<tr>
<td nowrap="nowrap" colspan="11">
<input class="button" style="width: 100px" name="fire_away" value="Save" type="submit" />
</td>
</tr>
</table>
</form>

