<?php declare(strict_types=1);

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
     * @param array $dbRow  Process database row.
     * @return AbstractServerProcess the server process created
     * @throws \InvalidArgumentException if the server process type is unknown
     */
    public function getServerProcess(array $dbRow): AbstractServerProcess
    {
        return match ($dbRow['type']) {
            MriUploadServerProcess::PROCESS_TYPE =>
                new MriUploadServerProcess(
                    null,
                    '',
                    intval($dbRow['id']),
                    intval($dbRow['pid']),
                    $dbRow['stdout_file'],
                    $dbRow['stderr_file'],
                    $dbRow['exit_code_file'],
                    intval($dbRow['exit_code']),
                    $dbRow['userid'],
                    $dbRow['start_time'],
                    $dbRow['end_time'],
                    $dbRow['exit_text']
            ),
            ParseInstrumentDataServerProcess::PROCESS_TYPE =>
                new ParseInstrumentDataServerProcess(
                    '',
                    '',
                    intval($dbRow['id']),
                    intval($dbRow['pid']),
                    $dbRow['stdout_file'],
                    $dbRow['stderr_file'],
                    $dbRow['exit_code_file'],
                    intval($dbRow['exit_code']),
                    $dbRow['userid'],
                    $dbRow['start_time'],
                    $dbRow['end_time'],
                    $dbRow['exit_text']
            ),
            default => throw new \InvalidArgumentException("Unknown server process type: ${dbRow['type']}")
        };
    }
}


