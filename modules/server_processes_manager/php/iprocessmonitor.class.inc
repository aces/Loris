<?php
/**
 * Provides a way to determine if a process is running
 * for the classes related to the ServerProcessLauncher
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
 * An interface for entities that provide a way determine if a process is running.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

interface IProcessMonitor
{
    /**
     * Determines in a list a process ids those that are ids of processes currently
     *  running.
     *
     * @param array $pids list of process IDs to consider.
     *
     * @return array list of process IDs (in $pids) that refer to running processes.
     */
    function getRunningProcesses(array $pids);
}


