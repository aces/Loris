<?php declare(strict_types=1);

class CLI_Helper
{
    /* Whether to print debug statements.*/
    var $verbose = false;

    /**
     * Constructor for CLI helper. Optionally takes a copy of the calling codes
     * arguments.
     *
     * @param array $args A copy of $argv
     */
    public function __construct(array $args = array()) {
        if (in_array('-v', $args, true)
            || in_array('--verbose', $args, true)
        ) {
            $this->verbose = true;
        }
    }

    /**
     * Prints and executes a bash command using exec.  Prints an error message on
     * failure (a 0 exit code in bash is a success. Anything else is considered an
     * error here.
     *
     * @param string $cmd An executable shell command
     *
     * @return bool True if command exits normally. False otherwise.
     */
    public function doExec(string $cmd) : bool
    {
        if ($this->verbose) {
            echo "[+] Executing command `$cmd`... " . PHP_EOL;
        }
        exec($cmd, $output, $status);
        if ($status !== 0) {
            echo $this->bashErrorToString($cmd, $output, $status);
            return false;
        }
        if ($this->verbose) {
            echo '[+] OK.' . PHP_EOL;
        }
        return true;
    }

    /**
     * A to-string method for exec.  Captures bash exit code and error message for
     * debugging purposes. Also prints the command that was run. Modelled on PHP
     * `exec` function.
     *
     * @param string $cmd    A bash command that has been executed
     * @param string $output Output of above command.
     * @param string $status Exit status of above command
     *
     * @return string The error message describing what happened in bash
     */
    function bashErrorToString($cmd, $output, $status) : string
    {
        echo PHP_EOL;
        $error = "[-] ERROR: Command `$cmd` failed (error code $status)" . PHP_EOL;
        if (is_iterable($output)) {
            foreach ($output as $item) {
                $error[] = $item . PHP_EOL;
            }
        }
        return $error;
    }

    /**
     * Returns the OS distribution based on the /etc/os-release file
     *
     * @return string The distribution
     */
    function getDistro() {
        exec(
            "hostnamectl |awk -F: '/Operating System:/{print $2}'|cut -f2 -d ' '",
            $output,
            $status
        );
        return $output;
    }
}
