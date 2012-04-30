<?php

/**
 * 
What does it do:
Populates the data_integrity with the parameter_type name 
*/

include_once("../tools/generic_includes.php");
include_once("Utility.class.inc");

$query = "select Name, sourcefrom,ParameterTypeID,Description from parameter_type where queryable = '1' and SourceFrom not in ('candidate','session');";
$DB->Select($query,$parameter_types);

foreach($parameter_types as $parameter_type){
	$visit_labels = Utility::getVisitLabelUsingTestName($parameter_type['sourcefrom']);
	foreach ($visit_labels as $visit_label){
		if ($visit_label!=null){
			$visit =  $visit_label['visit_label'];
			$name = $parameter_type['Name'];
			$type_id = $parameter_type['ParameterTypeID'];
			$description = $parameter_type['description'];
			
            //insert it only if it doesn't exist...
			if ($DB->pselectOne("select count(*) from data_integrity_flag WHERE Name=:my_name AND Visit_label=:my_visit", array('my_name' => $name,'my_visit'=>$visit)) == 0){
				$query = "insert into data_integrity_flag (Name,Visit_label) values ('$name','$visit');";
				$DB->run($query);
			}
		}
	}
}

?>

