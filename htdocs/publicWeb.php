<?php
/**
 * main GUI php script
 * @package garbage
 */
ob_start('ob_gzhandler');

// start benchmarking
require_once "Benchmark/Timer.php";
$timer = new Benchmark_Timer;
$timer->start();

// PEAR::Config
require_once "Config.php";

// define which configuration file we're using for this installation
$configFile = "../config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(PEAR::isError($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config =& $configObj->toArray();
$config = $config['config'];
unset($configObj, $root);

$timer->setMarker('Loaded config');

// require all relevant OO class libraries
require_once "Database.class.inc";
require_once "SinglePointLogin.class.inc";
require_once "State.class.inc";
require_once "User.class.inc";
require_once "Site.class.inc";

require_once "Candidate.class.inc";
require_once "NDB_BVL_Battery.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "NDB_BVL_InstrumentStatus.class.inc";
require_once "NDB_BVL_InstrumentStatus_ControlPanel.class.inc";
require_once "TimePoint.class.inc";
require_once "TimePoint_ControlPanel.class.inc";
require_once "Utility.class.inc";

require_once "Smarty_hook.class.inc";
require_once "NDB_BVL_Feedback.class.inc";

$timer->setMarker('Required libraries');

// start php session
session_start();

// if exiting, destroy the php session
if($_REQUEST['logout']) {
    session_destroy();
    session_start();
}

$timer->setMarker('Started session');

/*
 * new DB Object
 */
$DB =& Database::singleton($config['database']['database'], $config['database']['username'], $config['database']['password'], $config['database']['host']);
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}



if ($seeBattery == 'View Battery') {

if (!empty($dobM) && !empty($dobD) && !empty($dobY))  $checkDateofBirth = checkdate($dobM, $dobD, $dobY); 
if (!empty($mriM) && !empty($mriD) && !empty($mriY))  $checkDateofVisit = checkdate($mriM, $mriD, $mriY);

  if ($checkDateofVisit == FALSE || $checkDateofBirth == FALSE) 
    { 
      echo "<FONT color='red'>invalid date</FONT><BR>";
      if ($checkDateofVisit == FALSE) { echo $dobY . ", " . $dobM . ", " . $dobD . "<BR>";}
      if ($checkDateofBirth == FALSE) { echo $mriY . ", " . $mriM . ", " . $mriD . "<BR>"; }
      echo "<BR>";
    } 
  else 
    {
      if ($objective != 1 && $objective != 2) 
        {
          if ($objective == 'objective') { echo "<FONT color='red'>please select Study Objective</FONT><BR>"; }
          echo "<BR>";
        } 
      else 
        {
          $dateBirthArray = array("$dobY", "$dobM", "$dobD");
          $dateBirth = implode($dateBirthArray, "-");
          $dateVisitArray = array("$mriY", "$mriM", "$mriD");
          $dateVisit = implode($dateVisitArray, "-");

          $ageCalculateQuery  = "SELECT ROUND(((to_days('$dateVisit') - to_days('$dateBirth'))/365)*12)";
          $ageCalculateResult = $DB->selectOne($ageCalculateQuery);

          if ($ageCalculateResult != '' && $objective == '2')
            { 
              if ($ageCalculateResult >= 53) 
                {
                  echo "<FONT color='red'>The child is $ageCalculateResult months old, thus Objective 2 is not valid</FONT> <BR>";
                } 
              else 
                {
                  $showTests = 1;
                } // end ($ageCalculateArray[0] >= 60)
            } //end ($ageCalculateArray[0] != '' && $objective == '2')

          if ($ageCalculateResult != '' && $objective == '1') 
            {
              if ($ageCalculateResult < 54) 
                {
                  echo "<FONT color='red'>The child is $ageCalculateResult months old, thus Objective 1 is not valid</FONT><BR>";
                } 
              else 
                {
                  $showTests = 1;
                }
            }
        }
    }


  if ($showTests == 1) 
    {
      // issue query to get the list of tests from DB NIH_PD
      // array the result into $test_name and $months
      $query = "
          SELECT t.Full_name, n.Months, n.Screening
          FROM tests as n, test_names as t
          WHERE t.Test_name = n.Test_name
          AND n.Months = ROUND(((to_days('$dateVisit') - to_days('$dateBirth'))/365)*12)
          AND n.Objective = '$objective' AND n.Active = 'Y' 
          ORDER BY n.Screening DESC, t.Full_name
          ";
      $result = mysql_query($query) or die (mysql_error());
      $i=0;
      while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) 
        {
          $test_name[$i] = $row["Full_name"];
          $months[$i]    = $row["Months"];
          $test_type[$i] = $row["Screening"];
          $i++;
        }
      //free result from query
      mysql_free_result($result);    
    }

  // close connection to DB server


} // if($seeBatttery...)

