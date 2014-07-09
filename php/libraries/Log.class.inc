<?php
/**
 * Log class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
*/

require_once 'PEAR.php';

/**
 * Log Class
 *
 * The class contains the utility functions to create and insert into log file
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
*/
class Log extends PEAR
{

    var $GENERAL_ERROR_DIR;

    /**
     * Constructor
     *
     * @param String $file_name The name of the log file
     * @param String $location  The path of the log file
     * 
     * @return Log
     */
    function Log($file_name,$location=null)
    {   
        if ($file_name === ".log") {
            $this->GENERAL_ERROR_DIR = "/data/sandbox/data/logs/.log";
        } else { 
            $today= getdate();
            $date = sprintf(
                "%04d-%02d-%02d", $today['year'], 
                $today['mon'], $today['mday']
            );
            $config=&NDB_Config::singleton();
            $log_location = $config->getSetting("log");
            $base_location = $config->getSetting("base");

            if ($log_location[0] !== '/') { // It's not an absolute path (i.e logs/tools)
                //append log_location to base_location
                //if base_location is /var/www/
                if ($base_location[strlen($base_location)-1]== '/') { 
                    $log_location = $base_location . $log_location;
                } else {   // else if base location is /var/www/
                    $log_location = $base_location . "/" . $log_location;
                }
            }
            if (($location == null) || ($location == '')) {
                $this->GENERAL_ERROR_DIR  = $log_location . "/" . $file_name . 
                "." .  $date . ".log";
            } else {
                $this->GENERAL_ERROR_DIR  = $location . "/" . $file_name 
                . "." . $date . ".log";
            }
        } 
    }
    /**
    * Adds error message to the file
    *
    * @param String  $message  The content of the message inserted into the log file
    * @param Boolean $use_date It will insert the current date if true
    * 
    * @return null
    */
    function addLog($message,$use_date=true) 
    {
        $now_array = getdate();
        if ($use_date) {
            $now_string = sprintf(
                "%04d-%02d-%02d %02d:%02d:%02d", $now_array['year'], 
                $now_array['mon'], $now_array['mday'], $now_array['hours'], 
                $now_array['minutes'], $now_array['seconds']
            );
            error_log("[$now_string] $message\n", 3, $this->GENERAL_ERROR_DIR);
        }
        else {
            error_log("$message\n", 3, $this->GENERAL_ERROR_DIR);
        }
    }
    
     /**
    * returns the path to the error_log
    *
    * @return String Path to the error_log
    */
    function getLogPath(){
        return $this->GENERAL_ERROR_DIR;
    }
}
?>
