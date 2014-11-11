<div class="row">
	<div class="col-sm-8 col-md-6">
	    <div class="panel panel-primary">
	        <div class="panel-heading" onclick="hideFilter();">
	            Selection Filter
	        </div>
	        <div class="panel-body" id="panel-body">
	        	<form>
	        		<div class="row">
	                    <div class="form-group col-xs-12">
	                        <label class="col-sm-4">Visit_labels</label>
                        	<div class="col-sm-8">
	                        	<select name="visit_label" onchange="changeVisitLabels()" id="visit_label" class="form-control input-sm">
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
	                        	<select name="instrument" id="instrument" class="form-control input-sm"></select>
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
	                <input type="hidden" name="test_name" value="data_integrity_flag" />
	        	</form>
	        </div>
	    </div>
	</div>
</div>

<form method="post" name="data_integrity_flag" id="data_integrity_flag">

		{**error table***}
		<table border="0">
				<tr>
			      <td nowrap="nowrap" colspan="3" style="color:red">NOTE: Please click on 'show-data' or refresh the page, once the 'save' button is clicked"</td>
					<!--td class="error"><em>NOTE: Please click on 'show-data' or refresh the page, once the 'save' button is clicked"</em></td-->
				</tr>
			    {foreach from=$form.errors item=error}
			        <tr>
			            <td nowrap="nowrap" colspan="3" class="error" border="0">{$error}</td>
			        </tr>
			    {/foreach}
			    
		</table>


	<div class="row">
		<div class="col-sm-8 col-md-6">
		    <div class="panel panel-primary">
		        <div class="panel-heading" onclick="hideFilter();">
		            Set Flag
		        </div>
		        <div class="panel-body" id="panel-body">
		        	<div class="row">
	                    <div class="form-group col-xs-12">
	                        <label class="col-sm-4">{$form.visit_label.label}</label>
                        	<div class="col-sm-8">
	                        	{$form.visit_label.html}
	                        </div>
	                    </div>
	                </div>
	                <div class="row">
	                    <div class="form-group col-xs-12">
	                        <label class="col-sm-4">{$form.instrument.label}</label>
                        	<div class="col-sm-8">
	                        	{$form.instrument.html}
	                        </div>
	                    </div>
	                </div>
	                <div class="row">
	                    <div class="form-group col-xs-12">
	                        <label class="col-sm-4">{$form.date.label}</label>
                        	<div class="col-sm-8">
	                        	{$form.date.html}
	                        </div>
	                    </div>
	                </div>
	                <div class="row">
	                    <div class="form-group col-xs-12">
	                        <label class="col-sm-4">{$form.flag_status.label}</label>
                        	<div class="col-sm-8">
	                        	{$form.flag_status.html}
	                        </div>
	                    </div>
	                </div>
	                <div class="row">
	                    <div class="form-group col-xs-12">
	                        <label class="col-sm-4">{$form.comment.label}</label>
                        	<div class="col-sm-8">
	                        	{$form.comment.html}
	                        </div>
	                    </div>
	                </div>
	                <div class="row">
	                    <div class="form-group col-xs-12">
                        	<div class="col-sm-6">
	                        	<input class="btn btn-sm btn-primary col-xs-12" id="fire_away" name="fire_away" value="Save" type="submit"/>
	                        </div>
	                        <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
	                        <div class="col-sm-6">
	                        	<input class="btn btn-sm btn-primary col-xs-12" id="update_data" name="update_data" value="Show updated Data" type="submit"/>
	                        </div>
	                    </div>
	                </div>
		        </div>
		    </div>
		</div>
	</div>
</form>

<form>
	<table class="table table-primary table-bordered dynamictable" border="0">
	    {if $form.total.html}
	        <tr class="nohover">
	            <td colspan="8" align="right" style="border: none;" class="nohover">Showing <em>{$form.total.html}</em> results.</td>
	        </tr>
	    {/if}
	    <tr class="info">
	    	<th>Visit Label</th>
	    	<th>Instrument</th>
	        <th>Date</th>
	        <th>Flag Status</th>
	        <th>Comment</th>
	        <th>UserID</th>
	    </tr>
	    {foreach from=$elements_list_names item=element}
	    
	        <tr>
		        <td nowrap="nowrap" valign="top">{$elements_array[$element].visit_label}</td>
		        <td nowrap="nowrap" valign="top">
		          <a href="main.php?visit_label={$elements_array[$element].visit_label}&instrument={$elements_array[$element].full_name}
&filter=Show+Data&test_name=data_team_helper">{$elements_array[$element].instrument}
		          </a>
		        </td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].date}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].flag}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].comment}</td>
	    		<td nowrap="nowrap" valign="top">{$elements_array[$element].userid}</td>
	        </tr>
	        
	    {/foreach}
	</table>
</form>