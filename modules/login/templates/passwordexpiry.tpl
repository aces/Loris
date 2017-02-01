<form action="{$baseurl}/login/passwordexpiry/" method="post">
    <div class="row">
        <div class="col-xs-12">
            <div class="col-sm-2 col-xs-3 col-sm-offset-2">
                <img src="{$baseurl}/images/LORIS_logo.svg" class="img-responsive" alt="Responsive image" align="left" onerror="this.src='{$baseurl}/images/LORIS_logo.png'">
            </div>
            <div class="col-sm-6 col-xs-9">
                <strong>
                    Password Strength Rules
                </strong>
                <ul>
                    <li>
                        The password must be at least 8 characters long
                    </li>
                    <li>
                        The password must contain at least 1 letter, 1 number and 1 character from !@#$%^&amp;*()
                    </li>
                    <li>
                        The password and the user name must not be the same
                    </li>
                    <li>
                        The password and the email address must not be the same
                    </li>
                </ul>
                <strong>
                    Update Password
                </strong>
                <br><br>
                <div class="col-xs-12">
                    {if $error_message}
                        <div class="form-group has-error">
                            <label class="control-label">
                                {$error_message}
                            </label>
                        </div>
                    {/if}
                    <div class="form-group col-xs-12">
                        <label class="col-xs-4">
                            New Password:
                        </label>
                        <div class="col-xs-6">
                            <input class="form-control input-sm" name="password" tabindex="1" type="password" />
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <label class="col-xs-4">
                            Confirm Password:
                        </label>
                        <div class="col-xs-6">
                            <input class="form-control input-sm" name="confirm" tabindex="2" type="password" />
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <div class="col-xs-4">
                            <input class="btn btn-sm btn-primary col-xs-12" name="expiry" value="Save" type="submit" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-4 col-xs-offset-5">
                <br>Created by <a href="http://mcin-cnim.ca" target="_blank">MCIN</a>
            </div>
            <div class="col-xs-4 col-xs-offset-4  ">
                Developed at <a href="www.mni.mcgill.ca" target="_blank">Montreal Neurological Institute and Hospital</a>
            </div>
        </div>
    </div>

<input type="hidden" name="login" value="true" />
<input type="hidden" name="username" value="{$username}" />

</form>

