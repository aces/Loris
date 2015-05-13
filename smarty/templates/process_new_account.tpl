<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="{$baseurl}/{$css}" type="text/css" />
    <link rel="stylesheet" href="../bootstrap-3.1.1/css/bootstrap.css">
    <!-- shortcut icon that displays on the browser window -->
    <link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
    <!-- page title -->
    <title>Request LORIS Account</title>
    <!--  end page header -->
</head>
<body>

<div class ="logo">

</div>

<div class="navbar navbar-default" role="navigation" style="height:90px">
        <div class="navbar-brand"  style="align:center;">
            {if $study_logo}
                <img src="{$study_logo}" border="0" width="64" height="57" />
            {/if}
            {$study_title}
        </div>
</div>
<div class="container">

<div class="row panel panel-default col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
    <div class="panel-body">
        <div class="col-xs-12">
            <center>
                <img src="{$baseurl}/images/LORIS_logo_141007.svg" class="img-responsive" alt="Responsive image" onerror="this.src='{$baseurl}/images/LORIS_Logo_141007.png'" align="middle" width="92%">
            </center>
            <br>
        </div>
        <div class="hidden-xs hidden-sm">
            <br><br><br><br>
        </div>
        {if not $success}

        <div class="col-xs-12">
            {if $error_message != ""}
                <p>The following errors have occured while submitting form :

                <ul>
                    {section name=error loop=$error_message}
                        <li><strong>{$error_message[error]}</strong></li>
                    {/section}
                </ul>
            {/if}
        </div>
        {/if}

        <div class="row">
            <div class="col-xs-12">
                <form action="{$action}" method="post">
                    <div class="form-group">
                        <input name="name" class="form-control" type="text" id="name" size="20" placeholder="First Name" required/>
                    </div>
                    <div class="form-group">
                        <input name="lastname" class="form-control" type="text" id="lastname" placeholder="Last Name" required/>
                    </div>
                    <div class="form-group">
                        <input name="from" class="form-control" type="email" id="from" placeholder="Email Address" required />
                    </div>
                    <div class="form-group">
                        <input name="from2" class="form-control" type="email" id="from2" placeholder="Confirm Email Address" required/>
                    </div>
                    <div class="form-group" align="center">

                            <input name="verif_box"  type="text" id="verif_box" placeholder="Type verication code" required/>


                        <img src="verificationimage.php?num={$rand}" alt="verification image, type it in the box" width="50" height="24" align="absbottom" /><br />
                    </div>
                    <input class="btn btn-primary col-xs-12" name="login" type="submit" value="Submit" />
                    <br><br><br>
                </form>
            </div>
        </div>

    </div>
</div>
</div>


</body>

</html>
