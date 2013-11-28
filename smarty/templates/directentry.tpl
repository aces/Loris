<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="direct.css" type="text/css" />
<link rel="stylesheet" href="{$css}" type="text/css" />
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<title>{$study_title}</title>

<link type="text/css" href="css/jquery-ui-1.8.2.custom.css" rel="Stylesheet" />	
<script src="js/jquery/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery/jquery-ui-1.8.2.custom.min.js"></script>
<script type="text/javascript" src="js/modules/direct_entry.js"></script>

{if $test_name_js}
<script type="text/javascript" src="{$test_name_js}"></script>
{/if}
</head>

<body>
{if $dynamictabs neq "dynamictabs"}
<table border="0" cellpadding="3" cellspacing="2" width="100%" class="mainlayout">
    <tr>
        <th align="left" background="images/title_background.jpg" class="banner" colspan="2">
            {$study_title}
        </th>
    </tr>

    <tr>
    <!-- user info table -->
         <td width="50%" colspan="2" valign="bottom" align="left" nowrap="nowrap" class="controlPanelSection">
            Date: {$smarty.now|date_format:"%B %e %Y"}
            Page {$pageNum} of {$totalPages}
        </td>
    </tr>
    <tr>
        <!-- main page table tags -->
        <td width="100%" class="tabox" valign="top">

            <!-- Start workspace area -->
<!--h1 align="right"><a href="javascript:open_help_section()" ><u>Help</u></a>  </h1-->
{/if}
{if $error_message != ""}
            <p>The following errors occured while attempting to display this page:

            <ul>
    {section name=error loop=$error_message}
                <li><strong>{$error_message[error]}</strong></li>
    {/section}
            </ul>
            
            If this error persists, please report a bug using <a target="mantis" href="{$mantis_url}">Mantis</a>.</p>
            <p><a href="javascript:history.back(-1)">Please click here to go back</a>.</p>
{else}

        <!-- included file -->
<table width="90%"><tr><td>
{$workspace}
</td></tr>
{if ($nextpage || $prevpage) && !$complete}
<tr>
    <td>
    {if $prevpage}
        {if $prevpage eq 'top'}
            <button onclick="window.location='?key={$key}'">Go Back</button>
        {else}
            <button onclick="window.location='?key={$key}&pageNum={$prevpage}'">Go Back</button>
        {/if}
    {/if}

    {if $nextpage} 
    <button id="savecontinue">
        <span style="display: none" id="nextpage">{$nextpage}</span>
        <span style="display: none" id="key">{$key}</span>
        Save And Continue
    </button>
    {else}
    <br />
    <p>
    <b>You must click below to save this page and submit data to the study. Please note that once you submit data you can not modify your answers.</b>

    </p>
    <div>
    <button id="complete">
        <span style="display: none" id="key">{$key}</span>
        Save and Submit Data
    </button>
    </div>
    {/if}
    </td>
</tr>
{/if}
</table>
{/if} 
        </td>
    </tr>
</table>

</body>
</html>
