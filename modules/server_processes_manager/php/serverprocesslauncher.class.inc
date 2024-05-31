<?php
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
     * List of processes that should notify this class when their _syncTaskProperties
     * are run.
     */
    private $_processesMonitored = [];

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
     * @param AbstractServerProcess $process the process that was just started.
     *
     * @return void.
     *
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

        $process->setId($db->lastInsertID);
    }

    /**
     * Launches the process passes as argument and records its information
     * in the database.
     *
     * @param AbstractServerProcess $process process to launch.
     *
     * @return void.
     *
     * @throws \LorisException if the process cannot be launched successfully.
     */
    private function _launch(AbstractServerProcess $process)
    {
        $process->execute();

        // If we get here, it means that the process started successfully
        // Save it to the database
        $this->_saveProcess($process);

        // Wait two seconds before checking the exit code: if the command is invalid
        // this will give enough time for the process to die and we can get the
        // exit code, otherwise the check happens too soon and the process is
        // considered to be "still running" (i.e. exit code undefined yet)
        sleep(2);

        if ($process->getExitCode() == self::CANNOT_EXECUTE_EXIT_CODE) {
            throw new \LorisException(
                "Cannot run command " . $process->getShellCommand()
            );
        }
    }

    /**
     * Launch an MRI upload process
     *
     * @param int    $mriUploadId    ID of the MRI upload in the mri_upload table.
     * @param string $sourceLocation location of the MRI file
     *
     * @return AbstractServerProcess the launched MRI process.
     */
    public function mriUpload($mriUploadId, $sourceLocation)
    {
        $mriUploadProcess            = new MriUploadServerProcess(
            $mriUploadId,
            $sourceLocation
        );
        $this->_processesMonitored[] = $mriUploadProcess;

        // Add this process to the list of monitored process:
        // this will ensure we get notified when its _syncTaskProperties method
        // is executed
        $mriUploadProcess->addProcessSyncListener($this);
        $this->_launch($mriUploadProcess);

        return $mriUploadProcess;
    }

    /**
     * This method gets called when one of the processes in list
     * _processesMonitored executes its _syncTaskProperties method.
     *
     * @param $process the process that called its _syncTaskProperties method.
     *
     * @return void.
     */
    public function processSynced($process)
    {
        // Ensure the process is indeed a process that is monitored
        if (in_array($process, $this->_processesMonitored)) {
            try {
                $setValues = [
                    'exit_text' => $process->getExitText(),
                    'exit_code' => $process->getExitCode(),
                    'end_time'  => $process->getEndTime()
                ];
                $this->getDatabaseProvider()->getDatabase()->update(
                    'server_processes',
                    $setValues,
                    ['id' => $process->getId()]
                );
            } catch (\DatabaseException $exception) {
                error_log(
                    "Failed to update task (pid=" . $process->getPid() . ") status: "
                    . $exception->getMessage()
                );
            }
        }
    }
}


