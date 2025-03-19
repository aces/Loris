<?php declare(strict_types=1);

use \Psr\Log\LoggerInterface;

/**
 * Class to consistently log profiling related information to LORIS
 * logs so that performance issues can be more easily debugged.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Profiler
{
    protected \DateTimeImmutable $startTime;
    protected ?\DateTimeImmutable $lastCheckpoint;
    protected int $lastMemory;
    protected LoggerInterface $logger;

    /**
     * Private constructor that is only called from checkpoint, so
     * that a singleton is used.
     */
    private function __construct()
    {

        $this->startTime  = new \DateTimeImmutable();
        $this->lastMemory = memory_get_peak_usage();

        $loglevel = \NDB_Config::singleton()
            ->getLogSettings()
            ->getProfilerLogLevel();
        if ($loglevel !== "none") {
            $this->logger = new \LORIS\Log\ErrorLogLogger(\Psr\Log\LogLevel::DEBUG);
        } else {
            $this->logger = new \Psr\Log\NullLogger();
        }
    }

    /**
     * Adds a checkpoint to the error logs that displays the timing since
     * the initial checkpoint, and any increase in the PHP max memory usage
     * since the last checkpoint.
     *
     * @param string $msg - A message to display with the stats in the log
     *
     * @return void
     */
    public static function checkpoint(string $msg) : void
    {
        static $profiler = new Profiler();
        $currentMemory   = memory_get_peak_usage();
        $now = new \DateTimeImmutable();
        $profiler->logger->debug(
            "["
            . $now->format("U")
            . " ("
            . $now->diff($profiler->startTime)->format("%s") . "s)] "
            . $msg
            . ' (Max memory: '
            . $currentMemory
            . ', since last checkpoint: '
            . ($currentMemory - $profiler->lastMemory)
            . ')'
        );
        $profiler->lastCheckpoint = new \DateTimeImmutable();
        $profiler->lastMemory     = $currentMemory;
    }
}
