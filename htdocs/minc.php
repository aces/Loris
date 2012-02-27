<?php


require_once "../tools/generic_includes.php";
require_once "Utility.class.inc";


$headers = array();



//$minc_file = '/data/gusto/data/assembly/642088/MRIday/mri/native/gusto_642088_MRIday_unknown_001.mnc';

$file_names = array();
//location of the minc file in the server..
$minc_id = $_REQUEST['minc_id'];

//print 'minc id is' . $minc_id . "<BR>";
$query = "select File from files where FileID = '$minc_id'";
$minc_file = $DB->selectone($query);

/*

/data/gusto/data/assembly/559551/MRIday/mri/native/gusto_559551_MRIday_t1_001.mnc
*/
$header = $_REQUEST['minc_headers'];
$header_data = $_REQUEST['raw_data'];
if ($header_data){
	//$binary_data=
	data($minc_file);
	//return $binary_data;
}

if ($header=='true' && $minc_file !=null){
print initialize($minc_file);
}




/**
 * creates a json array of mincinfo
 *
 * @param unknown_type $minc_file
 * @return unknown
 */
function initialize($minc_file){
	$start_x = exec("mincinfo -attval xspace:start $minc_file");
	$space_length_x = exec("mincinfo -dimlength xspace $minc_file");
	$step_x = exec("mincinfo -attval xspace:step $minc_file");

	$start_y = exec("mincinfo -attval yspace:start $minc_file");
	$space_length_y = exec("mincinfo -dimlength yspace $minc_file");
	$step_y = exec("mincinfo -attval yspace:step $minc_file");

	$start_z = exec("mincinfo -attval zspace:start $minc_file");
	$space_length_z = exec("mincinfo -dimlength zspace $minc_file");
	$step_z = exec("mincinfo -attval zspace:step $minc_file");

	//minc2.0
	$order = split(",",exec("mincinfo -attval image:dimorder  $minc_file"));
	/*
           For minc1 files...
        if ((!(count($order) == 3)) || (!(count($order) == 4))){
		//minc 1.0
                $result = exec("mincinfo -dimnames  $minc_file");
                print 'result: ' .$result;
		$order = split(" ",exec("mincinfo -dimnames  $minc_file"));
	}
      */
	$headers = array(

	'xspace' => array(
	'start'=>$start_x,
	'space_length'=>$space_length_x,
	'step'=>$step_x
	),
	'yspace' => array(
	'start'=>$start_y,
	'space_length'=>$space_length_y,
	'step'=>$step_y
	),
	'zspace' => array(
	'start'=>$start_z,
	'space_length'=>$space_length_z,
	'step'=>$step_z
	),
	'order' => $order
	);


	return($header_json = json_encode($headers));

	//var_dump($headers);
	//var_dump($header_json);



	/**
	 * The mincinfo -attval time:start doesn't work...Error reading file.
	 * mincinfo -dimlength time returns Error reading file.
	 
	if (count($order) == 4){
		$start = exec("mincinfo -attval time:start $minc_file");
		$space_length = exec("mincinfo -dimlength time $minc_file");
		$headers['time'] = array(
		'start'=> $start,
		'space_length'=>$space_length
		);
	}
	*/


}

/**
 * Returns the raw binary data
 *
 * @param unknown_type $minc_file
 * @return unknown
 */


function data($minc_file){
	/**1) get The raw binary data, in short integer
	* 2) convert 4 byte(char) to a short unsigned integer
	3) making space limited array of the data...
	$file_names[] = $minc_file;
	*/
	//header('content-type: text/plain');
        passthru("minctoraw -byte -unsigned -normalize $minc_file");
/*
	passthru("cat raw_data");
	$content_grabbed=ob_get_contents();
	ob_end_clean();

	if($result==0){
		echo $content_grabbed;
	}
	exit;
*/
	//$raw_binary_data = exec("minctoraw -byte -unsigned -normalize $minc_file");
	//return $raw_binary_data;

	//unpack function in php....
	/**
   $decimal = 	decbin($value);
   $data_string_array = split(" ",$decimal)
   **/

}
/**
 * 
 * php > print $array
php > echo exec("minctoraw -byte -unsigned -normalize gusto_313934_MRIday_unknown_001.mnc")
php > echo exec("minctoraw -byte -unsigned -normalize gusto_313934_MRIday_unknown_001.mnc");
PHP Parse error:  syntax error, unexpected T_ECHO in php shell code on line 2
php > echo exec("minctoraw -byte -unsigned -normalize gusto_313934_MRIday_unknown_001.mnc");

 */

?>
