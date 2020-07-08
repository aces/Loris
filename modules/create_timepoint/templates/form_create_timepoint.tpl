{if $success}

<p>New time point successfully registered. <a href="/{$candID}">Click here to continue.</a></p>

{else}

<form method="post" name="create_timepoint" id="create_timepoint">

    <h3>Create Time Point</h3>
    <br>

    {foreach from=$form.errors item=error}
    <div class="col-sm-12">
        <label class="error col-sm-12">{$error}</label>
    </div>
    {/foreach}

	<div class="form-group col-sm-12">
		<label class="col-sm-2">DCCID</label>
		<div class="col-sm-10">{$candID}</div>
	</div>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.subprojectID.label}</label>
		<div class="col-sm-2">{$form.subprojectID.html}</div>
	</div>
    {if $pscLabelAdded}
	    <div class="form-group col-sm-12">
		    <label class="col-sm-2">{$form.psc.label}</label>
		    <div class="col-sm-2">{$form.psc.html}</div>
	    </div>
    {/if}
    {if $projectAdded}
      <div class="form-group col-sm-12">
        <label class="col-sm-2">{$form.project.label}</label>
        <div class="col-sm-2">{$form.project.html}</div>
      </div>
    {/if}
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.visitLabel.label}</label>
		<div class="col-sm-2">{$form.visitLabel.html}</div>
	</div>

	<div class="form-group col-sm-12">
		<div class="col-sm-2 col-sm-offset-2"><input class="btn btn-primary col-sm-12" name="fire_away" value="Create Time Point" type="submit" /></div>
	</div>

{$form.hidden}
</form>

{/if}
