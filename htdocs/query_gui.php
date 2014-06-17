<?php
/**
 * @package main
 * @subpackage query_gui
 */
ini_set('default_charset', 'utf-8');
ob_start('ob_gzhandler');

// start benchmarking
require_once 'Benchmark/Timer.php';
$timer = new Benchmark_Timer;
$timer->start();

// load the client
require_once 'NDB_Client.class.inc';
$client = new NDB_Client;
$client->initialize();
$config =& NDB_Config::singleton();
$css = $config->getSetting('css');
$studyTitle = $config->getSetting('title');

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <link rel="stylesheet" href="<?php if(!$css){ print main.css; } else { print  $css; }?>" type="text/css" />
    <script src="js/jquery/jquery-1.4.2.min.js"></script>
    <script src='dqgui_core.js'></script>
    <script src='dqgui_step1.js'></script>
    <script src='dqgui_step2.js'></script>
    <script src='dqgui_step3.js'></script>
    <script src='dqgui_step4.js'></script>

    <link type="text/css" href="css/jqueryslidemenu.css" rel="Stylesheet" />
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery/jqueryslidemenu.js"></script>


    <link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
    <title><?php print  $studyTitle; ?> - Data Query GUI</title>
</head>
<body onload='initialize();' style='font-face:Arial;'>
<div>
<table width="100%" border="0" cellpadding="5" cellspacing="0"><tr><th background="images/title_background.jpg" class="banner" colspan="2" align="left"><strong>Query GUI - <?php print $studyTitle; ?></strong></th></tr></table>
    
    <p>
    <table border=0 style='border:none;padding-left:0px;' width="100%" cellspacing="0" cellpadding="10">
    <tr>
        <td width="19%" align='center' class="button" id='step1Title' onclick='setStepDiv(1)'>Define Variables</td>
        <td width="19%" align='center' class="button" id='step2Title' onclick='setStepDiv(2)'>Define Population</td>
        <td width="19%" align='center' class="button" id='step3Title' onclick='setStepDiv(3)'>Download Spreadsheet</td>
        <td width="5%"  style='border-top:none;border-bottom:none;'>&nbsp;</td>
        <td width="19%" align='center' class="button" style='font-weight:bold;' id='step4Title' onclick='setStepDiv(4)'>Save/Load Query</td>
        <!--td width="19%" align='center' class="button" id='toggleModeTitle' onclick='toggleMode()'>Go to <span id="toggleModeText">Advanced Mode</span></td-->
     </tr>
    </table>
</div>
<p>
<div id='step1Div' style="display:none;">
    <div>
        <form>
            <table style='border:2px black solid;' border="0" width='100%' cellspacing='0' cellpadding='5'>
                <tr>
                    <td style='border-bottom:1px black solid; width:20%' align='left'><b>Select Variables</b></td>
                    <td style='border-bottom:1px black solid' align='left'>
                        <select name='category' id='fieldCategorySelect' onchange='changeCategory("fields",this.options[this.selectedIndex].value)'>
                        <option value='none'>Select a category</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td id='fieldsSelectCell' align='left' valign='top' style='font-size:small;height:210px' width="100%" colspan=2>
                    <div id='fieldsSelectDiv_none' name="fieldsSelectDiv" style='display:block'>
                     Select a category from the drop down above.
                    </div>
                    </td>
                </tr>
            </table>
        </form>
    </div>
     <div style='height:480px;border:2px black groove;'>
        <table width=90% border=0 cellspacing=0 cellpadding=5>
        <tr>
                <td colspan=3 style='border:0px;'><b>Selected Variables</b></td>
            </tr>
            <tr>
                    <td width="19%"><i>Category</i></td>
                    <td width="24%"><i>Variable Name</i></td>
                    <td width="67%"><i>Description</i></td>
            </tr>
         </table>
         <div style='border-top:1px black solid;height:430px;overflow:auto'>
         <table class="fancytableleft" width="97%" border=0 id='selectedFieldsTable' cellspacing=0 cellpadding=0 valign=top>
                <tbody style='font-size:small;'>
                    <tr id='noFieldsSelectedRow'>
                        <td colspan=3 style='border-bottom:1px black solid;' valign=top>No Variables Selected</td>
                    </tr>
                </tbody>
        </table>
        </div>
     </div>
</div>

