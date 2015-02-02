<?php
/**
 * Generates the HTML for an iframe that shows a single JIV.
 *
 * This is a legacy file that will eventually be removed as JIV is
 * replaced by BrainBrowser.
 *
 * PHP Version 5
 *
 * @category Garbage
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

ob_start();

///
// START THE HTML PAGE
//
echo "<HTML><HEAD> \n";
print ("\n<META HTTP-EQUIV=\"PRAGMA\" CONTENT=\"NO-CACHE\">\n");
print ("<TITLE>JIV Applet Window - do not close</TITLE></HEAD> \n");
print ("<BODY align='left' valign='top'> \n");

// start APPLET
$appletParam = "<applet height=50 width=400 codebase="
    .  "\"/mri/jiv\" archive=\"jiv.jar\" code=\"jiv/Main.class\" "
    ."name=\"jiv_mri\">\n";

$appletParam .= "<param name=\"inline_config\" value=\"# ;\n";

$appletParam  .= "jiv.download : upfront ;\n";
$panel_counter = 0;

for ($i=0; $i < count($_REQUEST['jiv']['data']); $i++) {
    $appletParam .= $_REQUEST['jiv']['name'][$i]
        . " : /mri/jiv/get_file.php?file="
        . 'jiv/'
        . $_REQUEST['jiv']['data'][$i]
        . ".raw_byte.gz ;\n";
    $appletParam .= $_REQUEST['jiv']['name'][$i]
        . ".header : /mri/jiv/get_file.php?file="
        . 'jiv/'
        . $_REQUEST['jiv']['data'][$i]
        .".header ;\n";
    $appletParam .= "jiv.panel.$panel_counter = "
        . $_REQUEST['jiv']['name'][$i]
        . " ;\n";
    $appletParam .= "jiv.panel.$panel_counter.coding : gray ;\n";
    $appletParam .= "jiv.panel.$panel_counter.range : 0.10 0.63 ;\n";
    $panel_counter++;
}

for ($i=0; $i<count($_REQUEST['jiv']['combine']); $i++) {
    $appletParam .= "jiv.panel.$panel_counter.combine : "
        . $_REQUEST['jiv']['combine'][$i]
        . " ;\n";;
    $panel_counter++;
}

$appletParam .= "jiv.sync : true ;\n";

// end APPLET
$appletParam .= "\"></applet> \n";

echo $appletParam;

echo "</BODY></HTML>";
?>
