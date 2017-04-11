<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<link rel='stylesheet' href='{$baseurl}/../../{$css}' type='text/css' />
<link type='text/css' href='{$baseurl}/../../css/loris-jquery/jquery-ui-1.10.4.custom.min.css' rel='Stylesheet' />
<link rel='stylesheet' href='{$baseurl}/../../bootstrap/css/bootstrap.min.css'>
<link rel='stylesheet' href='{$baseurl}/../../bootstrap/css/custom-css.css'>

<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="{$baseurl}/images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<title>Acknowledgements</title>
<!--  end page header -->
</head>

<body>
<br/>
<div align="center">
    <a class='btn btn-primary' href="/acknowledgements/acknowledgements.php?{$query_str|escape:'quotes'}&csv=true">Download as CSV</a>
</div>
<br/>
<div id="tabs" style="background: white">
    <div class="tab-content">
        <div class="tab-pane active">
            <table class='table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable' border='0'>
                <thead>
                    <tr class='info'>
                        <th>Full Name</th>
                        <th>Citation Name</th>
                        <th>Affiliations</th>
                        <th>Degrees</th>
                        <th>Roles</th>
                        <th>Present?</th>
                    </tr>
                </thead>
                {foreach from=$arr key=k item=v}
                    <tr> 
                        <td>{$v->full_name}</td>
                        <td>{$v->citation_name}</td>
                        <td>{$v->affiliation_str}</td>
                        <td>{$v->degree_str}</td>
                        <td>{$v->role_str}</td>
                        <td>{$v->in_study_at_present_str}</td>
                    </tr>
                {/foreach}
            </table>
        </div>
    </div>
</div>
<br>

<div align="center">
    <a class='btn btn-primary' href="/acknowledgements/acknowledgements.php?{$query_str|escape:'quotes'}&csv=true">Download as CSV</a>
</div>

</body>

</html>