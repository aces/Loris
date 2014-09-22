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
class Message
{
    var $messageFile;

    /**
     * Constructor
     *
     * @param string $path path to the file
     */
    function __construct($path)
    {
        $this->messageFile = $path;
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
                "%04d-%02d-%02d %02d:%02d:%02d", $now_array['year'],
                $now_array['mon'], $now_array['mday'], $now_array['hours'],
                $now_array['minutes'], $now_array['seconds']
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
