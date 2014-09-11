

<form>
<table border="0" valign="top" class="std">
    <tr>
        <th colspan="4">Selection Filter</th>
    </tr>
    
    
    <tr>    
        <td>
            Visit_labels
        </td>
        <td>
	        <div>
            <select name="visit_label" onchange="changefieldOptions()" id="visit_label">
                {foreach from=$visitLabels item=name key=val}
			 	   {if $name eq $visit_label}
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
            Instruments:
        </td>
        <td>
            <div>
                <select name="instrument" id="instrument">
                </select>
            </div>
	   </td>  
    </tr>
 
    <tr>
        <td>Actions</td>
        <td colspan="3">
            <input type="submit" name="filter" value="Show Data" id="filter" class="button"/>
        </td>
    </tr>
</table>
<input type="hidden" name="test_name" value="data_team_helper" />

</form>
<br>

<table border="1" valign="top" class="std">
    <tr>
        <td> Current Data_entry Completion Percentage (for <b>{$visit_label}</b> and instrument: <b>{$test_name}</b>)&nbsp&nbsp  </td>
        <td> &nbsp&nbsp&nbsp{$percent_completed}%</td>
    </tr>
    
</table>

<table>
  <tr>
 		<td>
 		<p style="font-family:arial;color:red;font-size:13px;">Currently only Behavioural Feedbacks tied to fields are shown</p>
 </tr>
</table>


<form>
<table class="fancytable" border="0">
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
    <tr>
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
            <td nowrap="nowrap" valign="top"> <a href="get_csv.php?instrument={$elements_array[$element][$visit_label].sourcefrom}&sourcefield={$elements_array[$element][$visit_label].sourcefield}&completion_status={$completion_status}&sent_to_dcc_status={$sent_to_dcc_status}" target="_blank"> <span title = '{$elements_array[$element][$visit_label].Description}'> {$element}</span></a></td>
            
            
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
                    {if ($conflict.FieldName eq $elements_array[$element][$visit_label].sourcefield) and $conflict.visit_label eq $visit_label}
                        <a href="main.php?Question={$conflict.FieldName}&Instruments={$conflict.test_name_display}&Visits={$conflict.visit_label}&PSCID={$conflict.PSCID}&site=all&test_name=conflicts_resolve" target="_blank">{$conflict.PSCID}_{$conflict.visit_label}<BR></a>
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

