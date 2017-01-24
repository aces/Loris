<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{$title}</title>
  <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="/css/login_layout.css">
  <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,700" rel="stylesheet">
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="pull-left">
        <a href="/">
          <img src="/images/LORIS_logo_white.svg" class="loris-logo" alt="Logo"/>
        </a>
      </div>
      <div class="pull-right">
        <a href="https://github.com/aces/Loris" target="_blank" class="gh-logo">
          <img src="/images/GitHub-Mark-Light-64px.png" alt="Github"/>
        </a>
      </div>
    </div>
  </header>

  <section class="main-content">
    {* Load appropriate page content, default to login page *}
    {if $page == 'password-reset'}
      {include file='password_reset.tpl'}
    {elseif $page == 'request_account'}
      {include file='process_new_account.tpl'}
    {else}
      {include file='login_new.tpl'}
    {/if}
  </section>

  <footer class="footer">
    Powered by <a href="http://www.loris.ca/" target="_blank">LORIS</a> {$version} &copy; {$currentyear}. All rights reserved.<br/>
    Developed at <a href="http://www.mni.mcgill.ca" target="_blank">Montreal Neurological Institute and Hospital</a>
    by <a href="http://mcin-cnim.ca" target="_blank">MCIN</a>
  </footer>
</body>
</html>