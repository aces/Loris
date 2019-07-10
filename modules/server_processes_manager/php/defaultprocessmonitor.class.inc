<?php
/**
 * Provides a default way to determine whether a process is running
 * or not.
 *
 * PHP Version 5
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\server_processes_manager;

/**
 * Class that encapsulates a strategy for determining whether a process is running
 * or not.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class DefaultProcessMonitor implements IProcessMonitor
{
    /**
     * Determine which processes are currently running using a standard call to the
     * Unix 'ps' command.
     *
     * @param array $pids list of process IDs to consider
     *
     * @return array            list of the processes in $pids that are currently
     *                          running.
     * @throws \RuntimeException if the ps command failed to run
     */
    public function getRunningProcesses(array $pids)
    {
        // Run ps command
        exec('ps ' . implode(' ', $pids), $psOutput, $psReturnCode);

        // This should not happen
        if ($psReturnCode != 0) {
               $errorMsg = "Command ps " . implode(' ', $pids) . " failed";
               error_log($errorMsg);
            throw new \RuntimeException($errorMsg);
        }

        // Get the list of running processes
        $runningProcesses = array();
        foreach ($psOutput as $psInfo) {
            if (preg_match('^(0-9]+)', $psInfo, $pid)) {
                $runningProcesses[] = $pid[1];
            }
        }

        return $runningProcesses;
    }
}

