<?php
require_once "../tools/generic_includes.php";
require_once "Utility.class.inc";

$headers = array();
$file_names = array();

$query = "select File from files where FileID = :MincID";
$minc_file = $DB->pselectOne($query, array('MincID' => $_REQUEST['minc_id']));


$minc_file = getMincLocation() . $minc_file;

$header = $_REQUEST['minc_headers'];
$header_data = $_REQUEST['raw_data'];
if($header_data) {
	passthru("minctoraw -byte -unsigned -normalize $minc_file");
}
if($header=='true' && $minc_file !=null) {
	print initialize($minc_file);
}

/**
 * creates a json array of mincinfo
 *
 * @param unknown_type $minc_file
 * @return unknown
 */
function initialize($minc_file){
	$headers = array(
	'xspace' => array(),
	'yspace' => array(),
	'zspace' => array()
	);

	$headers['xspace']['start']        = exec("mincinfo -attval xspace:start $minc_file");
	$headers['xspace']['space_length'] = exec("mincinfo -dimlength xspace $minc_file");
	$headers['xspace']['step']         = exec("mincinfo -attval xspace:step $minc_file");

	$headers['yspace']['start']        = exec("mincinfo -attval yspace:start $minc_file");
	$headers['yspace']['space_length'] = exec("mincinfo -dimlength yspace $minc_file");
	$headers['yspace']['step']         = exec("mincinfo -attval yspace:step $minc_file");

	$headers['zspace']['start']        = exec("mincinfo -attval zspace:start $minc_file");
	$headers['zspace']['space_length'] = exec("mincinfo -dimlength zspace $minc_file");
	$headers['zspace']['step']         = exec("mincinfo -attval zspace:step $minc_file");

	//minc2.0, if there's a time component
	$order = split(",",exec("mincinfo -attval image:dimorder  $minc_file"));
	if (count($order) == 4){
		$headers['time'] = array();
		$headers['time']['start']        = exec("mincinfo -attval time:start $minc_file");
		$headers['time']['space_length'] = exec("mincinfo -dimlength time $minc_file");
		$headers['time']['step']         = exec("mincinfo -attval time:step $minc_file");
	} else {
        $order = split(" ",exec("mincinfo -dimnames $minc_file"));
    }
    
    $headers['order'] = $order;
	return($header_json = json_encode($headers));
}

//gets the minc location...
function getMincLocation(){
	$config =& NDB_Config::singleton();
	$paths= $config->getSetting('paths');
	$minc_path = $paths['mincPath'];
	return $minc_path;
}

?>
