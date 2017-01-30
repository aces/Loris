<div class="row panel panel-default col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
<div class="panel-body">
{if not $success}
<div class="col-xs-12">
<div class="col-xs-12">
    <center>
    <img src="{$baseurl}/images/LORIS_logo.svg" class="img-responsive" alt="Responsive image" onerror="this.src='{$baseurl}/images/LORIS_logo.png'" align="middle" width="92%">
    </center>
    <br>
</div>
<center>
    <h2>Request Account</h2>
    <h3>Please fill in the form below.</h3>
    <h5> We will contact you once your account has been approved.</h5>
</center>
{if $error_message != ""}
    {section name=error loop=$error_message}
        <div class="alert alert-danger">
       {$error_message[error]}
        </div>
    {/section}
{/if}
<form action="{$baseurl}/login/requestaccount/" method="post" name="form1" id="form1" class="form-horizontal">
<div class="form-group">
    <label  class="col-sm-4 control-label" size="75">First Name:</label>
    <div class="col-sm-6">
        <input name="name" type="text" id="name" size="20" />
    </div>
</div>
<div class="form-group">
   <label class="col-sm-4 control-label">Last Name:</label>
    <div class="col-sm-6">
       <input name="lastname" type="text" id="lastname"/>
    </div>
</div>
<div class="form-group">
<label class="col-sm-4 control-label">Email Address: </label>
      <div class="col-sm-6">
         <input name="from" type="text" id="from"/>
     </div>
</div>
<div class="form-group">
    <label class="col-sm-4 control-label">Your site: </label>
    <div class="col-sm-6">
        <select name="site" id="site" style="width:156px;">
            <option value=""></options>
            {foreach from=$site_list item=site key=idx}
            <option value="{$idx}">{$site}</options>
                {/foreach}
        </select>
    </div>
</div>
    <div class="form-group">
        <label class="col-sm-4 control-label">Examiner Role: </label>
        <div class="col-sm-1">
            <input name="examiner" type="checkbox" id="examiner"/>
        </div>
        <label class="col-sm-4 control-label">Radiologist: </label>
        <div class="col-sm-1">
            <input name="radiologist" type="checkbox" id="radiologist"/>
        </div>
    </div>
<div class="form-group">
<label class="col-sm-4 control-label">Type verification code:</label>
 <div class="col-sm-6">
<input name="verif_box" type="text" id="verif_box" />
<img src="{$baseurl}/login/ajax/verificationimage.php?num={$rand}" alt="verification image, type it in the box" width="50" height="24" align="absbottom" /><br />
</div>
</div>
<div class="form-group">
            <div class="col-sm-offset-4 col-sm-10">
                <input name="Submit" class="btn btn-primary col-xs-4" type="submit" value="Submit"/>
            </div>
</div>
</form>
</div>
{/if}
</div></div>
