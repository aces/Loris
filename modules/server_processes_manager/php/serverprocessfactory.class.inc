<?php
/**
 * Provides a way to create ServerProcess objects of the appropriate type
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
 * A class that provides a way to create server processes objects of the appropriate
 * type.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class ServerProcessFactory
{
    /**
     * Creates a server process based on the parameters passed as arguments.
     *
     * @param int    $id           ID of the process in the database.
     * @param int    $pid          ID of the Unix process associated to that task
     * @param string $type         type of server process
     * @param string $stdoutFile   full path to the process's stdout file
     * @param string $stderrFile   full path to the server process's stderr file
     * @param string $exitCodeFile full path to the file that will store the
     *                             process's exit code
     * @param int    $exitCode     process exit code
     * @param string $userId       name of the user who submitted the server process
     * @param string $startTime    time at which the process was started in
     *                             YYYY-MM-DD HH:MM:SS format
     * @param string $endTime      time at which the process was started in
     *                             YYYY-MM-DD HH:MM:SS format
     * @param string $exitText     text output by the process upon completion.
     *
     * @return string the server process created
     * @throws \InvalidArgumentException if the server process type is unknown
     */
    public function getServerProcess(
        $id, $pid, $type, $stdoutFile, $stderrFile,
        $exitCodeFile, $exitCode, $userId,
        $startTime, $endTime, $exitText
    ) {
        if ($type == MriUploadServerProcess::PROCESS_TYPE) {
            return new MriUploadServerProcess(
                null,
                null,
                $id,
                $pid,
                $stdoutFile,
                $stderrFile,
                $exitCodeFile,
                $exitCode,
                $userId,
                $startTime,
                $endTime,
                $exitText
            );
        }

        throw new \InvalidArgumentException("Unknown server process type $type");
    }
}