function make_select($field_name, $options, $preselected='', $labels='', $tabindex='')
// $field_name is the name of the select menu (name=$field_name)
// $options is the array of elements of the select (values)
// $preselected is an optional arg, allows a particular option (by value, not label) to be preselected
// $labels is an optional arg, it is an array of labels for the options. (should be equal size to $options)
{
  echo "<select name=\"$field_name\"";
  if (!empty($tabindex)) echo " tabindex=\"$tabindex\"";
  echo ">\n";
  foreach($options AS $option)
    {
      $selected = $option==$preselected ? 'selected' : '';

      if(is_array($labels)) {list($k,$label) = each ($labels);}
      else {$label = '';}
      if($label=='') {$label = $option;}
      echo "<option value=\"$option\" $selected>$label</option>\n";
    }
  echo "</select>\n";
}



//////////////////
// START HTML
//////////////////
echo "<HTML>";
echo "<TITLE> public web scripts</TITLE>";
echo "<BODY>";

echo "EXPECTED INSTRUMENT BATTERY LOOKUP<BR>";
echo "<HR>";


echo "<TABLE border=0 align='center' valign='top' cellpadding=3 cellspacing=5><TR><TD valign='top'>";

echo "<TABLE height=100% align='center' valign='top' border=0 cellpadding=2 cellspacing=2><TR bgColor='#D3DCE3'><TH colspan=2>";
echo "<FORM>";
echo "Please select the Date of Birth, Date of MR Scan, and a Study Objective";
echo "</TH>";

echo "</TR><TR>";
echo "<TD>1. Date of Birth (or EDC)</TD>";
echo "<TD align='right'>";
$today = getdate(time());
make_select('dobY', array_merge(array(''), range(1983, $today['year'])), $dobY);
make_select('dobM', array_merge(array(''), range(1,12)), $dobM, array('Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'));
make_select('dobD', array_merge(array(''), range(1,31)), $dobD);

echo "</TD>";
echo "</TR><TR>";
echo "<TD>2. Date of MR Scan</TD>";
echo "<TD align='right'>";
make_select('mriY', array_merge(array(''), range(2001, 2006)), $mriY);
make_select('mriM', array_merge(array(''), range(1,12)), $mriM, array('Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'));
make_select('mriD', array_merge(array(''), range(1,31)), $mriD);
echo "</TD>";
echo "</TR><TR>";
echo "<TD>3. Study Objective</TD>";
echo "<TD align='right'><SELECT name='objective'>";
if (isset($objective)) {
    echo "<option value='$objective'> Objective $objective";
} else {
    echo "<option value='objective'> Select Objective";
}
echo "<OPTION value=1> Objective 1";
echo "<OPTION value=2> Objective 2";
echo "</SELECT></TD>";
echo "</TR><TR>";
echo "<TD align='center' colspan=2><INPUT type='submit' name='seeBattery' value='View Battery'>";
echo "</FORM>";
echo "</TD></TR></TABLE>";

echo "<a href=\"javascript:window.close();\">Close This Window</a>";


echo "</TD><TD>";

if ($months[0] == '') { echo "&nbsp"; } else {

  // define group titles
  $title[2] = "Instruments Administered Prior/During the Hospital Visit<BR>NOTE: This part of battery of instruments is defined at the time of Screening";  // H
  $title[3] = "Instruments Administered to Parent During the Hospital Visit";    // Y
  $title[4] = "Instruments Administered to Candidate During the Hospital Visit"; // N

  echo "<TABLE valign='top' border=0 cellpadding=2 cellspacing=2><TR bgColor='#D3DCE3'>";
  echo "<TH width=70><u>Objective</u></TH><TH><u>Age (months)</u></TH><TH>Date of Birth</TH><TH>Date of Visit</TH>";
  echo "</TR><TR>";
  echo "<TD align='center'>$objective</TD><TD align='center'>" . $months[0] . "</TD><TD align='center'>$dateBirth</TD><TD align='center'>$dateVisit</TD>";
  for ($i=0; $i<sizeof($test_name); $i++) {

    if ($i == 0 || ($i > 0 && $test_type[$i] != $test_type[$i-1]))
      {
        echo "<TR></TR>";
        echo "<TD align='center' bgColor='#D3DCE3' colspan=4>";
        if     ($test_type[$i] == 'H') { print $title[2]; }
        elseif ($test_type[$i] == 'Y') { print $title[3]; }
        else                           { print $title[4]; }
      }
    $j = $i+1;
    echo "</TR><TR bgColor = $rowColor>";
    echo "<TD align='center'>" . $j . ") </TD>";
    echo "<TD colspan=3><NOBR>" . $test_name[$i] . "</NOBR></TD>";
  }
  echo "</TR></TABLE>";
}

echo "</TD></TR></TABLE>";




//////
////// END HTML
//////
echo "</BODY></HTML>";

// unset all vars
unset ($i);
unset ($j);
unset ($test_name);
unset ($months);
unset ($userID);
unset ($user_password);
unset ($database);
unset ($host);
unset ($candID);
unset ($PSCID);
unset ($scoreID);
unset ($reportID);
unset ($dateVisit);
unset ($dateBirth);
unset ($objective);

?>
