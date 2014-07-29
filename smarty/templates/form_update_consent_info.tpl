{if $success}

<p>Consent Information was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_consent_info" id="update_consent_info" enctype="multipart/form-data">
{if not $success}
<div class="panel panel-primary">
    <div class="panel-heading">
        Update Consent Information
    </div>
    <div class="panel-body">
        {foreach from=$form.errors item=error}
            <font class="error">{$error}</font>
        {/foreach}
        {if $consent}
        	<div class="row">
	            <label class="col-sm-2">{$form.pscid.label}</label>
	            <div class="col-sm-10" id="pscid">
	                {$pscid}
	            </div>
	        </div>
	        <div class="row">
	            <label class="col-sm-2">DCCID:</label>
	            <div class="col-sm-10">
	                {$candID}
	            </div>
	        </div>
	        <br>
			{section name=question loop=$consent}
				{* 
				    $consent[question] contains a list of element
				        names in the form that are related to that question.
				        We need to iterate through them to add them to the
				        HTML. 
				        *}
				{foreach from=$consent[question] item=row}
					<div class="row">
			            <label class="col-sm-4">{$form.$row.label}</label>
			            <div class="col-sm-8">
			                {$form.$row.html}
			            </div>
			        </div>
					{if $form.$row.error}
					<span class="error">{$form.$row.error}</span>
					{/if}
				{/foreach}
				<br>
			{/section}
        {/if}
        <input class="btn btn-sm btn-primary col-sm-offset-2" name="fire_away" value="Save" type="submit" />
        {/if}
        <input class="btn btn-sm btn-primary" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to Candidate Info" type="button" />
    </div>
</div>