<?php
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();




header("Content-type: image/svg+xml");
print '<?xml version="1.0" standalone="no"?>';
$DB = Database::singleton();
if(isset($_REQUEST['InstrumentY'])) {
    $Instrument = $_REQUEST['InstrumentY'];
}
if(isset($_REQUEST['FieldY']) && !empty($_REQUEST['FieldY'])) {
    $Field = $_REQUEST['FieldY'];
} else {
    $Field = "Candidate_Age";
}
$QueryCondition = "$Field IS NOT NULL AND c.Active='Y' and c.Cancelled='N' and s.Active='Y' and s.Cancelled='N'";
if(isset($_REQUEST['site']) && !empty($_REQUEST['site'])) {
    $QueryCondition .= " AND c.CenterID=$_REQUEST[site]";

}
if(isset($_REQUEST['excludeunborn'])) {
    $QueryCondition .= " AND DATEDIFF(i.Date_taken, c.DoB) > 0";
}
if(isset($_REQUEST['Administration'])) {
    $QueryCondition .= " AND f.Administration='$_REQUEST[Administration]'";
}
if(isset($_REQUEST['Visit_label']) && !empty($_REQUEST['Visit_label'])) {
        $QueryCondition .= " AND s.Visit_label='$_REQUEST[Visit_label]'";
}
$QueryTable = "$Instrument i join flag f USING (CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c USING (CandID)";

$DB->selectRow("SELECT MIN(CAST($Field as Decimal)) as Min, MAX(CAST($Field as Decimal)) as Max FROM $QueryTable WHERE $QueryCondition", $minmax);
$Min = $minmax['Min'];
$Max = $minmax['Max'];
$DB->selectRow("SELECT MIN(DATEDIFF(i.Date_taken,c.DoB)) as Min, MAX(DATEDIFF(i.Date_taken, c.DoB)) as Max FROM $QueryTable WHERE $QueryCondition", &$minmax);
$MinDays = $minmax['Min'];
$MaxDays = $minmax['Max'];

$XMin = $MinDays;
$XMax = $MaxDays;
$YMin = $Min;
$YMax = $Max;

$DB->select("SELECT SubprojectID, AgeMinDays, AgeMaxDays FROM test_battery WHERE Active='Y' AND Test_name='$Instrument'", $ValidDays);
function CheckValidity($SubprojectID, $AgeDays) {
    global $ValidDays;
    foreach ($ValidDays as $row) {
        if($row['SubprojectID'] == $SubprojectID &&
            $row['AgeMinDays'] <= $AgeDays && $row['AgeMaxDays'] >= $AgeDays) {
            return 1;
        }
    }
    return 0;
}
function PlaceMarker($X, $Y, $params) {
    global $XMin, $XMax, $YMin, $YMax, $Instrument;
    $PercentOfY = ($Y-$YMin) / ($YMax-$YMin);
    $yval = 90 - 80*$PercentOfY;
    $PercentOfX= ($X - $XMin) / ($XMax-$XMin);
    $xval = 5 + 90*$PercentOfX;

    if(isset($params['colour'])) {
        $colour = $params['colour'];
    } else {
        $colour = "green";
    }
    print "<a xlink:href=\"/main.php?test_name=$Instrument&amp;commentID=$params[CommentID]&amp;sessionID=$params[SessionID]&amp;candID=$params[CandID]\" xlink:title=\"$params[PSCID] (Value: $Y, Age: $X )\">" . '<circle fill="' . $colour . '" cx="' . $xval . '%" cy="' . $yval . '%" r="3" />' . "</a>\n";
}

?>

<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg width="100%" height="100%" version="1.1"
xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

<g id="titles" text-anchor="middle" stroke="black" stroke-width="1">
<text x="50%" y="3.5%" font-size="1.5em" style="dominant-baseline: middle" text-anchor="middle">Scatterplot for <?print "$Instrument $Field"; ?> / Age</text>
<text x="50%" y="95%" style="dominant-baseline: middle" text-anchor="middle">Age (Days)</text>
<text y="3.5%" x="-100" style="dominant-baseline: middle" transform="rotate(-90, 0, 0)" text-anchor="end" ><?php print $Field; ?></text>
</g>
<g id="scale" stroke="black" stroke-width="1">
<line x1="5%" x2="95%" y1="90%" y2="90%" />
<line x1="5%" x2="5%" y1="89%" y2="91%" />
<line x1="95%" x2="95%" y1="89%" y2="91%" />

