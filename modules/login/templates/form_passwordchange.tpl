<div class="container">
  <div class="panel panel-default panel-center">
    <div class="panel-heading">
      <h3 class="panel-title">{$page_title}</h3>
    </div>
    <div class="panel-body">
      <p><b>Password Strength Rules</b></p>
      <ul>
        <li>The password must be at least 8 characters long</li>
        <li>The password must contain at least 1 letter, 1 number and 1 character from !@#$%^*()</li>
        <li>The password and the user name must not be the same</li>
        <li>The password and the email address must not be the same</li>
      </ul>
    </div>
    <form method="post">
      <div class="form-group">
          {$form.password.html}
          {if $form.password.error}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.password.error}</b>
            </span>
          {/if}
      </div>
      <div class="form-group">
          {$form.confirm.html}
          {if $form.confirm.error}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.confirm.error}</b>
            </span>
          {/if}
      </div>

      <div class="form-group">
        <input type="submit" name="Submit" class="btn btn-primary btn-block"
               value="Save"/>
      </div>
      <div>
          {$form.token.html}
          {$form.username.html}
      </div>
    </form>
  </div>
</div>

