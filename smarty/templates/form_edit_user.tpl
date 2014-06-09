<br />
{literal}
<script>
$(document).ready(function() {
    function toggleGroup(group) {
        if(group) {
            // id is the header that was clicked
            id = group.target.id;

            // chop off header_ to get section name
            section = id.substring(7);
            
            // hide (or show) the appropriate div for that section
            section_el = $("#perms_" + section);
            section_el.toggle();
        }
    }
    // define event handler for all the header sections
    $(".perm_header").click(toggleGroup);
    // Get rid of the extra <br /> tag that Quickform element adds at the top of each <div>
    $(".perm_header").each(function(idx, el) {
        id = el.id;
        section = id.substring(7);
        section_el = $("#perms_" + section + " br:nth-child(1)").hide();
    });
    
});
</script>
{/literal}
<form method="post" name="edit_user" >
	<h3>Password Rules</h3>
	<ul>
		<li>The password must be at least 8 characters long</li>
        <li>The password must contain at least 1 letter, 1 number and 1 character from   !@#$%^&amp;*()</li>
        <li>The password and the user name must not be the same</li>
        <li>The password and the email address must not be the same</li>
	</ul>
	<h3>Add/Edit User</h3>
	{foreach from=$form.errors item=error}
	    <ul>
	        <li class="error">{$error}</li>
	    </ul>
    {/foreach}
    <div class="row">
    	<div class="form-group form-inline form-inline">
	    	<label class="col-sm-12 col-sm-2">
                   {$form.UserID_Group.label}
            </label>
	    	<div class="col-sm-10">
	    		{$form.UserID_Group.html}
	    	</div>
	    </div>
    </div>
    <br>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		NOTE:
    	</label>
    	<div class="col-sm-10">
    		<B>When generating a new password, please notify the user by checking 'Send email to user' box!</B>
    	</div>
    </div>
    <br>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Password_Group.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Password_Group.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.__Confirm.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.__Confirm.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Real_name.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Real_name.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.First_name.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.First_name.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Last_name.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Last_name.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Degree.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Degree.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Position_title.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Position_title.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Institution.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Institution.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Department.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Department.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Address.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Address.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.City.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.City.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.State.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.State.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Zip_code.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Zip_code.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Country.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Country.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Fax.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Fax.html}
    	</div>
    </div>
    <div class="row form-group form-inline form-inline">
    	<label class="col-sm-2">
    		{$form.Email_Group.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Email_Group.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.CenterID.label}
    	</label>	
    	<div class="col-sm-10">
    		{$form.CenterID.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Active.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Active.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Pending_approval.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Pending_approval.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.Examiner.label}
    	</label>
    	<div class="col-sm-10">
    		{$form.Examiner.html}
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
    		{$form.PermID_Group.label}
    	</label>
    	<div class="col-sm-10">
    		<div>
    		{$form.PermID_Group.html}
    		</div>
    	</div>
    </div>
    <div class="row form-group form-inline">
    	<div class="col-sm-2">
    		<input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit" />
    	</div>
    	<div class="col-sm-2">
    		<input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset" />
    	</div>
    	<div class="col-sm-2">
    		<input class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=user_accounts'" value="Back" type="button" />
    	</div>
    </div>
<!-- </form> -->
</form>
