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
                                    <option></option>
                                    <option value="{$instrumentvalue}" selected="selected">{$instrumentvalue}</option>
                                </select>
                            </div>
                        </div>
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
            <td> Current Single Data_entry Completion Percentage (for <b>{$visit_label}</b> and instrument: <b>{$test_name}</b>)&nbsp&nbsp  </td>
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


<form>
<table class="table table-primary table-bordered dynamictable" border="0">
    {if $form.total.html}
        <tr class="nohover">
            <td colspan="7" align="right" style="border: none;" class="nohover">Showing <em>{$form.total.html}</em> results.</td>
        </tr>
    {/if}
    {foreach from=$form.errors item=error}
        <tr>
            <td nowrap="nowrap" colspan="7" class="error">{$error}</td>
        </tr>
    {/foreach}
    <tr class="info">
        <th>Visit label</th>
        <th>Instrument</th>
        <th>Names (Instrument_Fieldname)</th>
        <th>Link to BVL feedback</th>
        <th> Feedback Status</th>
        <th> Conflict</th>
        <th> Incomplete candidates</th>
    </tr>
    
    {assign var="show" value="TRUE"}
    {foreach from=$elements_list_names item=element name = element_name}
        {assign var="visit_label" value=$Visit_label_list[$smarty.foreach.element_name.index]}
        <tr>
            
            {***********************Visit Label************}
            <td nowrap="nowrap" valign="top">{$visit_label}</td>
            
            {***********************instrument name************}
            <td nowrap="nowrap" valign="top">{$elements_array[$element][$visit_label].sourcefrom}</td>
            
            <!---Create a hidden field to keep track of the visit_labels--->
            <!--input type="hidden" name="{$elements_array[$element][$visit_label].visit_label}" value ="{$visit_label}"/-->
            
            
            {***********************field name************}
            {assign var="source_field" value=$elements_array[$element][$visit_label].sourcefield}
            <td nowrap="nowrap" valign="top"> <a href="AjaxHelper.php?Module=data_team_helper&script=get_csv.php&instrument={$elements_array[$element][$visit_label].sourcefrom}&sourcefield={$elements_array[$element][$visit_label].sourcefield}&completion_status={$completion_status}&sent_to_dcc_status={$sent_to_dcc_status}" target="_blank"> <span title = '{$elements_array[$element][$visit_label].Description}'> {$element}</span></a></td>
            
            
            {***********************Feedbacklist************}
            {if isset($elements_array[$element][$visit_label].FeedbackList) }
        	    <td nowrap="nowrap" width="40" valign="top">
        	       {foreach from=$elements_array[$element][$visit_label].FeedbackList key=feedback item=FeedbackList}
                       <div>
                           <a href="#" onClick="javascript:window.open('feedback_bvl_popup.php?test_name={$FeedbackList.test_name}&candID={$FeedbackList.CandID}&sessionID={$FeedbackList.session_id}&commentID={$FeedbackList.commentid}#{$FeedbackList.feedbackid}','bvl_feedback','width=900,height=500,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes'); return false;">{$FeedbackList.PSCID}_{$FeedbackList.visit_label}</a>
                       </div>
                   {/foreach}
                </td>
                {**Currently the color option only works if the status is created as a separate cell (tr or td)...otherwise ...the color will be unreadable
                So for now it is commented out...
            	**}
                <td nowrap="nowrap" width="40" valign="top" bgcolor="{$thread_list_data[thread].QC_color}">
                    {foreach from=$elements_array[$element][$visit_label].FeedbackList key=feedback item=FeedbackList}
        				 <!--font solid color="{$FeedbackList.QC_color}"><b> {$FeedbackList.Status}</b> </font-->
        				 <!--font solid color="{$FeedbackList.QC_color}"><b> {$FeedbackList.Status}</b> </font-->
                        <div>
                            {$FeedbackList.Status}
                        </div>
        		    {/foreach}
        	    </td>
            {else}
        	    <td class="error" nowrap="nowrap" valign="top"> N/A </td>
        	    <td class="error" nowrap="nowrap" valign="top"> N/A</td>
            {/if}
    
            {***********************Conflicts************}
            <td nowrap="nowrap" valign="top">
                {foreach from=$Conflicts item=conflict}
                    {if ($conflict.FieldName eq $elements_array[$element][$visit_label].sourcefield) and $conflict.visit_label eq $visit_label}
                        <a href="#" class="conflict_resolver_link" data-pscid="{$conflict.PSCID}" data-question="{$conflict.FieldName}" data-instrument="{$conflict.TableName}" data-visits="{$conflict.visit_label}">{$conflict.PSCID}_{$conflict.visit_label}<BR></a>
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
        </tr>
    {/foreach}
<tr>
<td nowrap="nowrap" colspan="7">
<!--input class="button" style="width: 100px" name="fire_away" value="Save" type="submit" /-->
</td>
</tr>
</table>
</form>