<?php 
/* Print the x scale */
$step = ($MaxDays-$MinDays) / 10;
foreach(range($MinDays, $MaxDays, $step) as $val) {
    $PercentOfMinMax = ($val-$MinDays) / ($MaxDays-$MinDays);
    $xval = 5+90*$PercentOfMinMax;
    print '<text x="' . $xval . '%" y="93%" style="dominant-baseline: top" text-anchor="middle">' . round($val) . '</text>';
}
    
/* Print the y scale */
$step = ($Max-$Min) / 20;
if($step < 1) {
    $step = 1;
}
foreach(range($Min, $Max, $step) as $val) {
    $PercentOfMinMax = ($val-$Min) / ($Max-$Min);
    $yval = 90 - 80*$PercentOfMinMax;
    print '<text x="4.5%" y="' . ($yval) . '%" style="dominant-baseline: middle" text-anchor="end">' . $val . '</text>';
}

/* Print the STDDEV markers */
$DB->selectRow("SELECT STDDEV(CAST($Field as Decimal)) as StdDev,  AVG(CAST($Field as Decimal)) as Avg FROM $QueryTable WHERE $QueryCondition", $StdDev);
$Sigma = $StdDev['StdDev'];
$Avg = $StdDev['Avg'];
$PercentOfMinMax = ($Avg-$Min) / ($Max-$Min);
$AvgY = 90 - 80*$PercentOfMinMax;
print '<line x1="5%" x2="95%" y1="' . $AvgY . '%" y2="' . $AvgY . '%" />';
print '<text x="96%" y="' . $AvgY . '%" text-anchor="start" style="dominant-baseline: middle" >Avg</text>';
$TwoSigma = $Avg + 2*$Sigma;
$PercentOfMinMax = ($TwoSigma-$Min) / ($Max-$Min);
$Y = 90 - 80*$PercentOfMinMax;
print '<line x1="5%" x2="95%" y1="' . $Y . '%" y2="' . $Y . '%" />';
print '<text x="96%" y="' . $Y . '%" text-anchor="start" style="dominant-baseline: middle" >2 &#120532;</text>';
$TwoSigma = $Avg - 2*$Sigma;
if($TwoSigma >= $Min) {
    $PercentOfMinMax = ($TwoSigma-$Min) / ($Max-$Min);
    $Y = 90 - 80*$PercentOfMinMax;

    print '<line x1="5%" x2="95%" y1="' . $Y . '%" y2="' . $Y . '%" />';
    print '<text x="96%" y="' . $Y . '%" text-anchor="start" style="dominant-baseline: middle" >-2 &#120532;</text>';
}
?>
<!-- Make sure that the top end of the scale shows up, even if the steps wern't divisible by 20 -->
<text x="4.5%" y="10%" style="dominant-baseline: middle" text-anchor="end"><?php print $Max;?> </text>
</g>
<g stroke="black" stroke-width="2" id="data">
<?php

    $DB->select("SELECT CAST($Field as Decimal) as $Field, DATEDIFF(i.Date_taken,c.DoB) as AgeDays, i.CommentID as CommentID, s.ID as SessionID, c.CandID as CandID, c.PSCID as PSCID, s.SubprojectID as SubprojectID FROM $QueryTable WHERE $QueryCondition", &$Info);
    $DB->selectRow("SELECT MIN(AgeMinDays) as BatteryMin, MAX(AgeMaxDays) as BatteryMax FROM test_battery tb JOIN $QueryTable WHERE tb.Test_name=f.Test_name AND $QueryCondition", $BatteryMinMax);

    foreach($Info as $value) {
        $InARange = CheckValidity($value['SubprojectID'], $value['AgeDays']);

        if($InARange != 1) {
            $colour = 'red';
        } else {
            $colour = 'green';
        }

        // New way:
        PlaceMarker($value['AgeDays'], $value[$Field], array_merge($value, 
            array('Instrument' => $Instrument, 
            'colour' => $colour))
        ); 
    
    }
?>
</g>

</svg>
