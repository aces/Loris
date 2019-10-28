<?php
/**
 * Encapsulates informations and methods regarding a process.
 *
 * PHP Version 5
 *
 * @category TaskManager
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\server_processes_manager;

/**
 * A Unix process started via a php exec command.
 *
 * @category TaskManager
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class Process
{
    /**
     * Unix command used to start the process.
     *
     * @var string
     */
    private $_shellCommand;

    /**
     * Unix PID
     *
     * @var int
     */
    private $_pid;

    /**
     * Full path ot the file containing the command std output.
     *
     * @var string
     */
    private $_outfile;

    /**
     * Full path ot the file containing the command std error.
     *
     * @var string
     */
    private $_errfile;

    /**
     * Full path ot the file containing the command exit code.
     *
     * @var string
     */
    private $_exitCodeFile;

    /**
     * Will provide access to the database
     *
     * @var IDatabaseProvider
     */
    private $_processMonitor;

    /**
     * Constructor
     *
     * @param string $shellCommand shell command used to start this process.
     * @param string $stdoutFile   full path to the file that will be used to
     *                             capture the process' stdout.
     * @param string $stderrFile   full path to the file that will be used to
     *                             capture the process' stderr.
     * @param string $exitCodeFile full path to the file that will be used to
     *                             store the process exit code.
     *
     * @throws \InvalidArgumentException if $shellCommand is null.
     */
    function __construct($shellCommand, $stdoutFile, $stderrFile, $exitCodeFile)
    {
        if (is_null($shellCommand)) {
            throw new \InvalidArgumentException(
                "Shell command parameter cannot be null"
            );
        }

        $this->_shellCommand = $shellCommand;
        $this->_pid          = null;
        $this->_outfile      = $stdoutFile;
        $this->_errFile      = $stderrFile;
        $this->_exitCodeFile = $exitCodeFile;
    }

    /**
     * Mutator for field $_processMonitor.
     *
     * @param IProcessMonitor $processMonitor new value for field
     *                        $_processMonitor.
     *
     * @return void
     */
    public function setProcessMonitor($processMonitor)
    {
        $this->_processMonitor = $processMonitor;
    }

    /**
     * Accessor for field $_processMonitor
     *
     * @return IDatabaseProvider value of field $_processMonitor
     */
    public function getProcessMonitor()
    {
        // Lazy initialization of field
        if (is_null($this->_processMonitor)) {
            $this->_processMonitor = new DefaultProcessMonitor();
        }

        return $this->_processMonitor;
    }

    /**
     * Start the process using the $_shellCommand.
     *
     * @return void
     * @throws \RuntimeException if the process is already started.
     */
    function start()
    {
        // If process was already started, throw an exception
        if ($this->isStarted()) {
            throw new \RuntimeException(
                "Process " . $this->getShellCommand() . " is already started"
            );
        }

        // This is the main command intended to be run by this process.
        // Stdout and stderr are redirected to $_outfile and $_errfile respectively
        $mainCmd = "$this->_shellCommand > $this->_outfile 2> $this->_errFile";

        // This is the command that is used to fetch the exit code of the main
        // command and store it in $_exitCodeFile
        $getExitCodeCmd = "echo $? > $this->_exitCodeFile";

        // Run both $mainCmd and $getExitCodeCmd in a subshell and in the
        // background and return the process id of the subshell
        // Since both command are run in succession, when the main command is
        // finished, the $getExitCodeCmd will be run, storing the $mainCmd
        // exit code in $_exitCodeFile
        $this->_pid = exec(
            "(bash -c '$mainCmd ; $getExitCodeCmd') > /dev/null 2> /dev/null & "
            . " echo $!",
            $execOutput,
            $returnStatus
        );

        if ($returnStatus != 0) {
            throw new \RuntimeException(
                "Command ($mainCmd ; $getExitCodeCmd) > /dev/null 2> /dev/null"
                . " & echo $! could not be started: error code = $returnStatus"
            );
        }
    }

    /**
     * Determines whether the process was started or not.
     *
     * @return boolean true if the process was started, false otherwise.
     */
    function isStarted()
    {
        if (is_null($this->getPid())) {
            return false;
        }

        $runningPids = $this->getProcessMonitor()->getRunningProcesses(
            array($this->getPid())
        );

        return count($runningPids) == 1;
    }

    /**
     * Accessor for field $_shellCommand
     *
     * @return string value of field $_shellCommand
     */
    function getShellCommand()
    {
        return $this->_shellCommand;
    }

    /**
     * Accessor for field $_pid
     *
     * @return int value of field $_pid
     */
    function getPid()
    {
        return $this->_pid;
    }

    /**
     * Accessor for field $_outfile
     *
     * @return string value of field $_outfile
     */
    function getOutFile()
    {
        return $this->_outFile;
    }

    /**
     * Accessor for field $_errfile
     *
     * @return string value of field $_errfile
     */
    function getErrFile()
    {
        return $this->_errFile;
    }

    /**
     * Accessor for field $_exitCodeFile
     *
     * @return string value of field $_exitCodeFile
     */
    function getExitCodeFile()
    {
        return $this->_exitCodeFile;
    }
}


