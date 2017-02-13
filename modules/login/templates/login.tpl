<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-sm-push-6 col-md-5 col-md-push-7">
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="col-xs-12">
            <center>
              <img src="{$baseurl}/images/LORIS_logo.svg" class="img-responsive" alt="Responsive image" onerror="this.src='{$baseurl}/images/LORIS_logo.png'" align="middle" width="85%">
            </center>
            <br>
          </div>
        <div class="hidden-xs hidden-sm">
          <br><br><br><br>
        </div>
        <div class="col-xs-12">
          <font color="red" align="middle" id="error">
            {$error_message}
          </font>
        </div>
        <div class="row">
          <form action="{$baseurl}/login/" method="post">
            <div class="col-xs-12">
              <div class="form-group">
                <input id="username" name="username" class="form-control" type="text" value="{$username}" placeholder="User"/>
              </div>
              <div class="form-group">
                <input id="password" name="password" class="form-control" type="password" placeholder="Password"/>
              </div>
              <input class="btn btn-primary col-xs-12" id="loginAPI" name="login" type="submit" value="Login" />
              <br><br><br>
              <a href="{$baseurl}/login/lostpassword"><center>Forgot your password?</center></a>
              <a href="{$baseurl}/login/requestaccount"><center>Request Account</center></a>
            </div>
          </form>
        </div>
        <div class="row">
          <table class="LorisFooter" align="center">
            <tr>
              <hr width = 70%>
                <td width="100%">
                  {if $studylinks}
                  <center>
                    <ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;">
                      <li id="active">|</li>
                      {foreach from=$studylinks item=link}
                      <li><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> | </li>
                      {/foreach}

                      </ul>
                      </center>
                      {/if}
                      </td>
                      </tr>
                      <tr>
                      <br>
                      <td align="center" colspan="1">A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)</td>
                      </tr>
                      <tr>
                      <td align="center" colspan="1">Powered by LORIS &copy; {$currentyear}. All rights reserved.</td>
                      </tr>
                      <tr>
                      <td align="center" colspan="1">Created by <a href="http://mcin-cnim.ca" style="color: #064785" target="_blank">MCIN</a></td>
                      </tr>
                      <tr>
                      <td align="center" colspan="1">Developed at <a href="http://www.mni.mcgill.ca" style="color: #064785" target="_blank">Montreal Neurological Institute and Hospital</a></td>

                      </tr>
                  </table>
                  </div>
            </div>
      </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-sm-pull-6 col-md-7 col-md-pull-5">
        <div class="panel panel-default">
          <div class="panel-body">
            {$study_description}
          </div>
        </div>
      </div>
    </div>
</div>

