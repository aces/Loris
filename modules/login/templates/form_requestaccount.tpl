{if $captcha_key}
<script src="https://www.google.com/recaptcha/api.js"></script>
{/if}
<div class="panel panel-default panel-center">
  <div class="panel-heading">
    <h3 class="panel-title">
        {$page_title}
    </h3>
  </div>
  <div class="panel-body">
      {if $success|default}
    <div class="success-message">
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
    <form method="POST" name="form1" id="form1">
      <div class="form-group">
          {$form.firstname.html}
          {if $form.firstname.error|default}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.firstname.error}</b>
            </span>
          {/if}
      </div>
      <div class="form-group">
          {$form.lastname.html}
          {if $form.lastname.error|default}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.lastname.error}</b>
            </span>
          {/if}
      </div>
      <div class="form-group">
          {$form.from.html}
          {if $form.from.error|default}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.from.error}</b>
            </span>
          {/if}
      </div>
      <div class="form-group">
          {$form.site.html}
          {if $form.site.error|default}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.site.error}</b>
            </span>
          {/if}
      </div>
      <div class="form-group">
          {$form.project.html}
          {if $form.project.error|default}
            <span id="helpBlock" class="help-block">
              <b class="text-danger">{$form.project.error}</b>
            </span>
          {/if}
      </div>
      <div class="form-group">
          {$form.examiner.html}
          {* checkbox's html method in LORISForm seems to automagically add the label *}
      </div>
      <div class="form-group">
          {$form.radiologist.html}
      </div>
      <div class="form-group">
        {* Google reCaptcha. Don't display if a private key has not been configured *}
        {if $captcha_key}
{$form.captcha.html}
            <div class="g-recaptcha" data-sitekey="{$captcha_key}"></div>
            <script src="https://www.google.com/recaptcha/api.js?render={$captcha_key}&onload=onloadCallback nonce={$nonce}"></script>
            {if $form.captcha.error|default}
                <span id="helpBlock" class="help-block">
                  <b class="text-danger">{$form.captcha.error}</b>
                </span>
            {/if}
        {/if}
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
