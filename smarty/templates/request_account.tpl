<div class="panel panel-default reset-pass-panel">
  <div class="panel-heading">
    <h3 class="panel-title">
      {if $success}
        Account requested!
      {else}
        Request LORIS Account
      {/if}
    </h3>
  </div>
  <div class="panel-body">
  {if $success}
    <div class="request-account-success">
      <h1>Thank you!</h1>
      <p>Your request for an account has been received successfully.</p>
      <a href="/" class="btn btn-primary btn-block">
        Return to Login Page
      </a>
    </div>
  {else}
    <p class="text-center">
      Please fill in the form below to request a LORIS account.<br/>
      We will contact you once your account has been approved.
    </p>
    {if $error_message != ""}
      {section name=error loop=$error_message}
        <div class="alert alert-danger">
          {$error_message[error]}
        </div>
      {/section}
    {/if}
    <form action="/request-account/" method="POST"
          name="form1" id="form1">
      <div class="form-group">
        <input type="text" name="name" class="form-control" id="name" size="20"
               placeholder="First Name"/>
      </div>
      <div class="form-group">
        <input type="text" name="lastname" class="form-control" id="lastname"
               placeholder="Last Name"/>
      </div>
      <div class="form-group">
        <input type="text" name="from" class="form-control" id="from"
               placeholder="Email"/>
      </div>
      <div class="form-group">
        <select class="form-control" name="site" id="site">
          <option value="">Choose Site</option>
          {foreach from=$site_list item=site key=idx}
            <option value="{$idx}">{$site}</option>
          {/foreach}
        </select>
      </div>
      <div class="form-group">
        <label class="checkbox-inline">
          <input type="checkbox" name="examiner" id="examiner"/> Examiner Role
        </label>
        <label class="checkbox-inline">
          <input type="checkbox" name="radiologist" id="radiologist"/> Radiologist
        </label>
      </div>
      <div class="form-group">
        <input type="submit" name="Submit" class="btn btn-primary btn-block"
               value="Request Account"/>
      </div>
      <div class="form-group">
        <a href="/">Back to login page</a>
      </div>
    {/if}
  </div>
</div>