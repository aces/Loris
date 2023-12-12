<?php
/**
 * A LogSetting object provides a higher level interface for
 * accessing current LORIS log settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class LogSettings
{
    protected $levels;

    /**
     * Construct a LogSettings object.
     *
     * @param array $levels The current values of log settings as retrieved
     *                      from the LORIS configuration.
     */
    public function __construct(array $levels)
    {
        $this->levels = $levels;
    }

    /**
     * Get the current verbosity level for database logging.
     *
     * @return string
     */
    function getDatabaseLogLevel() : string
    {
        return $this->levels['database_log_level']  ?? "none";
    }

    /**
     * Get the current verbosity level for HTTP request logging.
     *
     * @return string
     */
    function getRequestLogLevel() : string
    {
        return $this->levels['request_log_level']  ?? "none";
    }

    /**
     * Get the current verbosity level for PHP exceptions that are
     * thrown.
     *
     * @return string
     */
    function getExceptionLogLevel() : string
    {
        return $this->levels['exception_log_level']  ?? "none";
    }
}
