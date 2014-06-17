<?php
/**
 * @package mri
 */
///
// START THE HTML PAGE
//
ob_start();

echo "<HTML><HEAD> \n";
print ("\n<META HTTP-EQUIV=\"PRAGMA\" CONTENT=\"NO-CACHE\">\n");
print ("<TITLE>JIV Applet Window - do not close</TITLE></HEAD> \n");
print ("<BODY align='left' valign='top'> \n");

// start APPLET
$appletParam =  "<applet height=50 width=400 codebase=\"/mri/jiv\" archive=\"jiv.jar\" code=\"jiv/Main.class\" name=\"jiv_mri\">\n";

$appletParam .= "<param name=\"inline_config\" value=\"# ;\n";

$appletParam .= "jiv.download : upfront ;\n";
$panel_counter = 0;

for($i=0; $i<count($_REQUEST['jiv']['data']); $i++) {
  $appletParam .= $_REQUEST['jiv']['name'][$i]." : /mri/jiv/get_file.php?file=".'jiv/'. $_REQUEST['jiv']['data'][$i].".raw_byte.gz ;\n";
  $appletParam .= $_REQUEST['jiv']['name'][$i].".header : /mri/jiv/get_file.php?file=". 'jiv/' . $_REQUEST['jiv']['data'][$i].".header ;\n";
  $appletParam .= "jiv.panel.$panel_counter = ".$_REQUEST['jiv']['name'][$i]." ;\n";
  $appletParam .= "jiv.panel.$panel_counter.coding : gray ;\n";
  $appletParam .= "jiv.panel.$panel_counter.range : 0.10 0.63 ;\n";
  $panel_counter++;
}

for($i=0; $i<count($_REQUEST['jiv']['combine']); $i++) {
    $appletParam .= "jiv.panel.$panel_counter.combine : " . $_REQUEST['jiv']['combine'][$i] . " ;\n";;
    $panel_counter++;
}

$appletParam .= "jiv.sync : true ;\n";

// end APPLET
$appletParam .= "\"></applet> \n";

echo $appletParam;

echo "</BODY></HTML>";
?>
