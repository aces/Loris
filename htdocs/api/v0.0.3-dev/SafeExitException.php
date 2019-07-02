<?php
/**
 * This file declares an exception that is thrown instead of exit(0)ing, so
 * that the exit can be caught in unit testing instead of the program exiting
 * directly.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API;
/**
 * SafeExitException for exiting API in a way that is testable
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SafeExitException extends \Exception
{
    var $Object;

    /**
     * Exception to throw to exit program
     *
     * @param string  $message    Message to display
     * @param integer $exitStatus The exit code to exit the program with
     * @param object  $obj        The object throwing the exception.
     */
    function __construct($message, $exitStatus, $obj)
    {
        parent::__construct($message, $exitStatus);
        $this->Object = $obj;
    }
}

