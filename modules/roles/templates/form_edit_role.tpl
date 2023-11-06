<br />
<form method="post" name="edit_role" autocomplete="off">

    {* error band *}
    {if $form.errors}
    <div class="alert alert-danger" role="alert">
        The form you submitted contains data entry errors
    </div>
    {/if}

    {* add / edit role *}
    <h3>Add/Edit Role</h3>

    {* Code *}
    {if $form.errors.Code|default}
    <div class="row form-group has-error">
    {else}
    <div class="row form-group">
    {/if}
        <label class="col-sm-2 form-label">
            {$form.Code.label|default}
            {if $form.Code.required|default}
                <span style="color: red">*</span>
            {/if}
        </label>
        <div class="col-sm-3">
            {$form.Code.html}
        </div>
        {if $form.errors.Code|default}
        <div class="col-sm-offset-2">
            <font class="form-error">{$form.errors.Code|default}</font>
        </div>
        {/if}
    </div>

    {* Name *}
    {if $form.errors.Name|default}
    <div class="row form-group has-error">
    {else}
    <div class="row form-group">
    {/if}
        <label class="col-sm-2 form-label">
            {$form.Name.label|default}
            {if $form.Name.required|default}
                <span style="color: red">*</span>
            {/if}
        </label>
        <div class="col-sm-4">
            {$form.Name.html}
        </div>
        {if $form.errors.Name|default}
        <div class="col-sm-offset-2">
            <font class="form-error">{$form.errors.Name|default}</font>
        </div>
        {/if}
    </div>

    {* Description *}
    {if $form.errors.Description|default}
    <div class="row form-group has-error">
    {else}
    <div class="row form-group">
    {/if}
        <label class="col-sm-2 form-label">
            {$form.Description.label|default}
            {if $form.Description.required|default}
                <span style="color: red">*</span>
            {/if}
        </label>
        <div class="col-sm-4">
            {$form.Description.html}
        </div>
        {if $form.errors.Description|default}
        <div class="col-sm-offset-2">
            <font class="form-error">{$form.errors.Description|default}</font>
        </div>
        {/if}
    </div>

    {* Permissions *}
    <div class="row form-group form-inline">
        <label class="col-sm-2 form-label">
            {$form.PermID_Group.label}
            {if $form.PermID_Group.required|default}
                <span style="color: red">*</span>
            {/if}
        </label>
        <div class="col-sm-10">
            <div>
                {$form.PermID_Group.html}
            </div>
        </div>
    </div>

    {* actions *}
    <div class="row form-group form-inline">
        <div class="col-sm-2"></div>
        <div class="col-sm-1">
            <input class="btn btn-sm btn-primary" name="fire_away" value="Save" type="submit" />
        </div>
        <div class="col-sm-1">
            <input class="btn btn-sm btn-primary" value="Reset" type="reset"/>
        </div>
        <div class="col-sm-1">
        <input class="btn btn-sm btn-primary" onclick="location.href='{$baseurl|default}/roles/'" value="Back" type="button" />
    </div>

    {* end form *}
</form>