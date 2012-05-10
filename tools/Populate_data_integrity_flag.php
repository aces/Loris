<?php

/**
 * 
 What does it do:
 Populates the data_integrity with the parameter_type name 
 */
include_once("../tools/generic_includes.php");
include_once("Utility.class.inc");
$query = "SELECT Name, sourcefrom, ParameterTypeID, Description FROM parameter_type WHERE queryable = '1' AND SourceFrom NOT IN ('candidate','session');";
$parameter_types = $DB->pselect($query,array());
foreach($parameter_types as $parameter_type) {
    $visit_labels = Utility::getVisitLabelUsingTestName($parameter_type['sourcefrom']);
    foreach ($visit_labels as $visit_label) {
        if ($visit_label!=null) {
            $visit =  $visit_label['visit_label'];
            $name = $parameter_type['Name'];
            $type_id = $parameter_type['ParameterTypeID'];
            $description = $parameter_type['description'];
            //insert it only if it doesn't exist...
            if ($DB->pselectOne("SELECT COUNT(*) FROM data_integrity_flag WHERE Name=:my_name AND Visit_label=:my_visit", array('my_name' => $name,'my_visit'=>$visit)) == 0) {
                $DB->insert("data_integrity_flag",array('Name'=>$name,'Visit_label'=>$visit));
            }
        }
    }
}
?>

