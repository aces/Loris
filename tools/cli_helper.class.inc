<?php declare(strict_types=1);
/**
 *
 * This class is designed to assist in writing command-line interface tools
 * for LORIS.
 *
 * It contains helper functions to format output, etc.
 * PHP Version 7
 *
 * @category Tools
 * @package  Loris
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'generic_includes.php';
/**
 * This class is designed to assist in writing command-line interface tools
 * for LORIS.
 *
 * It contains helper functions to format output, etc.
 *
 * @category Tools
 * @package  Loris
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class CLI_Helper
{
    // Colours associated with the bash shell.
    // @see https://misc.flogisoft.com/bash/tip_colors_and_formatting
    const COLOURS = [
        'red' => '31',
        'yellow' => '33',
        'green' => '32',
    ];
    private $_loggingEnablded = false;
    private $_logDirectory;

    /**
     *
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
     * Prints a line of text with a newline before and after. Can also be
     * printed in a colour.
     *
     * @param string $line
     * @param string $colour
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
            $output = sprintf("\e[%sm$line\e[0m", self::COLOURS[$colour]);
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
     * Print the input formatted as a header for output.
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
     * Print the input formatted in yellow text.
     *
     * @param string $line The output.
     *
     * @return void
     */
    function printWarning(string $line): void
    {
        // Takes 'input', prints '[-] input' in yellow text.
        $this->printLine("[-] $line", 'yellow', STDOUT);
    }
    /**
     * Print the input formatted in red text.
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
     */
    public function getUsername(): string
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
            explode('.', $scriptName)[0],
            date('Y-m-d_H:i:s')
        );

        $this->_loggingEnabled = true;
    }

    /**
     * Log script output to a file.
     */
    function disableLogging(): void
    {
        unset($this->_loggingFileName);
        $this->_loggingEnabled = false;
    }

}
