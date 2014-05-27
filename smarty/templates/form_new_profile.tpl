{if $success}

<p>New candidate created. DCCID: {$candID} PSCID: {$PSCID}<br />
<a href="main.php?test_name=timepoint_list&candID={$candID}">Access this candidate</a><br />
<a href="main.php?test_name=new_profile">Recruit another candidate</a></p>

{else}

<br />
<form method="post" name="new_profile" id="new_profile">

    {foreach from=$form.errors item=error}
    <div class="col-sm-12">
        <label class="error col-sm-12">{$error}</label>
    </div>
    {/foreach}

	<div class="form-group col-sm-12">
		<label class="col-sm-2">Date of Birth</label>
		<div class="col-sm-10">{$form.dob1.html}</div>
	</div>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">Confirm Date of Birth</label>
		<div class="col-sm-10">{$form.dob2.html}</div>
	</div>

    {if $form.edc1.html != ""}
	<div class="form-group col-sm-12">
		<label class="col-sm-2">Expected Date of Confinement</label>
		<div class="col-sm-10">{$form.edc1.html}</td>
	</div>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">Confirm EDC</label>
		<div class="col-sm-10">{$form.edc2.html}</div>
	</div>
    {/if}

	<div class="form-group col-sm-12">
		<label class="col-sm-2">Gender</label>
		<div class="col-sm-10">{$form.gender.html}</div>
	</div>

    {if $form.PSCID.html != ""}
	<div class="form-group col-sm-12">
		<label class="col-sm-2">PSCID</label>
		<div class="col-sm-10">{$form.PSCID.html}</div>
	</div>
    {/if}

    {if $form.ProjectID.html != ""}
    <div class="form-group col-sm-12">
        <label class="col-sm-2">Project</label>
        <div class="col-sm-10">{$form.ProjectID.html}</div>
    </div>
    {/if}

	<div class="form-group col-sm-12">
		<div class="col-sm-12"><input class="btn btn-primary col-sm-offset-2 col-sm-2" name="fire_away" value="Create" type="submit" /></div>
	</div>
</table>
{$form.hidden}
</form>

{/if}