<div id='step2Div' style='display:none'>
    <div>
        <form>
            <table style='border:2px black solid;border-bottom:1px black solid;' border=0 width=100% cellspacing=0 cellpadding=5>
                <tr>
                    <td style='border-bottom:1px black solid; width:20%' align='left'><b>Select Limiters</b></td>
                    <td style='border-bottom:1px black solid' align='left'>
                        <select name='category' id='conditionalCategorySelect' onchange='changeCategory("conditionals", this.options[this.selectedIndex].value)'>
                        <option value='none'>Select a category</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td id='conditionalsSelectCell' align='left' valign='top' style='font-size:small;height:185px;' colspan=2>
                    <div id='conditionalsSelectDiv_none' name="conditionalsSelectDiv" style='display:block'>
                     Select a category from the drop down above.
                    </div>
                    </td>
                </tr>
            </table>
            <table border=0 style='border:1px black solid;border-top:none;' width=100% cellspacing=0 cellpadding=5>
            <tr><td><input type='button' value='Add Checked Limiters' onclick='addCheckedConditionals();'></td></tr>
            </table>
        </form>
    </div>
     <div style='border:2px black solid;padding:0px;'>
        <table width=100% border=0 cellspacing=0 cellpadding=5>
        <tr>
            <td colspan=3 style='border:0px;'><b>Selected Limiters</b></td>
        </tr>
        </table>
        <div style='height:235px;overflow:auto;'>
        <table width="100%" border=0 id='selectedConditionalsTable' cellspacing=0 cellpadding=5>
            <tbody style='font-size:small;'>
                <tr>
                <td id='conditionalsGroup_0' valign='top'>
                <input type='hidden' name='groupSelectRadio' id='groupSelectRadio' value='0' checked style='margin-right:10px;'>
                <input type='hidden' value='Main Group'>
                <!--select onchange='changeGroupOperator(this)'><option>AND</option><option>OR</option></select-->
                <hr style='margin-left:-5px;margin-right:-5px;' noshade size=1 color="black">
                </td>
                </tr>
                </tbody>
                </table>
        </div>
        <table border=0 style='border-top:1px black solid' width=100% cellpadding=5 cellspacing=0>
                <tr>
                    <td><input name='conditionalsSideButtons' type='button' value='Group Checked' onclick='groupButton()' disabled>
                    &nbsp;<input name='conditionalsSideButtons' type='button' value='UnGroup Checked' onclick='unGroupButton()' disabled>
                    &nbsp;&nbsp;&nbsp;&nbsp;<input name='conditionalsSideButtons' type='button' value='Move Checked to Group' onclick='groupTargetButton()' disabled>
                    &nbsp;&nbsp;&nbsp;&nbsp;<input name='conditionalsSideButtons' type='button' value='Remove Checked' onClick='removeCheckedButton()' disabled></td>
                </tr>
        </table>
     </div>
</div>

<div id='step3Div' style='display:none;height:580px;'>
<table border=0 style='border:2px black solid;' width=100% cellspacing=0 cellpadding=5>
<tr>
<td><b>Select Output Format</b></td>
</tr>
<tr>
<td><select id='outputFormat' name='outputFormat'>
                        <option value='xls'>Excel</option>
                        <option value='csv'>Comma Delineated</option>
                        <option value='tab'>Tab Delimited</option>
                        <option value='html'>Display</option>
                        </select>
</td></tr>
<tr>
<td>
<input type='button' value='Click here for your results' onclick='executeQuery()'>
<?
$user = User::singleton();
if($user->hasPermission('download_files')) {
?>
<input type='button' value='Click here to download files' onclick="executeQuery('download')"><span id="message">&nbsp;</span>
<?
}
?>
</td>
</tr>
</table>
<p>
<div id='thang'></div>
</div>

<div id='step4Div' style='height:580px;'>

<table width=100%  style='border:2px black solid;' border=0>
<tr>
<td><b>Save Query</b></td>
</tr>
<tr>
<td>Name</td><td>Save Variables</td><td>Save Population</td><td>&nbsp;</td></tr>
<tr>
<td><input type='text' id='saveName'></td>
<td><input type='checkbox' id='saveFields'></td>
<td><input type='checkbox' id='saveConditionals'></td>
<td align='left' width=70%><input type='button' value='Save' class="button" onclick='saveQuery();'></td>
</table>
<p>

<div style='height:460px;border:2px black solid;'>
        <table width='100%' border=0 cellspacing=0 cellpadding=5>
        <tr>
                <td colspan=5 style='border:0px;'><b>Saved Queries</b></td>
            </tr>
            <tr>
                <td width="40%" style='border-bottom:1px black solid'>Name</td>
                <td width="15%" style='border-bottom:1px black solid'>Variables</td>
                <td width="15%" style='border-bottom:1px black solid'>Population</td>
                <td width="15%" style='border-bottom:1px black solid'>Both</td>
                <td width="15%" style='border-bottom:1px black solid'>Options</td>
            </tr>
         </table>
         <div style='border-top:1px black solid;height:400px;overflow:auto'>
         <table width="100%" border=0 id='queryListTable' cellspacing=0 cellpadding=5 valign=top>
                <tbody style='font-size:small;'></tbody>
        </table>
        </div>
     </div>

</div>
</body>
</html>
