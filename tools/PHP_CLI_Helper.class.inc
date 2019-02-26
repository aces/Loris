<?php

/**
 * Use bash to determine if certain unix tools are installed.  Which is used for
 * generic system tools (e.g. wget), and dpkg if which fails.
 *
 * @param string $tool Name of tool
 *
 * @return bool representing if tool is installed
 */
function installed($tool) : bool
{
    // `which` returns empty if a tool is not installed.
    // shell_exec captures this output.
    if (shell_exec("which $tool")) {
        return true;
    }
    // check installed pacakages with dpkg. Returns 0 if installed.
    exec("dpkg -s $tool", $output, $status);
    if ($status === 0) {
        return true;
    }
    return false;
}

/**
 * Prompts a user with a question and acceptable responses.
 *
 * @param string $question Prompt to display to user
 * @param array  $answers  List of acceptable answers to prompt
 *
 * @return void
 */
function writeQuestion($question, $answers) : void
{
    echo $question . ' (' . implode('/', $answers) . '): ' . PHP_EOL;
}

/**
 * Gets user input from STDIN and checks if it matches an option in
 * $possibleAnswers.  If not, the default answer is used.  Intended to follow
 * function writeQuestion
 *
 * @param array $possibleAnswers Possible answers to a prompt
 * @param array $defaultAnswer   Response if user entered invalid response
 *
 * @return string The user input representing their answer or the default answer
 */
function readAnswer($possibleAnswers, $defaultAnswer) : string
{
    $in     = fopen('php://stdin', 'rw+');
    $answer = trim(fgets($in));

    if (!in_array($answer, $possibleAnswers, true)) {
        return $defaultAnswer;
    }

    return $answer;
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
function doExec($cmd) : bool
{
    echo "[+] Executing command `$cmd`... " . PHP_EOL;
    exec($cmd, $output, $status);
    if ($status !== 0) {
        echo bashErrorToString($cmd, $output, $status);
        return false;
    }
    echo '[+] OK.' . PHP_EOL;
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
            $error .= $item . PHP_EOL;
        }
    }
    return $error;
}
