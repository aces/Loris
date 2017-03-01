<div class="container">
  <div class="panel panel-default panel-center">
    <div class="panel-heading">
      <h3 class="panel-title">{$page_title}</h3>
    </div>
    <div class="panel-body">
      {if $success}
        <div class="success-message">
          <h1>Thank you!</h1>
          <p>{$success}</p>
          <a href="/" class="btn btn-primary btn-block">
            Return to Login Page
          </a>
        </div>
      {else}
        <form method="POST">
          <p class="text-center">
            Please enter your username below, and a new password will be sent to you.
          </p>
          <div class="form-group">
		{$form.username.html} 
                {if $form.username.error}
                <span id="helpBlock" class="help-block">
                   <b class="text-danger">{$form.username.error}</b>
                 </span>
                {/if}
          </div>
          <div class="form-group">
            <input type="submit" name="submit" class="btn btn-primary btn-block"
                   value="Reset"/>
          </div>
          <div class="form-group">
            <a href="/">Back to login page</a>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>

