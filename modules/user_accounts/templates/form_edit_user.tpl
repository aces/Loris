<br />
<form method="post" name="edit_user" autocomplete="off">
    {if $form.errors}
    <div class="alert alert-danger" role="alert">
        The form you submitted contains data entry errors
    </div>
    {/if}

    <div class="panel panel-default">
        <div class="panel-body">
            <h3>Password Rules</h3>
            <ul>
                <li>The password must be at least 8 characters long.</li>
                <li>The password cannot be your username or email address.</li>
                <li>No special characters are required but your password must be sufficiently complex to be accepted.</li>
            </ul>
            <p>Please choose a unique password.</p>
            <p>We suggest using a password manager to generate one for you.</p>
            <h3>Notes</h3>
            <ul>
                <li>It is recommended to use an email address as the username, for clarity and uniqueness.</li>
                <li>When generating a new password, please notify the user by checking 'Send email to user' box below!</li>
            </ul>
        </div>
    </div>
    <h3>Add/Edit User</h3>
	<!-- {foreach from=$form.errors item=error key=k}
	    <ul>
	        <li class="error">{$k}: k{$error}</li>
	    </ul>
        {/foreach} -->
        <!-- <div class="row"> -->
        {if $form.errors.UserID_Group|default}
        <div class="row form-group form-inline form-inline has-error">
            {else}
            <div class="row form-group form-inline form-inline">
                {/if}
                {if $form.UserID_Group|default != null}
                <label class="col-sm-12 col-sm-2 form-label">
                    {$form.UserID_Group.label}
                    {if $form.UserID_Group.options.required|default}
                        <span class="userid-star" style="color: red">*</span>
                    {/if}
             </label>
             <div class="col-sm-10">
                 {$form.UserID_Group.html}
             </div>
             {if $form.errors.UserID_Group}
             <div class="col-sm-offset-2 col-xs-12">
                <font class="form-error">{$form.errors.UserID_Group}</font>
            </div>
            {/if}
            {else}
            <label class="col-sm-12 col-sm-2 form-label">
                {$form.UserID.label}
                {if $form.UserID.options.required|default}
                    <span style="color: red">*</span>
                {/if}
            </label>
         <div class="col-sm-10">
             {$form.UserID.html}
         </div>

         {/if}
     </div>
     <!-- </div> -->
     <br>
     {if $form.errors.Password|default}
        <div class="row form-group form-inline has-error">
     {else}
        <div class="row form-group form-inline">
     {/if}
          <label class="col-sm-2">
            {$form.Password_hash.label|default}
            <span class="pwd-star password {if isset($form.Password_hash.required) && $form.Password_hash.required} required{/if}" style="color: red">*</span>
          </label>
          <div class="col-sm-2">
              <input type="password" name="{$form.Password_hash.name}" />
          </div>
          <div class="col-sm-4">{$form.NA_Password.html}</div>
          {if $form.errors.Password|default}
          <div class="col-sm-offset-2 col-xs-12">
            <font class="form-error">{$form.errors.Password}</font>
        </div>
        {/if}
    </div>
    <div class="row form-group form-inline">
        <label class="col-sm-2">
            {$form.__Confirm.label}
            <span class="pwd-star confirm-password {if isset($form.__Confirm.required) && $form.__Confirm.required} required{/if}" style="color: red">*</span>
        </label>
        <div class="col-sm-4">
            <input type="password" name="{$form.__Confirm.name}" />
        </div>
    </div>
    <!-- <div class="row form-group form-inline">
        <label class="col-sm-2">
            {$form.Real_name.label}
        </label>
        <div class="col-sm-10">
            {$form.Real_name.html}
        </div>
    </div> -->
    {if $form.errors.First_name|default}
    <div class="row form-group form-inline form-inline has-error">
        {else}
        <div class="row form-group form-inline form-inline">
            {/if}
            <label class="col-sm-2 form-label">
                {$form.First_name.label|default}
                {if $form.First_name.required|default}
                    <span style="color: red">*</span>
                {/if}
          </label>
          <div class="col-sm-10">
              {$form.First_name.html}
          </div>
          {if $form.errors.First_name|default}
          <div class="col-sm-offset-2 col-xs-12">
            <font class="form-error">{$form.errors.First_name|default}</font>
        </div>
        {/if}
    </div>
    {if $form.errors.Last_name|default}
    <div class="row form-group form-inline form-inline has-error">
        {else}
        <div class="row form-group form-inline form-inline">
            {/if}
            <label class="col-sm-2 form-label">
                {$form.Last_name.label}
                {if $form.Last_name.required|default}
                    <span style="color: red">*</span>
                {/if}
          </label>
          <div class="col-sm-10">
              {$form.Last_name.html}
          </div>
          {if $form.errors.Last_name|default}
          <div class="col-sm-offset-2 col-xs-12">
            <font class="form-error">{$form.errors.Last_name}</font>
        </div>
        {/if}
    </div>
    {if $form.Degree}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Degree.label}
            {if $form.Degree.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Degree.html}
    	</div>
    </div>
    {/if}
    {if $form.Position_title}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Position_title.label}
            {if $form.Position_title.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Position_title.html}
    	</div>
    </div>
    {/if}
    {if $form.Institution}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Institution.label}
            {if $form.Institution.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Institution.html}
    	</div>
    </div>
    {/if}
    {if $form.Department}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Department.label}
            {if $form.Department.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Department.html}
    	</div>
    </div>
    {/if}
    {if $form.Address}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Address.label}
            {if $form.Address.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Address.html}
    	</div>
    </div>
    {/if}
    {if $form.City}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.City.label}
            {if $form.City.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.City.html}
    	</div>
    </div>
    {/if}
    {if $form.State}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.State.label}
            {if $form.State.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.State.html}
    	</div>
    </div>
    {/if}
    {if $form.ZipCode|default}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Zip_code.label}
            {if $form.Zip_code.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Zip_code.html}
    	</div>
    </div>
    {/if}
    {if $form.Country}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Country.label}
            {if $form.Country.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Country.html}
    	</div>
    </div>
    {/if}
    {if $form.Fax}
    <div class="row form-group form-inline">
    	<label class="col-sm-2">
            {$form.Fax.label}
            {if $form.Fax.required|default}
                <span style="color: red">*</span>
            {/if}
    	</label>
    	<div class="col-sm-10">
            {$form.Fax.html}
    	</div>
    </div>
    {/if}
    {if $form.errors.Email_Group|default}
    <div class="row form-group form-inline form-inline has-error">
        {else}
        <div class="row form-group form-inline form-inline">
            {/if}
            <label class="col-sm-2 form-label">
                {$form.Email_Group.label}
                {if $form.Email_Group.options.required|default}
                    <span style="color: red">*</span>
                {/if}
          </label>
          <div class="col-sm-10">
              {$form.Email_Group.html}
          </div>
          {if $form.errors.Email_Group|default}
          <div class="col-sm-offset-2 col-xs-12">
            <font class="form-error">{$form.errors.Email_Group}</font>
        </div>
        {/if}
    </div>
    {if $form.__ConfirmEmail|default}
    {if $form.errors.__ConfirmEmail}
    <div class="row form-group form-inline form-inline has-error">
        {else}
        <div class="row form-group form-inline form-inline">
            {/if}
            <label class="col-sm-2">
                {$form.__ConfirmEmail.label}
                {if $form.__ConfirmEmail.required}
                    <span style="color: red">*</span>
                {/if}
          </label>
          <div class="col-sm-10">
              {$form.__ConfirmEmail.html}
          </div>
          {if $form.errors.__ConfirmEmail}
          <div class="col-sm-offset-2 col-xs-12">
            <font class="form-error">{$form.errors.__ConfirmEmail}</font>
        </div>
        {/if}
    </div>
    {/if}
    {if $form.errors.sites_group|default}
    <div class="row form-group form-inline has-error">
    {else}
    <div class="row form-group form-inline">
    {/if}
        <label class="col-sm-2">
            {$form.CenterIDs.label}
            {if $form.CenterIDs.required}
                <span style="color: red">*</span>
            {/if}
        </label>
        <div class="col-sm-10">
            {$form.CenterIDs.html}
        </div>
        {if $form.errors.sites_group|default}
        <div class="col-sm-offset-2 col-xs-12">
            <font class="form-error">{$form.errors.sites_group}</font>
        </div>
        {/if}
    </div>
        {if $form.errors.projects_group|default}
        <div class="row form-group form-inline has-error">
            {else}
            <div class="row form-group form-inline">
                {/if}
                <label class="col-sm-2">
                    {$form.ProjectIDs.label}
                    {if $form.ProjectIDs.required}
                        <span style="color: red">*</span>
                    {/if}
                </label>
                <div class="col-sm-10">
                    {$form.ProjectIDs.html}
                </div>
                {if $form.errors.projects_group|default}
                    <div class="col-sm-offset-2 col-xs-12">
                        <font class="form-error">{$form.errors.projects_group}</font>
                    </div>
                {/if}
            </div>
    {if $form.examiner_sites|default}
    {if $form.errors.examiner_sites|default}
    <div class="row form-group form-inline form-inline has-error">
        {else}
        <div class="row form-group form-inline form-inline">
            {/if}
            <label class="col-sm-2">
                {$form.examiner_sites.label}
                {if $form.examiner_sites.required|default}
                    <span style="color: red">*</span>
                {/if}
            </label>
            <div class="col-sm-10">
                {$form.examiner_sites.html}
            </div>
            {if $form.errors.examiner_sites|default}
            <div class="col-sm-offset-2 col-xs-12">
                <font class="form-error">{$form.errors.examiner_sites}</font>
            </div>
            {/if}
        </div>
    {/if}
      {if $form.examiner_group|default}
    {if $form.errors.examiner_group|default}
    <div class="row form-group form-inline form-inline has-error">
        {else}
        <div class="row form-group form-inline form-inline">
            {/if}
            <label class="col-sm-2">
                {$form.examiner_group.label}
                {if $form.examiner_group.required|default}
                    <span style="color: red">*</span>
                {/if}
            </label>
            <div class="col-sm-10">
                <b>{$form.examiner_group.html}</b>
                </div>
                {if $form.errors.examiner_group|default}
                <div class="col-sm-offset-2 col-xs-12">
                    <font class="form-error">{$form.errors.examiner_group}</font>
                </div>
                {/if}
            </div>
      {/if}
      <div class="row form-group form-inline">
           <label class="col-sm-2">
               {$form.Active.label|default}
               {if $form.Active.required|default}
                   <span style="color: red">*</span>
               {/if}
          </label>
          <div class="col-sm-10">
              {$form.Active.html|default}
          </div>
      </div>

	{if $form.errors.active_timeWindows|default}
	    <div class="alert alert-danger" role="alert">
	        {$form.errors.active_timeWindows|default}
	    </div>
	{/if}

	{if $form.errors.active_timeWindows|default}
		<div class="row form-group form-inline form-inline has-error">
	{else}
		<div class="row form-group form-inline">
	{/if}
		<label class="col-sm-2">
			{$form.active_from.label|default}
            {if $form.active_from.required|default}
                <span style="color: red">*</span>
            {/if}
		 </label>
		 <div class="col-sm-10">
			{$form.active_from.html|default}
		 </div>
	</div>
	{if $form.errors.active_timeWindows|default}
		<div class="row form-group form-inline form-inline has-error">
	{else}
		<div class="row form-group form-inline">
	{/if}
		<label class="col-sm-2">
			{$form.active_to.label|default}
            {if $form.active_to.required|default}
                <span style="color: red">*</span>
            {/if}
		 </label>
		 <div class="col-sm-10">
			{$form.active_to.html|default}
		 </div>
	</div>

    <div class="row form-group form-inline">
        <label class="col-sm-12 col-sm-2 form-label">
            {$form.account_request_date.label}
        </label>
        <div class="col-sm-10">
            {$form.account_request_date.html|default:'None'}
        </div>
    </div>

      <div class="row form-group form-inline">
       <label class="col-sm-2">
           {$form.Pending_approval.label|default}
           {if $form.Pending_approval.required|default}
               <span style="color: red">*</span>
           {/if}
      </label>
      <div class="col-sm-10">
          {$form.Pending_approval.html|default}
      </div>
  </div>
  <div class="row form-group form-inline">
   <label class="col-sm-2">
       {$form.PermID_Group.label}
       {if $form.PermID_Group.required|default}
           <span style="color: red">*</span>
       {/if}
  </label>
  <div class="col-sm-10 col-xs-12">
      <div>
          {$form.PermID_Group.html}
      </div>
  </div>
</div>
<div class="row form-group form-inline">
    <label class="col-sm-2">
        {$form.Supervisors_Group.label}
        {if $form.Supervisors_Group.required|default}
            <span style="color: red">*</span>
        {/if}
  </label>
  <div class="col-sm-10 col-xs-12">
      <div>
        {$form.Supervisors_Group.html}
    </div>
</div>
</div>
<div class="row form-group form-inline">
   <div class="col-sm-2">
      <input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit" />
  </div>
  <div class="col-sm-2">
    <input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset"/>
</div>
<div class="col-sm-2">
  <input class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl|default}/user_accounts/'" value="Back" type="button" />
</div>
{if $can_reject}

<div class="col-sm-2">
    <input type=hidden id ="UserID" value="{$form.UserID.html}">
    <input class="btn btn-sm btn-primary col-xs-12" value="Reject User" type="button" id="btn_reject"/>
    </div>
    {/if}
</div>
</form>
