<?php declare(strict_types=1);

/**
 * This file contains code to perform a complete MRI upload on the server.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
namespace LORIS\server_processes_manager;

/**
 * A class for holding a set of functions to parse large instrument data uploads
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class ParseInstrumentDataServerProcess extends AbstractServerProcess
{
    /**
     * String identifying the type of process for all objects of this class.
     */
    const PROCESS_TYPE = 'parse_instrument_data';

    /**
     * Instrument name
     *
     * @var string
     */
    public $_instrument;

    /**
     * Location of the uploaded file.
     *
     * @var string
     */
    public $_fileLocation;


    /**
     * Builds a new ParseInstrumentDataServerProcess
     *
     * @param string  $instrument   Instrument name
     * @param string  $fileLocation Location of the uploaded file
     * @param ?int    $id           ID of the process in the database.
     * @param ?int    $pid          PID for this process
     * @param ?string $stdoutFile   full path of file used to store the process's
     *                              stdout
     * @param ?string $stderrFile   full path of file used to store the process's
     *                              stderr
     * @param ?string $exitCodeFile full path of file used to store the process's
     *                              exit code
     * @param ?int    $exitCode     process's exit code
     * @param ?string $userid       ID of the user who launched the process
     * @param ?string $startTime    time at which the process was started
     * @param ?string $endTime      time at which the process ended
     * @param ?string $exitText     result of the process in text form
     */
    public function __construct($instrument, $fileLocation,
        $id = null, $pid = null, $stdoutFile = null, $stderrFile = null,
        $exitCodeFile = null, $exitCode = null, $userid = null,
        $startTime = null, $endTime = null, $exitText = null
    ) {
        $this->_instrument   = $instrument;
        $this->_fileLocation = $fileLocation;

        parent::__construct(
            $id,
            $pid,
            self::PROCESS_TYPE,
            $stdoutFile,
            $stderrFile,
            $exitCodeFile,
            $exitCode,
            $userid,
            $startTime,
            $endTime,
            $exitText
        );
    }

    /**
     * Gets the shell command used to start this process.
     *
     * @return string shell command.
     */
    public function getShellCommand()
    {
        $parseScript  = "php " .
            dirname(__DIR__, 3) .
            "/tools/parse_instrument_data.php ";
        $parseScript .= "$this->_instrument $this->_fileLocation ";
        $parseScript .= "{$this->getUserId()} {$this->getUserId()}";
        return escapeshellarg($parseScript);
    }

    /**
     * Computes the current process progress.
     *
     * @return string computed progress.
     */
    public function getProgress()
    {
        return $this->isRunning() ? 'RUNNING' : 'COMPLETED';
    }

    /**
     * Computes the process should output when it terminates.
     *
     * @param int    $exitCode process exit code.
     * @param string $endTime  time at which the process ended.
     *
     * @return string|null process exit text.
     */
    public function computeExitText($exitCode, $endTime)
    {
        if (is_null($exitCode)) {
            return null;
        }

        $exitText = file_get_contents($this->getStdoutFile());
        if (is_numeric($exitCode) && $exitCode == 0) {
            return "Instrument data parse completed without errors.\n\n$exitText";
        } else {
            return "Instrument data parse failed with error code: $exitCode." .
                "\n\n$exitText";
        }
    }

    /**
     * Gets directory where all temporary files created by this task should go
     *
     * @return string full path to the temporary directory
     */
    public function getTmpDir()
    {
        return $this->getDatabaseProvider()->getDatabase()->pselectOne(
            "SELECT Value FROM Config
            LEFT JOIN ConfigSettings ON ConfigSettings.ID = ConfigID
            WHERE NAme = :configName",
            ['configName' => 'tempPath']
        ) ?? sys_get_temp_dir();
    }


    /**
     * Accessor for the process type.
     *
     * @return string process type.
     */
    public function getType()
    {
        return self::PROCESS_TYPE;
    }

    /**
     * Whether $outfile, $_errfile and $_exitCodeFile should be deleted once the
     * process is finished. These files will be deleted only if the pipeline
     * executed successfully (i.e. with exit code 0).
     *
     * @return boolean true if the files should be deleted, false otherwise
     */
    public function deleteProcessFiles()
    {
        $exitCode = parent::getExitCode();
        return !is_null($exitCode) && is_numeric($exitCode) && $exitCode == 0;
    }

    /**
     * Send email to user who triggered the process launch
     *
     * @return void
     */
    public function sendNotificationEmail()
    {
        error_log("Sending email to {$this->getUserId()}");

        $user = \NDB_Factory::singleton()->database()->pselectRow(
            "SELECT First_name, Email FROM users WHERE UserID=:uid",
            ["uid" => $this->getUserId()]       // TODO: Examiner?
        );

        if (!is_null($user)) {
            $msg_data = [
                'name'    => $user['First_name'],
                'message' => $this->getExitText(),
            ];
            \Email::send(
                $user['Email'],
                'notifier_instrument_data_upload.tpl',
                $msg_data
            );
        }
    }

    /**
     * Change file permissions
     *
     * @return void
     */
    public function changeFilePermissions()
    {
        array_map(
            function ($file) {
                chmod($file, 0775);
            },
            [
                $this->getStdoutFile(),
                $this->getStderrFile(),
                $this->getExitCodeFile(),
            ]
        );
    }


    /**
     * Perform action once process is completed
     *
     * @return void
     */
    public function performPostAction()
    {
        $this->sendNotificationEmail();
    }
}


