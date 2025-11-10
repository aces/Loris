{* We use printf for the strings that include variables so
   that they can be translated in the .po files before the
   variable interpolation *}
<h3 class="welcome">{sprintf(dgettext("dashboard", "Welcome, %s!"), $username)}</h3>
<p class="pull-right small login-time">{dgettext("dashboard", "Last login:")} {$last_login}</p>
<p id="project-description" class="project-description"></p>
<script src="/dashboard/js/welcome.js"></script>
