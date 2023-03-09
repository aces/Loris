<?php declare(strict_types=1);

namespace LORIS\Log;

use Psr\Log\LoggerInterface;
use \Psr\Log\LogLevel;

/**
 * An implementation of the PSR3 LoggerInterface which uses the standard
 * PHP error_log function to log errors if they meet a given severity
 * level.
 */
class ErrorLogLogger implements LoggerInterface
{
    use \Psr\Log\LoggerTrait;

    protected string $minLevel;

    /*
     * Construct an ErrorLogLogger.
     *
     * @param string $minlevel The minimum severity level which should be
     *                         logged
     */
    public function __construct(string $minlevel)
    {
        $this->minLevel = $minlevel;
    }

    /**
     * Interpolate data, based on sample from PSR-3
     * documentation.
     *
     * @param string $message The message to log
     * @param array  $context The context to interpolate
     *
     * @return string
     */
    private function interpolate(string $message, array $context = array()) : string
    {
        // build a replacement array with braces around the context keys
        $replace = array();
        foreach ($context as $key => $val) {
            // check that the value can be cast to string
            if (!is_array($val) && (!is_object($val) || method_exists($val, '__toString'))) {
                $replace['{' . $key . '}'] = $val;
            }
        }

        // interpolate replacement values into the message and return
        return strtr($message, $replace);
    }

    /**
     * Logs with an arbitrary level to the standard php error log.
     *
     * @param mixed  $level
     * @param string $message
     * @param array  $context
     *
     * @return void
     *
     * @throws \Psr\Log\InvalidArgumentException
     */
    public function log($level, $message, array $context = array()): void
    {
        // LogLevel consts are strings, not integers, so we need to
        // be explicit about which are used instead of doing a < or >
        // comparison.
        // If it's below the minLevel, return early, otherwise
        // we log at the end.
        switch ($this->minLevel) {
            case LogLevel::EMERGENCY:
                switch ($level) {
                    case LogLevel::ALERT:
                    case LogLevel::CRITICAL:
                    case LogLevel::ERROR:
                    case LogLevel::WARNING:
                    case LogLevel::NOTICE:
                    case LogLevel::INFO:
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::ALERT:
                switch ($level) {
                    case LogLevel::CRITICAL:
                    case LogLevel::ERROR:
                    case LogLevel::WARNING:
                    case LogLevel::NOTICE:
                    case LogLevel::INFO:
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::CRITICAL:
                switch ($level) {
                    case LogLevel::ERROR:
                    case LogLevel::WARNING:
                    case LogLevel::NOTICE:
                    case LogLevel::INFO:
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::ERROR:
                switch ($level) {
                    case LogLevel::WARNING:
                    case LogLevel::NOTICE:
                    case LogLevel::INFO:
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::WARNING:
                switch ($level) {
                    case LogLevel::NOTICE:
                    case LogLevel::INFO:
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::NOTICE:
                switch ($level) {
                    case LogLevel::INFO:
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::INFO:
                switch ($level) {
                    case LogLevel::DEBUG:
                        return;
                }
                break;
            case LogLevel::DEBUG:
                break;
        }
        error_log(
            "[" . strtoupper($level) . "] " . $this->interpolate($message, $context),
        );
    }
}
