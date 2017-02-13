<form action="{$baseurl}/login/lostpassword/" target="_self" method="post">
	<div class="row">
		<div class="col-xs-12">
			<div class="col-sm-2 col-xs-3 col-sm-offset-2">
				<img src="{$baseurl}/images/LORIS_logo.svg" class="img-responsive" alt="Responsive image" align="left" onerror="this.src='{$baseurl}/images/LORIS_logo.png'">
			</div>
			<div class="col-sm-6 col-xs-9">
				{if $error_message}
					<div class="form-group has-error">
                        <label class="control-label">
                            {$error_message}
                        </label>
                    </div>
				{/if}
				{if $confirm}
					<div class="form-group has-success">
					  	<label class="control-label">
					  		{$confirm}
					  	</label>
					</div>
				{/if}
				Please enter your username below, and a new password will be sent to you.<br><br>
				<div class="form-group">
					<label class="col-xs-2">
                        User:
                    </label>
                    <div class="col-xs-6">
                        <input class="form-control input-sm" tabindex="1" type="text" size="40" name="username" />
                    </div>
                    <div class="col-xs-4">
                        <input class="btn btn-sm btn-primary col-xs-12" type="submit" name="submit" value="Submit" class="button" />
                    </div>
	  			</div>
	  			<br>
	  			<div class="col-xs-10 col-xs-offset-2">
	  				<a href="{$baseurl}/main.php">Return to login screen</a>
	  			</div>
	  			
			</div>
			<div class="col-xs-4 col-xs-offset-5">
				<br>Created by <a href="http://mcin-cnim.ca" target="_blank">MCIN</a>
			</div>
			<div class="col-xs-4 col-xs-offset-4  ">
				Developed at <a href="http://www.mni.mcgill.ca" target="_blank">Montreal Neurological Institute and Hospital</a>
	  		</div>
		</div>
	</div>
</form>
