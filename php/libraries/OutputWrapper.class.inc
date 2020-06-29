<?php declare(strict_types=1);

/**
 * This class is designed to assist in writing command-line interface tools
 * for LORIS.
 *
 * It contains helper functions to format output, etc.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class OutputWrapper
{
    // Error codes
    const ERROR_LOGDIR_NOT_DIR      = 'Configuration setting for Log directory is '
        . 'not a directory.';
    const ERROR_LOGDIR_NOT_WRITABLE = 'Log directory is not writable.';
    // Colours mapped to ANSI escape codes.
    // @see https://en.wikipedia.org/wiki/ANSI_escape_code#3/4_bit
    const COLOURS = [
        'red'    => '31',
        'yellow' => '33',
        'green'  => '32',
    ];
    /**
     * Whether this script should log its output to a file or just print to
     * STDOUT.
     *
     * @var bool
     */
    private $_loggingEnabled = false;
    /**
     * The directory that will contain log files written by this script.
     *
     * @var SPLFileInfo
     */
    private $_logDirectory;

    /**
     * Create a new command line helper.
     *
     * @param ?SPLFileInfo $logDirectory The directory that will contain log
     *                                   files written by this script.
     *
     * @return void
     */
    public function __construct(?SPLFileInfo $logDirectory = null)
    {
        $logDir = new SPLFileInfo(
            $logDirectory ?? \NDB_Factory::singleton()->config()->getSetting('log')
        );
        if ($logDir->isDir() === false) {
            throw new \ConfigurationException(self::ERROR_LOGDIR_NOT_DIR);
        }
        if ($logDir->isWritable() === false) {
            throw new \ConfigurationException(self::ERROR_LOGDIR_NOT_WRITABLE);
        }
        $this->_logDirectory = $logDir;
    }

    /**
     * Print a formatted and indented bullet point.
     *
     * @param string $line The output.
     *
     * @return void
     */
    public function printBulletPoint(string $line): void
    {
        echo "\t* $line\n";
    }

    /**
     * Prints a line of text with a newline before. Can optionally be printed
     * to the command-line in coloured text. Valid options for colours are given
     * in the COLOURS class constant.
     * If logging is enabled, the line will also be written to a log file. Log
     * files will not contain coloured text.
     *
     * @param string   $line   To be written.
     * @param string   $colour A valid colour, given by COLOURS, for the output.
     * @param resource $handle A file resource where text should be written.
     *
     * @return void
     */
    public function printLine(
        string $line,
        string $colour = '',
        $handle = STDOUT
    ): void {
        $output = $line;

        // If a valid colour is supplied and the output is going to a TTY,
        // colourize the output.
        if (!empty($colour) && stream_isatty($handle)) {
            // Verify a valid colour is supplied
            if (!array_key_exists(strtolower($colour), self::COLOURS)) {
                throw new InvalidArgumentException(
                    "Invalid argument for colour (`$colour`)"
                );
            }

            // Format the output to colour the whole line.
            $output = sprintf(
                "\n\e[%sm%s\e[0m",
                self::COLOURS[$colour],
                $line
            );
        }

        fwrite($handle, $output . PHP_EOL);

        // Use non-colourized output for file logging.
        if ($this->_loggingEnabled) {
            file_put_contents(
                $this->_logDirectory->getPath() . $this->_loggingFileName,
                $line . PHP_EOL,
                FILE_APPEND
            );
        }
    }

    /**
     * Prints argument in green text, prefixed with '[*]', to STDOUT.
     *
     * @param string $line The output.
     *
     * @return void
     */
    public function printSuccess(string $line): void
    {
        // Takes 'input', prints '[*] input' in green text.
        $this->printLine("[*] $line", 'green', STDOUT);
    }

    /**
     * Print the argument in yellow text, prefixed with '[-]', to STDOUT.
     *
     * @param string $line The output.
     *
     * @return void
     */
    public function printWarning(string $line): void
    {
        $this->printLine("[-] $line", 'yellow', STDOUT);
    }

    /**
     * Print the argument in red text, prefixed with '[!]', to STDERR.
     *
     * @param string $line The output.
     *
     * @return void
     */
    public function printError(string $line): void
    {
        $output = "[!] $line";
        $this->printLine($output, 'red', STDERR);
    }

    /**
     * Returns the POSIX username for the user on the server that is
     * executing this script.
     *
     * @return string
     */
    public function getPOSIXUsername(): string
    {
        return posix_getpwuid(posix_geteuid())['name'];
    }

    /**
     * Log script output to a file.
     *
     * @param string $scriptName The name of the script that is using this class.
     *
     * @return void
     */
    public function enableLogging(string $scriptName): void
    {
        // Create a new file in the format:
        // `$scriptName-YEAR-MONTH-DAY_HOUR-MINUTE-SECOND.log`
        $this->_loggingFileName = sprintf(
            "%s-%s.log",
            // Remove extension information
            pathinfo($scriptName)['basename'],
            date('Y-m-d_H:i:s')
        );

        $this->_loggingEnabled = true;
    }

    /**
     * Disable logging functions of the class.
     *
     * @return void
     */
    public function disableLogging(): void
    {
        unset($this->_loggingFileName);
        $this->_loggingEnabled = false;
    }
}
