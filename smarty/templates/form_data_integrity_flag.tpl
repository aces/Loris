<form>
<table border="0" valign="top" class="std">
    <tr>
        <th colspan="5">Selection Filter</th>
    </tr>
    
    
    <tr>    
      
        {php}
		$VisitLabelSelected = $_REQUEST['visit_label'];
		$this->assign('visit_label_selected',$VisitLabelSelected);
		{/php}
        <td>
            Visit_labels
        </td>
        <td>
	        <div>
            <select name="visit_label" onchange="changefieldOptions()" id="visit_label">
                {foreach from=$visitLabels item=name key=val}
			 	   {if $name eq $visit_label_selected}
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
<input type="hidden" name="test_name" value="data_integrity_flag" />

</form>
<br>


<form method="post" name="data_integrity_flag" id="data_integrity_flag">

		{**error table***}
		<table border="0">
				<tr>
			      <td nowrap="nowrap" colspan="3" class="error">NOTE: Please click on 'show-data' or refresh the page, once the 'save' button is clicked"</td>
					<!--td class="error"><em>NOTE: Please click on 'show-data' or refresh the page, once the 'save' button is clicked"</em></td-->
				</tr>
			    {foreach from=$form.errors item=error}
			        <tr>
			            <td nowrap="nowrap" colspan="3" class="error" border="0">{$error}</td>
			        </tr>
			    {/foreach}
			    
		</table>
	    
	    <table class="fancytable" border="0">
   	    <tr>
	        <td>{$form.visit_label.label}</td>
	        <td>{$form.visit_label.html}</td>
	    </tr>
	    <tr>
	        <td>{$form.instrument.label}</td>
	        <td>{$form.instrument.html}</td>
	    </tr>
	    <tr>
	        <td>{$form.date.label}</td>
	        <td>{$form.date.html}</td>
	    </tr>
	    
   	    <tr>
	        <td>{$form.flag_status.label}</td>
	        <td>{$form.flag_status.html}</td>
	    </tr>

	    
	    
   	    <tr>
	        <td>{$form.comment.label}</td>
	        <td>{$form.comment.html}</td>
	    </tr>
	    
	    

	    
		<tr>
			<td nowrap="nowrap" colspan="3">
				<input class="button" style="width: 100px" id="fire_away" name="fire_away" value="Save" type="submit"/>
				<input class="button" style="width: 120px" id="update_data" name="update_data" value="Show updated Data"/>
				<input class="button" style="width: 120px" id="show_all" name="show_all" value="Show all data"/>
			</td>
		</tr>
		

	</table>
</form>



<form>
	<table class="fancytable" border="0">
	    {if $form.total.html}
	        <tr class="nohover">
	            <td colspan="7" align="right" style="border: none;" class="nohover">Showing <em>{$form.total.html}</em> results.</td>
	        </tr>
	    {/if}
	    <tr>
	    	<th>Visit Label</th>
	    	<th>Instrument</th>
	        <th>Date</th>
	        <th>Flag Status</th>
	        <th>Comment</th>
	        <th>Data Cleaning open-feedbacks</th>
	    </tr>
	    {foreach from=$elements_list_names item=element}
	    
	        <tr>
		        <td nowrap="nowrap" valign="top">{$elements_array[$element].visit_label}</td>
		        <td nowrap="nowrap" valign="top">{$elements_array[$element].instrument}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].date}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].flag}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].comment}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].dc_open_feedback}</td>
	        </tr>
	    
	        
	    {/foreach}
	    
	</table>
</form>

