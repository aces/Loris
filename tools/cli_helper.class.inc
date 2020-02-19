<?php declare(strict_types=1);
require_once 'generic_includes.php';
/**
 * This class is designed to assist in writing command-line interface tools
 * for LORIS.
 *
 * It contains helper functions to format output, etc.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CLI_Helper
{
    // Colours associated with the bash shell.
    // @see https://misc.flogisoft.com/bash/tip_colors_and_formatting
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
    public function __construct(SPLFileInfo $logDirectory = null)
    {
        $_logDirectory = new SPLFileInfo(
            \NDB_Factory::singleton()
                ->config()
                ->getSetting('log')
        );
    }

    /**
     * Print a formatted and indented bullet point.
     *
     * @param string $line The output.
     *
     * @return void
     */
    function printBulletPoint(string $line): void
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
    function printLine(
        string $line,
        string $colour = '',
        $handle = STDOUT
    ) {
        $output = $line;
        if (!empty($colour)) {
            // Verify a valid colour is supplied
            if (!array_key_exists(strtolower($colour), self::COLOURS)) {
                throw InvalidArgumentException(
                    "Invalid argument for colour (`$colour`)"
                );
            }

            // Format the output to colour the whole line.
            $output = sprintf("\n\e[%sm$line\e[0m", self::COLOURS[$colour]);
        }

        fwrite($handle, $output . PHP_EOL);

        // Don't include colours in log files
        if ($this->_loggingEnabled) {
            file_put_contents(
                __DIR__ . '/logs/'  . $this->_loggingFileName,
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
    function printSuccess(string $line): void
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
    function printWarning(string $line): void
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
    function disableLogging(): void
    {
        unset($this->_loggingFileName);
        $this->_loggingEnabled = false;
    }

}
