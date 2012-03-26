<?php
require_once 'PEAR.php';
//require_once('../../tools/generic_includes.php');


/**
 * A set of (static) utility functions
 *
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
		if (($location == null) || ($location == '')){
			$this->GENERAL_ERROR_DIR  = $config->getSetting("log") . $file_name . $date . "Only_Queries.log";
		}
		else{
			$this->GENERAL_ERROR_DIR  = $location . $file_name . $date . ".log";
		}
		//print 'log file is '. $this->GENERAL_ERROR_DIR . "\n";

	}


	function addLog($message) {

		/*
		$warnings = $DB->getWarnings();
		if (($warnings != null) && is_array($warnings)) {
		$mesage = $message . ' Warning : ' . $warnings['Message'] . "\n";
		}
		*/
		$now_array = getdate();
		$now_string = sprintf("%04d-%02d-%02d %02d:%02d:%02d", $now_array['year'], $now_array['mon'], $now_array['mday'], $now_array['hours'], $now_array['minutes'], $now_array['seconds']);
		//fwrite($logfp, "[$now_string] $message\n");
		error_log("[$now_string] $message\n", 3, $this->GENERAL_ERROR_DIR);
	}

	/**
	 * Includes the message into the log file...
	 *
	 * @param unknown_type $message
	 */
	/*
	function addError($message){

	$warnings = $DB->getWarnings();
	if (($warnings != null) && is_array($warnings)) {
	$this->Logmsg($message . ' Warning : ' . $warnings['Message'] . "\n");
	}
	}
	*/
}