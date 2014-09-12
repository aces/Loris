<?php
/**
 * Message class file
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Olga Tsibulevskaya  <olgatsib@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
*/


/**
 * Message Class
 *
 * The class contains the utility to write messages to the file.
 * Was created to be used for the Ajax long-polling
 *
 * @category Behavioural
 * @package  Main
 * @author   Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/IBIS
*/
require_once 'NDB_Config.class.inc';

class Message
{
    var $messageFile;

    /**
     * Constructor
     *
     * @param string $path path to the file
     */
    function __construct($file_name,$location=null)
    {   
    	///Create the proper file-name
    	$today= getdate();
        $date = sprintf(
            "%04d-%02d-%02d", $today['year'], 
            $today['mon'], $today['mday']
        );
        $config=&NDB_Config::singleton();
        $log_location =  $config->getSetting("log");
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
            $this->messageFile  = $log_location . "/" . $file_name . 
            "." .  $date . ".log";
        } else {
            $this->messageFile  = $location . "/" . $file_name 
            . "." . $date . ".log";
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
    function addMessage($message, $use_date=true)
    {
        $now_array = getdate();
        if ($use_date) {
            $now_string = sprintf(
                "%04d-%02d-%02d %02d:%02d:%02d",
                $now_array['year'],
                $now_array['mon'],
                $now_array['mday'],
                $now_array['hours'],
                $now_array['minutes'],
                $now_array['seconds']
            );

            $message = "[" . $now_string . "] " . $message . "\n";
        }
        $file = fopen($this->messageFile, "a");

        flock($file, LOCK_EX);
        fwrite($file, "$message\n");
        fflush($file);
        flock($file, LOCK_UN);

        fclose($file);

    }
    /**
    * Changes the name of the current log file
    *
    * @param String  $log_name  The Name of the new log-file
    * 
    * @return null
    */
    function changeLogName($log_name) {
    	$path_parts = pathinfo($this->messageFile);
    	$new_name = $path_parts['dirname'] . "/" .$log_name;
    	//renames the file-name
    	rename($this->messageFile,$new_name);
    	$this->messageFile = $new_name;
    }
    
    /**
    * Returns the path to the log
    *
    * @return String Path to the log
    */
    function getMessagePath()
    {
        return $this->messageFile;
    }
}
?>
