<?
require_once("PEAR.php");
/**
 * Allows creation and display of specific error messages in the 
 * NDB_BVL_instrument, NDB_CALLER and main.php
 * @access public
 * @version 
 * @package main
 */
class Error extends PEAR
{
	/**
    * error message
    * @access private
    */
	public static $error_message;

	/**
    * Boolean to show if the specified error message should be set or not
    * @access private
    */
	public static $useSpecified;

	/**
 * get the error message
 *
 * @return unknown
 */
	public static function getErrorMessage(){
		return self::$error_message;
	}
	
	/**
	 * set the error message
	 *
	 * @param unknown_type $error_message
	 */
	public static function setErrorMessage($error_message){
		self::$error_message = $error_message;
	}

	/**
	 * Should the specified Error message be used.
	 *
	 * @return unknown
	 */
	public static function getUseSpecifiedMessage(){
		return self::$useSpecifiedMessage;
	}

	/**
	 * Set the UseSpecifiedMessage boolean
	 *
	 * @param unknown_type $set
	 */
	public static function setUseSpecifiedMessage($set){
		$useSpecifiedMessage = $set ;
	}
}
?>