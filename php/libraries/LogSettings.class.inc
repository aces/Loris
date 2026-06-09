<?php declare(strict_types=1);

/**
 * A LogSetting object provides a higher level interface for
 * accessing current LORIS log settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class LogSettings
{
    protected $levels;

    private const DEFAULT_DATABASE_LOG_LEVEL  = "warning";
    private const DEFAULT_REQUEST_LOG_LEVEL   = "warning";
    private const DEFAULT_EXCEPTION_LOG_LEVEL = "warning";
    private const DEFAULT_PROFILER_LOG_LEVEL  = "none";

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
        return $this->_getLogLevel(
            'database_log_level',
            self::DEFAULT_DATABASE_LOG_LEVEL
        );
    }

    /**
     * Get the current verbosity level for HTTP request logging.
     *
     * @return string
     */
    function getRequestLogLevel() : string
    {
        return $this->_getLogLevel(
            'request_log_level',
            self::DEFAULT_REQUEST_LOG_LEVEL
        );
    }

    /**
     * Get the current verbosity level for PHP exceptions that are
     * thrown.
     *
     * @return string
     */
    function getExceptionLogLevel() : string
    {
        return $this->_getLogLevel(
            'exception_log_level',
            self::DEFAULT_EXCEPTION_LOG_LEVEL
        );
    }

    /**
     * Get the current verbosity level for performance profile logging
     *
     * @return string
     */
    function getProfilerLogLevel() : string
    {
        return $this->_getLogLevel(
            'profiler_log_level',
            self::DEFAULT_PROFILER_LOG_LEVEL
        );
    }

    /**
     * Get a configured log level, falling back only when the value is
     * missing from the database. An explicit "none" remains respected.
     *
     * @param string $settingName  The config setting name
     * @param string $defaultLevel The level to use when absent
     *
     * @return string
     */
    private function _getLogLevel(
        string $settingName,
        string $defaultLevel
    ) : string {
        $level = $this->levels[$settingName] ?? null;
        if ($level === null || $level === '') {
            return $defaultLevel;
        }
        return $level;
    }
}
