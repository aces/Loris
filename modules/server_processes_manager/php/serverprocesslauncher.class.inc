<?php declare(strict_types=1);

/**
 * Provides a way to asynchronously execute a process on the server.
 * The process will be run in the background, as a stand-alone Unix process
 *
 * PHP Version 5
 *
 * @category ServerProcessesLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\server_processes_manager;

/**
 * Allows processes to be executed on the server, as background Unix processes.
 * Records the processes successfully started in the database.
 *
 * PHP Version 5
 *
 * @category ServerProcessesLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class ServerProcessLauncher
{
    const CANNOT_EXECUTE_EXIT_CODE = 2;

    /**
     * Entity used to get a handle on the database
     *
     * @var IDatabaseProvider
     */
    private $_databaseProvider;

    /**
     * Accessor for field $_databaseProvider
     *
     * @return IDatabaseProvider value of field $_databaseProvider
     */
    public function getDatabaseProvider()
    {
        if (is_null($this->_databaseProvider)) {
            $this->setDatabaseProvider(new DefaultDatabaseProvider());
        }

        return $this->_databaseProvider;
    }

    /**
     * Mutator for field $_databaseProvider
     *
     * @param mixed $databaseProvider new value of field
     *                                $_databaseProvider
     *
     * @return void
     */
    public function setDatabaseProvider($databaseProvider)
    {
        $this->_databaseProvider = $databaseProvider;
    }

    /**
     * Records in the database the information associated to a process that was
     * just started.
     *
     * @param AbstractServerProcess $process the process that was just started
     *
     * @return string
     * @throws \InvalidArgumentException if the process is null or if either the
     *                                  PID or the process start time is null.
     */
    private function _saveProcess(AbstractServerProcess $process)
    {
        if (is_null($process)) {
            throw new \InvalidArgumentException("Invalid null process argument");
        }

        if (is_null($process->getPid())) {
            throw new \InvalidArgumentException(
                "Cannot save a process with a null PID"
            );
        }

        if (is_null($process->getStartTime())) {
            throw new \InvalidArgumentException(
                "Cannot record a process with a null start time"
            );
        }

        $db = $this->getDatabaseProvider()->getDatabase();

        $db->insert(
            'server_processes',
            [
                'pid'            => $process->getPid(),
                'type'           => $process->getType(),
                'stdout_file'    => $process->getStdoutFile(),
                'stderr_file'    => $process->getStderrFile(),
                'exit_code_file' => $process->getExitCodeFile(),
                'userid'         => $process->getUserId(),
                'start_time'     => $process->getStartTime(),
            ]
        );

        return $db->lastInsertID;
    }

    /**
     * Launches the process passes as argument and records its information
     * in the database.
     *
     * @param AbstractServerProcess $process process to launch.
     *
     * @return ?int ID of the process saved in the database.
     *
     * @throws \LorisException if the process cannot be launched successfully.
     */
    private function _launch(AbstractServerProcess $process)
    {
        $process->execute();

        // Wait one second before checking the exit code: if the command is invalid
        // this will give enough time for the process to die and we can get the
        // exit code (otherwise the check happens too soon and the process is
        // considered to be "still running" (i.e. exit code undefined yet)
        sleep(1);

        if ($process->getExitCode() == self::CANNOT_EXECUTE_EXIT_CODE) {
            throw new \LorisException(
                "Cannot run command " . $process->getShellCommand()
            );
        }

        return intval($this->_saveProcess($process));
    }

    /**
     * Launch an MRI upload process
     *
     * @param int    $upload_id       ID of the MRI upload in the mri_upload table.
     * @param string $source_location location of the MRI file
     *
     * @return ?int ID (in the database) of the launched process or null
     *             if the process could not be run
     */
    public function mriUpload($upload_id, $source_location)
    {
        $upload_process = new MriUploadServerProcess(
            $upload_id,
            $source_location
        );

        $process_id = $this->_launch($upload_process);

        $this->getDatabaseProvider()->getDatabase()->insert(
            'mri_upload_server_processes_rel',
            [
                'UploadID'  => $upload_id,
                'ProcessID' => $process_id,
            ]
        );

        return $process_id;
    }
}
