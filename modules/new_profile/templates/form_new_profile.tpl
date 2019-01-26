{if $success}

<p>New candidate created. DCCID: {$candID} PSCID: {$PSCID}<br />
<a href="{$baseurl}/{$candID}/">Access this candidate</a><br />
<a href="{$baseurl}/new_profile/">Recruit another candidate</a></p>

{else}

<br />
<form method="post" name="new_profile" id="new_profile" class="form-inline">

    {foreach from=$form.errors item=error}
    <div class="col-sm-12">
        <label class="error col-sm-12">{$error}</label>
    </div>
    {/foreach}

	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.dob1.label}</label>
		<div class="col-sm-10">{$form.dob1.html}</div>
	</div>
	<br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.dob2.label}</label>
		<div class="col-sm-10">{$form.dob2.html}</div>
	</div>
	
    {if $form.edc1.html != ""}
    <br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.edc1.label}</label>
		<div class="col-sm-10">{$form.edc1.html}</div>
	</div>
	<br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.edc2.label}</label>
		<div class="col-sm-10">{$form.edc2.html}</div>
	</div>

    {/if}
	<br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.sex.label}</label>
		<div class="col-sm-10">{$form.sex.html}</div>
	</div>
	<br><br>
    {if $form.psc.html != ""}
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.psc.label}</label>
		<div class="col-sm-10">{$form.psc.html}</div>
	</div>
	<br><br>
    {/if}

    {if $form.PSCID.html != ""}
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.PSCID.label}</label>
		<div class="col-sm-10">{$form.PSCID.html}</div>
	</div>
	<br><br>
    {/if}

    {if $form.ProjectID.html != ""}
    <div class="form-group col-sm-12">
        <label class="col-sm-2">{$form.ProjectID.label}</label>
        <div class="col-sm-10">{$form.ProjectID.html}</div>
    </div>
    <br><br>
    {/if}

	<div class="form-group col-sm-12">
		<div class="col-sm-12"><input class="btn btn-primary col-sm-offset-2 col-sm-2" name="fire_away" value="Create" type="submit" /></div>
	</div>
</table>
{$form.hidden}
</form>

{/if}
