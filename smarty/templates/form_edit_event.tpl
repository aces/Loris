{literal}   
<script language="javascript" type="text/javascript">
    function hideFilter(){
        $("#panel-body").toggle();
        $("#down").toggle();
        $("#up").toggle();
    }
</script>
{/literal}

<div class="col-md-5 col-sm-8">
	<form method="post" name="edit_user" id="edit_user">
		<div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Edit Certification Event
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
            </div>
            <div class="panel-body" id="panel-body">
				{foreach from=$form.errors item=error}
				    <div class="col-xs-12">
				        <p class="error">{$error}</p>
				    </div>
			    {/foreach}
			    <div class="row">
			    	<div class="form-group col-sm-12">
						<label class="col-xs-12 col-sm-3">{$form.examinerID.label}</label>
						<div class="col-xs-12 col-sm-9">{$form.examinerID.html}</div>
					</div>
				</div>

				<!--		<td nowrap="nowrap" align="right">Date of testing</td>
						<td nowrap="nowrap">{$form.date_cert.html}</td>
					</tr>

				<tr>
						<td nowrap="nowrap" align="right">DCCID</td>
						<td nowrap="nowrap">{$form.cert_candID.html}</td>
					</tr>

					<tr>
						<td nowrap="nowrap" align="right">Visit label</td>
						<td nowrap="nowrap">{$form.cert_visit_label.html}</td>
					</tr>
				-->
				{foreach from=$form.pass item=item key=key}
					<div class="row">
			    		<div class="form-group col-sm-12">
							<label class="col-sm-12 col-md-2">{$form.pass[$key].label}</label>
							<div class="col-sm-12 col-md-10">{$form.pass[$key].html}</div>
						</div>
						<div class="form-group col-sm-12">
							<label class="col-sm-12 col-md-2">{$form.date_cert[$key].label}</label>
							<div class="col-sm-12 col-md-10">{$form.date_cert[$key].html}
							Comment {$form.comment[$key].html}</div>
						</div>
					</div>
				{/foreach}
					<div class="row">
					    {if not $success}
					    	<div class="form-group col-sm- col-sm-offset-4">
					    		<div class="visible-xs col-xs-12"> </div>
		                        <div class="visible-xs col-xs-12"> </div>
		                        <div class="visible-xs col-xs-12"> </div>
		                        <div class="visible-xs col-xs-12"> </div>
					    		<div class="col-sm-4 col-xs-12">
						        	<input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit" />
						        </div>
						        <div class="visible-xs col-xs-12"> </div>
		                        <div class="visible-xs col-xs-12"> </div>
		                        <div class="visible-xs col-xs-12"> </div>
		                        <div class="visible-xs col-xs-12"> </div>
						        <div class="col-sm-4 col-xs-12">
						        	<input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset" />
						        </div>
						    </div>
					    {/if}
					</div>
				</table>
				{$form.hidden}
            </div>

	    

		</div>
	</form>
</div>

<table class="std">
<p>&nbsp;</p>
<h1>Change Log</h1>
<tr>
<th>Time</th>
<th>User</th>
<th>Measure</th>
<th>Visit</th>
<th>Old Value</th>
<th>Old Date</th>
<th>New Value</th>
<th>New Date</th>
</tr>
{$form.certification_history.html}
</table>
