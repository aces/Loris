<br />
<form method="post" name="edit_user" id="edit_user">
    <h3>Password Rules</h3>
    <ul>
        <li>The password must be at least 8 characters long</li>
        <li>The password must contain at least 1 letter, 1 number and 1 character from   !@#$%^&amp;*()</li>
        <li>The password and the user name must not be the same</li>
        <li>The password and the email address must not be the same</li>
    </ul>
    <h3>Edit My Information</h3>
    {foreach from=$form.errors item=error}
        <ul>
            <li class="error">{$error}</li>
        </ul>
    {/foreach}
    <div class="row">
        <div class="form-group">
            <label class="col-sm-12 col-sm-2">
                   {$form.UserID.label}
            </label>
            <div class="col-sm-10">
                {$form.UserID.html}
            </div>
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.First_name.label}
        </label>
        <div class="col-sm-10">
            {$form.First_name.html}
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.Last_name.label}
        </label>
        <div class="col-sm-10">
            {$form.Last_name.html}
        </div>
    </div><div class="row form-group">
        <label class="col-sm-2">
            {$form.Email.label}
        </label>
        <div class="col-sm-10">
            {$form.Email.html}
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.Password_md5.label}
        </label>
        <div class="col-sm-10">
            {$form.Password_md5.html}
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.__Confirm.label}
        </label>
        <div class="col-sm-10">
            {$form.__Confirm.html}
        </div>
    </div>
    <div class="row form-group">
        <div class="col-sm-2">
            <input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit" />
        </div>
        <div class="col-sm-2">
            <input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset" />
        </div>
    </div>
{$form.hidden}
</form>
