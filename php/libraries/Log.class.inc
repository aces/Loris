<?php
require_once 'PEAR.php';

/**
 * @access public
 * @package main
 */
class Log extends PEAR
{

	var $GENERAL_ERROR_DIR;

	//constructor
	function Log($file_name,$location=null){
		$today= getdate();
		$date = sprintf("%04d-%02d-%02d", $today['year'], $today['mon'], $today['mday']);
		$config=&NDB_Config::singleton();
		$log_location = $config->getSetting("log");
		$base_location = $config->getSetting("base");

		if ($log_location[0] != '/'){
			if ($base_location[strlen($base_location)-1]!= '/'){
				$log_location = $base_location . "/" . $log_location; 
			}
			else{
				$log_location = $base_location . $log_location; 
			}
		}

		if (($location == null) || ($location == '')){
			$this->GENERAL_ERROR_DIR  = $log_location . "/" . $file_name . "." .  $date . ".log";
		}
		else{
			$this->GENERAL_ERROR_DIR  = $location . $file_name . "." . $date . ".log";
		}
	}

	function addLog($message) {
		$now_array = getdate();
		$now_string = sprintf("%04d-%02d-%02d %02d:%02d:%02d", $now_array['year'], $now_array['mon'], $now_array['mday'], $now_array['hours'], $now_array['minutes'], $now_array['seconds']);
		error_log("[$now_string] $message\n", 3, $this->GENERAL_ERROR_DIR);
	}
}
