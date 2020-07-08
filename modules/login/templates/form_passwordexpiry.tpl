<div class="container">
  <div class="panel panel-default panel-center">
    <div class="panel-heading">
      <h3 class="panel-title">Update Password</h3>
    </div>
    <div class="panel-body">
      <p><b>Password Strength Rules</b></p>
      <ul>
        <li>The password must be at least 8 characters long.</li>
        <li>The password and the user name must not be the same.</li>
        <li>The password and the email address must not be the same.</li>
      </ul>
        <p><b>Please choose a unique password.</b></p>
        <p>We suggest using a password manager to generate one for you.</p>
      <form method="post">
        <div class="form-group">
          <input type="password" name="password" size="40" class="form-control"
                 placeholder="New Password" value="{$password}" />
        </div>
        <div class="form-group">
          <input type="password" name="confirm" size="40" class="form-control"
                 placeholder="Confirm Password" value="{$password}" />
          {if $error_message}
            <span id="helpBlock" class="help-block">
                <b class="text-danger">{$error_message}</b>
              </span>
          {/if}
        </div>
        <div class="form-group">
          <input type="submit" name="expiry" class="btn btn-primary btn-block"
                 value="Save"/>
        </div>
        <input type="hidden" name="login" value="true" />
        <input type="hidden" name="username" value="{$username}" />
      </form>
    </div>
  </div>
</div>
