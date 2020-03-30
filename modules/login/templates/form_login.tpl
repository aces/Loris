<script src="{$baseurl}/js/passwordVisibility.js" type="text/javascript"></script>

<div class="container">
  <div class="row">
    <section class="col-md-4 col-md-push-8">
      <div class="panel panel-default login-panel">
        <div class="panel-heading">
          <h3 class="panel-title">Login to LORIS</h3>
        </div>
        <div class="panel-body">
          {if $study_logo}
            <section class="study-logo">
              <img src="{$baseurl}/{$study_logo}" alt="{$study_title}"/>
            </section>
          {/if}
          <form method="POST" action="{$action}">
            <div class="form-group">
              <input type="text" name="username" class="form-control" placeholder="Username" value="{$username}"/>
            </div>
            <div class="form-group">
              <div class="pwd-container">
                <input type="password" name="password" class="form-control" id="pwd-input" placeholder="Password" aria-describedby="helpBlock" />
                <button class="btn btn-link" type="button" onclick="togglePwd()">
                  <i id="pwd-icon" class="glyphicon glyphicon-eye-open"></i>
                </button>
              </div>
              {if $error_message}
                <span id="helpBlock" class="help-block">
                    <b class="text-danger">{$error_message}</b>
                </span>
              {/if}
            </div>
            <div class="form-group">
              <input type="submit" name="login" class="btn btn-primary btn-block" value="Login" />
            </div>
          </form>
          <div class="help-links">
            <a href="{$baseurl}/login/password-reset/">Forgot your password?</a><br/>
            <a href="{$baseurl}/login/request-account/">Request Account</a>
          </div>
          <div class="help-text">
            A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)
          </div>
        </div>
      </div>
    </section>
    <section class="col-md-8 col-md-pull-4">
      <div class="panel panel-default study-panel">
        <div class="panel-heading">
          <h3 class="panel-title">{$study_title}</h3>
        </div>
        <div class="panel-body">
          <section class="study-description">
            <p>{$study_description}</p>
          </section>
        </div>
      </div>
    </section>
  </div>
</div>