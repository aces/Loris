<?php
/**
 * This class is a wrapper around Database exceptions thrown from the Loris
 * database.
 *
 * PHP Version 5
 *
 * @category Errors
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * The DatabaseException class.
 *
 * @category Errors
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DatabaseException extends LorisException
{
    var $query;
    var $params;

    /**
     * Constructs a database exception. Optionally may specify the
     * QUERY that generated the exception and bind parameters that
     * were used to try and execute it.
     *
     * @param string $msg        The error message to associate to this exception
     * @param string $query      The SQL query that generated this exception
     * @param array  $bindparams The prepared statement bindings used to try
     *                           and execute this statement
     */
    function __construct($msg, $query = '', $bindparams = array())
    {
        parent::__construct($msg);
        $this->query  = $query;
        $this->params = $bindparams;
        error_log(
            "Could not execute $query. Stack trace" . $this->getTraceAsString()
        );
    }
}

