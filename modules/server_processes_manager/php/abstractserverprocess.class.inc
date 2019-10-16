<?php
/**
 * Template for all tasks used by the task manager
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
 * Abstract class that all tasks used by the task manager should extend.
 * Provides a template for task implementation, tailored to answer the needs
 * of the task manager
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

abstract class AbstractServerProcess
{
    /**
      * How the start and end time of a server process are stored. This should be
      * consistent with the way that these two values are recorded in the database.
      */
    const PROCESS_TIME_FORMAT = 'Y-m-d H:i:s';

    /**
      * All temporary files used by this task will have this basename
      */
    const TMP_FILES_PREFIX = 'loris_task_';

    /**
     * Provides a way to access the database
     *
     * @var IDatabaseProvider
     */
    private $_databaseProvider;

    /**
     * ID of the process when recorded in the database.
     *
     * @var int
     */

    private $_id;

    /**
     * Unix process ID for that process
     *
     * @var int
     */
    private $_pid;

    /**
     * Type of process
     *
     * @var string
     */
    private $_type;

    /**
     * Full path of the file containing the process's stdout.
     *
     * @var string
     */
    private $_stdoutFile;

    /**
     * Full path of the file containing the process's stderr.
     *
     * @var string
     */
    private $_stderrFile;

    /**
     * Full path of the file containing the process's return code.
     *
     * @var string
     */
    private $_exitCodeFile;


    /**
     * Process's exit code, read in $exitCodeFile.
     *
     * @var int
     */
    private $_exitCode;

    /**
     * ID of the user who launched the process
     *
     * @var string
     */
    private $_userId;

    /**
     * Time at which the process was launched (in format PROCESS_TIME_FORMAT)
     *
     * @var string
     */
    private $_startTime;

    /**
     * Time at which the process finished (in format PROCESS_TIME_FORMAT)
     *
     * @var string
     */
    private $_endTime;

    /**
     * Process exit text.
     *
     * @var string
     */
    private $_exitText;

    /**
      * Build a new server process
      *
     * @param int    $id           ID of the process in the database.
     * @param int    $pid          PID for this process
     * @param string $type         type of process
     * @param string $stdoutFile   full path of file used to store the process's
     *                             stdout
     * @param string $stderrFile   full path of file used to store the process's
     *                             stderr
     * @param string $exitCodeFile full path of file used to store the process's
     *                             exit code
     * @param int    $exitCode     process's exit code
     * @param string $userid       ID of the user who launched the process
     * @param string $startTime    time at which the process was started
     * @param string $endTime      time at which the process ended
     * @param string $exitText     result of the process in text form
     */
    public function __construct($id, $pid, $type, $stdoutFile, $stderrFile,
        $exitCodeFile, $exitCode, $userid,
        $startTime, $endTime, $exitText
    ) {
        $userid = is_null($userid) ? \User::singleton()->getUsername() : $userid;

        $this->_id           = $id;
        $this->_pid          = $pid;
        $this->_type         = $type;
        $this->_stdoutFile   = $stdoutFile;
        $this->_stderrFile   = $stderrFile;
        $this->_exitCodeFile = $exitCodeFile;
        $this->_exitCode     = $exitCode;
        $this->_userid       = $userid;
        $this->_startTime    = $startTime;
        $this->_endTime      = $endTime;
        $this->_exitText     = $exitText;
    }

    /**
     * Accessor for field $_id.
     *
     * @return int value of $_id
     */
    public function getId()
    {
        return $this->_id;
    }

    /**
     * Accessor for field $_pid.
     *
     * @return int value of $_pid
     */
    public function getPid()
    {
        return $this->_pid;
    }

    /**
     * Accessor for field $_stdoutFile
     *
     * @return string value of $_stdoutFile
     */
    public function getStdoutFile()
    {
        return $this->_stdoutFile;
    }

    /**
     * Accessor for field $_stderrFile
     *
     * @return string value of $_stderrFile
     */
    public function getStderrFile()
    {
        return $this->_stderrFile;
    }

    /**
     * Accessor for field $_exitCodeFile
     *
     * @return string value of $_exitCodeFile
     */
    public function getExitCodeFile()
    {
        return $this->_exitCodeFile;
    }

    /**
     * Accessor for field $_userid
     *
     * @return string value of $_userid
     */
    public function getUserId()
    {
        return $this->_userid;
    }

    /**
     * Accessor for field $_startTime
     *
     * @return string value of $_startTime
     */
    public function getStartTime()
    {
        return $this->_startTime;
    }

    /**
     * Executes this task. This will start a background Unix process with stdout
     * stderr and exit code captured in temporary files.
     *
     * @return int|null PID of the Unix process started or null if execution fails or
     *             if execution has already started
     */
    public function execute()
    {
        // If task already started, return null
        if ($this->isRunning()) {
            return null;
        }

        //--------------------------
        // Set all task infos
        //--------------------------
        $this->_stdoutFile   = tempnam($this->getTmpDir(), self::TMP_FILES_PREFIX);
        $this->_stderrFile   = tempnam($this->getTmpDir(), self::TMP_FILES_PREFIX);
        $this->_exitCodeFile = tempnam($this->getTmpDir(), self::TMP_FILES_PREFIX);

        $time    = date(self::PROCESS_TIME_FORMAT, time());
        $process = new Process(
            $this->getShellCommand(),
            $this->getStdoutFile(),
            $this->getStderrFile(),
            $this->getExitCodeFile()
        );
        $process->start();

        //-------------------------
        // Store PID and start time
        //-------------------------
        $this->_pid       = $process->getPid();
        $this->_startTime = $time;

        return $this->getPid();
    }

    /**
      * Gets directory where all temporary files created by this task should go
      *
      * @return string full path to the temporary directory
      */
    protected function getTmpDir()
    {
        return sys_get_temp_dir();
    }

    /**
      * Determines whether this task is currently running or not by examining whether
      * its associated process is running.
      *
      * @return boolean true if the task is running, false otherwise
      */
    public function isRunning()
    {
        if (is_null($this->getPid())) {
             return false;
        }

        exec("ps " . $this->getPid(), $psOutput, $psReturnCode);
        return count($psOutput) >= 2;
    }

    /**
     * Gets the task return code. Also syncs the class and database information to
     * reflect the task's actual state.
     *
     * @return int|null the class $_returnCode attribute if it is set. If not, then
     *                  read $_returnCodeFile and return contents. If empty, then
     *                  return 'unknown'. If the task is still running, return null.
     */
    public function getExitCode()
    {
        if ($this->isRunning()) {
               return null;
        }

        // Check if class attribute is set
        if (!is_null($this->_exitCode)) {
               return $this->_exitCode;
        }

        // Sync task information: this will make sure that all the class
        // attributes are up to date
        $this->_syncTaskProperties();

        return $this->_exitCode;
    }

    /**
     * Compute the text returned by this task. This is considered to be the task
     * result, in text form.
     *
     * @return string|null the return text or null if the task is still running
     */
    public function getExitText()
    {
        // Task is still running: return null
        if ($this->isRunning()) {
               return null;
        }

        // If class attribute is set, return it
        if (!is_null($this->_exitText)) {
               return $this->_exitText;
        }

        // Sync task properties: this will make sure that all classes attributes
        // are up to date
        $this->_syncTaskProperties();

        return $this->_exitText;
    }

    /**
     * Compute the time at which the task ended.
     *
     * @return string|null time at which the task ended or null if the task is still
     *                running.
     */
    public function getEndTime()
    {
        // Task is still running: return null
        if ($this->isRunning()) {
               return null;
        }

        // If class attribute is set, return it
        if (!is_null($this->_endTime)) {
               return $this->_endTime;
        }

        // Sync task information: this will make sure that class atributes are up
        // up to date
        $this->_syncTaskProperties();

        return $this->_endTime;
    }

    /**
      * Updates the current object and its associated information in the database
      * in order to reflect the task's current state. This should be done if
      * execution of the task is finished to update all attributes related to the
      * task's completion status (return code, return text, end time).
      *
      * @return boolean true if the operation succeeded, false otherwise.
      * @throws \UnexpectedValueException if the return code file does not exists,
      *                                  cannot be read or has invalid content
      */
    private function _syncTaskProperties()
    {
        // Task is still running so there's nothing to do.
        if ($this->isRunning()) {
            return false;
        }

        // If the return code file does not exist or is empty return 'unknown'
        if (!file_exists($this->_exitCodeFile)
            || filesize($this->_exitCodeFile) == 0
        ) {
            $exitCode = 'unknown';
        } else {
            //-----------------------------------------------------
            // Read the exitCodeFile and fetch the unique number
            // written in there
            //-----------------------------------------------------
            exec(
                'tail -1 ' . $this->_exitCodeFile,
                $tailOutput,
                $tailReturnCode
            );

            if ($tailReturnCode != 0) {
                $errorMessage
                    = "Failed to retrieve exit code of process with pid "
                      . $this->getPid() . " in "
                      . $this->_exitCodeFile . ": " . implode("\n", $tailOutput);
                error_log($errorMessage);
                throw new \UnexpectedValueException($errorMessage);
            }

            if (count($tailOutput) != 1) {
                $errorMessage
                    = "Invalid exit code file content (pid = "
                      . $this->getPid() . "): found "
                      . count($tailOutput) . " lines";
                error_log($errorMessage);
                throw new \UnexpectedValueException($errorMessage);
            }

            if (!is_numeric($tailOutput[0])) {
                $errorMessage
                    = "Invalid exit code file content (pid = "
                      . $this->getPid() . "): $tailOutput[0]";
                error_log($errorMessage);
                throw new \UnexpectedValueException($errorMessage);
            }

            $exitCode = $tailOutput[0];
        }

        if ($exitCode != 'unknown') {
            // There was an exit code in the file

            // Get the exit code file modification time: this should be the
            // time at which the process ended
            $endTime = filemtime($this->_exitCodeFile);

            if ($endTime == false) {
                error_log(
                    "Failed to get last modification time of file "
                    . $this->_exitCodeFile
                );
                $endTime = null;
            } else {
                $endTime = date(self::PROCESS_TIME_FORMAT, $endTime);
            }
        } else {
               // Problem with the exit code file: end time is unknown (null)
            $endTime = null;
        }

        $exitText = $this->computeExitText($exitCode, $endTime);

        //--------------------------------------------------------------------------
        // Update object and database values to reflect what was computed previously
        //--------------------------------------------------------------------------
        $setValues   = array(
                        'exit_text' => $exitText,
                        'exit_code' => $exitCode,
                        'end_time'  => $endTime,
                       );
        $whereValues = array('id' => $this->getId());

        try {
            $this->getDatabaseProvider()->getDatabase()->update(
                'server_processes',
                $setValues,
                $whereValues
            );
        }
        catch(\DatabaseException $exception) {
            error_log(
                "Failed to update task (pid=" . $this->getPid() . ") status: "
                . $exception->getMessage()
            );
        }

        $this->_exitCode = $exitCode;
        $this->_exitText = $exitText;
        $this->_endTime  = $endTime;

        //------------------------------------------------------------------
        // Delete the temporary (stdout stderr and exitCode) files if it is
        // required to do so
        //------------------------------------------------------------------
        if ($this->deleteProcessFiles()) {
            if (file_exists($this->getStdoutFile())) {
                unlink($this->getStdoutFile())
                    || error_log("Failed to delete file " . $this->getStdoutFile());
            }
            if (file_exists($this->getStdErrFile())) {
                unlink($this->getStderrFile())
                    || error_log("Failed to delete file " . $this->getStderrFile());
            }
            if (file_exists($this->getExitCodeFile())) {
                if (!unlink($this->getExitCodeFile())) {
                    error_log(
                        "Failed to delete file " . $this->getExitCodeFile()
                    );
                }
            }
        }

        return true;
    }

    /**
     * Whether $outfile, $_errfile and $_exitCodeFile should be deleted once the
     * process is finished.
     *
     * @return boolean true if the files should be deleted, false otherwise
     */
    public function deleteProcessFiles()
    {
        return true;
    }

    /**
     * Mutator for field $_databaseProvider
     *
     * @param IDatabaseProvider $databaseProvider new value for $_databaseProvider
     *
     * @return void
     */
    public function setDatabaseProvider($databaseProvider)
    {
        $this->_databaseProvider = $databaseProvider;
    }

    /**
     * Accessor for field $_databaseProvider.
     *
     * @return IDatabaseProvider value of $_databaseProvider
     */
    public function getDatabaseProvider()
    {
        // Lazy init if not set
        if (is_null($this->_databaseProvider)) {
            $this->_databaseProvider = new DefaultDatabaseProvider();
        }

        return $this->_databaseProvider;
    }

    /**
     * Specifies the Unix shell command used to run the process
     *
     * @return   string Unix shell command
     * @abstract
     */
    abstract function getShellCommand();

    /**
     * Specifies how to compute the current process progress
     *
     * @return   string current progress text
     * @abstract
     */
    abstract function getProgress();

    /**
     * Specifies how to compute the text returned when the process is finished
     *
     * @param int    $exitCode process exit code
     * @param string $endTime  time at which the process ended
     *
     * @return   string current return text
     * @abstract
     */
    abstract function computeExitText($exitCode, $endTime);

    /**
     * Specifies the ID for the task type
     *
     * @return   string type of task
     * @abstract
     */
    abstract function getType();
}


