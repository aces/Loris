<?php
/**
 * This file contains code to perform a complete MRI upload on the server.
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
 * A class for holding a set of functions to perform a complete MRI
 * upload on the server.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class MriUploadServerProcess extends AbstractServerProcess
{
    /**
     * String identifying the type of process for all objects of this class.
     */
    const PROCESS_TYPE = 'mri_upload';

    /**
     * Path of the imaging upload script (relative the MRI files base path
     * found in the config).
     */
    const IMAGING_UPLOAD_FILE_PATH = 'uploadNeuroDB/imaging_upload_file.pl';

    /**
     * ID of the MRI upload request in the mri_upload table.
     *
     * @var ?int
     */
    private $_mriUploadId;

    /**
     * Location of the MRI file uploaded.
     *
     * @var string
     */
    private $_sourceLocation;

    /**
     * The value of MRICodePath config setting.
     *
     * @var string
     */
    private $_mriCodePath;

    /**
     * The value of MriConfigFile config setting.
     *
     * @var string
     */
    private $_prodFile;

    /**
     * The value of EnvironmentFile config setting.
     *
     * @var string
     */
    private $_environmentFile;

    /**
     * Builds a new MriUploadServerProcess
     *
     * @param ?int    $mriUploadId    MRI upload ID
     * @param string  $sourceLocation location of the MRI scan.
     * @param ?int    $id             ID of the process in the database.
     * @param ?int    $pid            PID for this process
     * @param ?string $stdoutFile     full path of file used to store the process's
     *                                stdout
     * @param ?string $stderrFile     full path of file used to store the process's
     *                                stderr
     * @param ?string $exitCodeFile   full path of file used to store the process's
     *                                exit code
     * @param ?int    $exitCode       process's exit code
     * @param ?string $userid         ID of the user who launched the process
     * @param ?string $startTime      time at which the process was started
     * @param ?string $endTime        time at which the process ended
     * @param ?string $exitText       result of the process in text form
     */
    public function __construct($mriUploadId, $sourceLocation,
        $id = null, $pid = null, $stdoutFile = null, $stderrFile = null,
        $exitCodeFile = null, $exitCode = null, $userid = null,
        $startTime = null, $endTime = null, $exitText = null
    ) {
        $config =& \NDB_Config::singleton();
        if (is_null($config)) {
            throw new \RuntimeException(
                "Cannot construct MriUploadTask: unable to instantiate
                 configuration object"
            );
        }

        $this->_mriCodePath     = $config->getSetting('MRICodePath');
        $this->_prodFile        = $config->getSetting('MriConfigFile');
        $this->_environmentFile = $config->getSetting('EnvironmentFile');

        // Check that paths exist before using.
        if (!is_dir($this->_mriCodePath)) {
            throw new \ConfigurationException(
                "Value for config setting 'MRICodePath' is not an existing directory"
            );
        }

        $this->_mriUploadId    = $mriUploadId;
        $this->_sourceLocation = $sourceLocation;

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
        // Sanitize variables before using in exec statement.
        $env            = $this->_mriCodePath . '/' . $this->_environmentFile;
        $env            = escapeshellarg($env);
        $uploadScript   = $this->_mriCodePath . '/' . self::IMAGING_UPLOAD_FILE_PATH;
        $uploadScript   = escapeshellarg($uploadScript);
        $uploadId       = escapeshellarg((string) $this->_mriUploadId);
        $sourceLocation = escapeshellarg($this->_sourceLocation);
        $prodFile       = escapeshellarg($this->_prodFile);
        return "source $env ;"
               . " $uploadScript"
               . " -upload_id $uploadId"
               . " -profile $prodFile $sourceLocation";
    }

    /**
     * Computes the current process progress.
     *
     * @return string computed progress.
     */
    public function getProgress()
    {
        // To be implemented in a later stage
        return '';
    }

    /**
     * Computes the process the should output when is terminates.
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
        } elseif (is_numeric($exitCode) && $exitCode == 0) {
            return "Finished MRI uploading (pid = " . $this->getPid() . ")"
                   . " End time:" . $endTime;
        } else {
            return "MRI upload task (pid = " . $this->getPid() . ")"
                   . " failed: error code is $exitCode";
        }
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
}


