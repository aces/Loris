<?php

/**
 * After running this script, a user should be able to go from an outdated LORIS
 * instance to the newest install without issue.
 *
 * This includes having the latest minor release files, third-party packages
 * (apt, npm, composer), PHP Version, etc.
 *
 * ## Details
 *
 * Specifically:
 *
 *- [x] **Creates a back up of `$LORIS_root`**
 *
 *- [x] (If not on a development instance) **Downloads the release source code
 *      and overwrites `$LORIS_root`**
 *
 *- [x] **Ensures that apt dependencies are installed and up-to-date**
 *
 *- [x] **Runs 3rd-party package managers** (npm and composer)
 *
 *- [x] **Outputs a list of SQL patches** for the user to apply manually
 *      (including development patches if on a LORIS dev instance)
 *
 *- [x] **Provides a lot of output** to assist the user in what's going on.
 *
 * Assumptions:
 *
 * As of now the script always runs in "Report-Only" mode, meaning
 * SQL patches are not applied by the script. However, if desired,
 * this functionality can be added easily by creating a command-line arg and
 * calling the apply function with `$report_only_mode = false`. I chose not to
 * include it as this is a potentially risky process.
 *
 * As of now there is no "rollback" feature. `rsync` is used to overwrite the
 * LORIS-root source code from the unzipped release folder. A backup is created,
 * but should something go wrong with `rsync`, the user will need to restore the
 * source code files manually. In this case, an error message is displayed and
 * the script will exit.
 *
 * The function to retrieve patches is heavily dependent on the way we organize
 * and name SQL files. If the directory structure changes, this functionality
 * is likely to break.
 *
 * @category Update
 * @package  Tools
 * @author   John Saigle <john.saigle@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";

error_reporting(E_ALL);
$minimum_php = 7; //TODO: Update this value as time passes
if (PHP_MAJOR_VERSION < $minimum_php) {
    die("ERROR: {$argv[0]} and LORIS require PHP $minimum_php or higher.");
}
echo 'This script will prompt for superuser privileges,'
    . ' as they are needed to e.g. update apt packages.' . PHP_EOL;
echo 'You may wish to review code changes tagged with "Caveat For '
    . 'Existing Projects" as they may include changes to your workflow. '
    . PHP_EOL
    // @codingStandardsIgnoreStart
    . "\tSee: https://github.com/aces/Loris/pulls?q=is%3Apr+label%3A%22Caveat+for+Existing+Projects%22+is%3Amerged"
    // @codingStandardsIgnoreEnd
    . PHP_EOL . PHP_EOL;
sleep(3);
main();

/**
 * Updates source code and dependencies for LORIS. Outputs missing patch files
 * based on verion information
 *
 * @return void
 */
function main() : void
{
    // PHP version required for LORIS. Change this value as needed.
    $version = '7.2';
    // all necessary apt packages to get LORIS running
    // https://github.com/aces/Loris/wiki/Installing-Loris-in-Depth
    $loris_requirements = [
                           'wget',
                           'zip',
                           'unzip',
                           'php-json',
                           'python-software-properties',
                           'software-properties-common',
                           "php$version",
                           "php$version-mysql",
                           "php$version-xml",
                           "php$version-json",
                           "php$version-mbstring",
                           "php$version-gd",
                           "libapache2-mod-php$version",
                          ];
    // Create db connection
    $config    = \NDB_Config::singleton();
    $db_config = $config->getSetting('database');
    $db        = \Database::singleton(
        $db_config['database'],
        $db_config['username'],
        $db_config['password'],
        $db_config['host']
    );
    $paths     = $config->getSetting('paths');
    $loris_root_dir = $paths['base'];
    $backup_dir     = "/tmp/bkp-LORIS"; // TODO: should this be configurable?

    $preupdate_version = getVersionFromLORISRoot($loris_root_dir);
    $info            = json_decode(getLatestReleaseInfo());
    $release_version = $info->{'tag_name'};
    $release_version = substr($release_version, 1); // remove leading 'v'

    // Update source code (if not on a development version)
    echo '[***] Beginning LORIS update process.' . PHP_EOL;
    echo '[*] Release notes:' . PHP_EOL;
    echo $info->{'body'} . PHP_EOL . PHP_EOL;
    if (!isDev()) {
        echo "[**] Updating LORIS source code "
            . "($preupdate_version --> $release_version" . PHP_EOL;
        if (updateSourceCode($loris_root_dir, $backup_dir)) {
            echo 'LORIS source code files successfully updated.' . PHP_EOL;
        }
    } else {
        echo '[-] WARNING: You are using a development version of LORIS. Not '
            . 'downloading source code files as they should be tracked with'
            . ' Git.' . PHP_EOL;
        sleep(2);
    }

    // Update apt packages
    echo '[**] Updating required packages...' . PHP_EOL;
    if (updateRequiredPackages($loris_requirements)) {
        echo '[**] Required apt packages up-to-date.' . PHP_EOL;
    }

    // Update other dependencies via e.g. composer and npm
    echo '[**] Updating dependencies via package managers...' . PHP_EOL;
    chdir($loris_root_dir); // Composer will fail if not in LORIS root
    if (runPackageManagers()) {
        echo '[**] Dependencies up-to-date.' . PHP_EOL;
    }

    // Print required SQL patches and commands needed to apply them
    $patches = getPatchesFromVersion(
        $loris_root_dir,
        $preupdate_version,
        $release_version
    );
    if ($patches) {
        echo "[*] Patches to update:" . PHP_EOL;
        foreach ($patches as $filename) {
            echo "\t] " . $filename . PHP_EOL;
        }
        echo '[*] Applying SQL patches...' . PHP_EOL;
        applyPatches($patches, $db_config);
    }
    echo "[***] Done." . PHP_EOL;
}

/**
 * Creates a backup of LORIS root.  Downloads and extracts new files from
 * the newest release on Github.  Overwrites source code with new files.  Script
 * will die on certain errors.
 *
 * @param string $loris_root_dir The directory where LORIS is installed
 * @param string $backup_dir     The directory prefix where backups are stored.
 *                      Always '/tmp/loris_' for now
 *
 * @return bool True if rsync executes successfully, false otherwise
 */
function updateSourceCode($loris_root_dir, $backup_dir) : bool
{
    // Backup source code to e.g. /tmp/bkp-LORIS_v19.x-dev_16-May-2018
    $version_filepath = $loris_root_dir . 'VERSION';
    $backup_dir      .= '_v' . getVersionFromLORISRoot($loris_root_dir);
    $backup_dir      .= '_' . date("j-M-Y") . '/'; // e.g. 10-May-2018
    echo "[*] Backing up $loris_root_dir to $backup_dir" . PHP_EOL;
    recurse_copy($loris_root_dir, $backup_dir);

    // Get the release code from Github
    $tarball_path = downloadLatestRelease();
    if (empty($tarball_path)) {
        die('ERROR: Could not download the latest LORIS release.');
    }
    $dst_dir = '/tmp/'; // Parent directory for backup and release download
    echo 'Extracting release files...' . PHP_EOL;
    $cmd = "unzip -o " . escapeshellarg($tarball_path) . ' -d '
        . escapeshellarg($dst_dir);
    doExec($cmd);

    // Find the file name for the release just downloaded
    $release_dir = '';
    foreach (glob("$dst_dir*") as $filename) {
        if (strpos($filename, '/aces-Loris-') !== false) {
            $release_dir = $filename;
        }
    }
    if (empty($release_dir)) {
        die("ERROR: Could not find downloaded files in $dst_dir" . PHP_EOL);
    }
    // Use rsync to overwrite files in $loris_root
    echo '[*] Overwriting old source code files.'  . PHP_EOL;
    $cmd = 'rsync -r ' . escapeshellarg($release_dir) . ' ' .
        escapeshellarg($loris_root_dir);
    return doExec($cmd);
}

/**
 * Ensures required packages and their repositories are known to the server
 * and are up-to-date.
 *
 * @param array $requirements Apt packages required by LORIS.
 *
 * @return bool True if all packages installed and up-to-date. False otherwise.
 */
function updateRequiredPackages($requirements) : bool
{
    // we need 3rd party PPA to get the latest PHP on Ubuntu
    echo '[*] Adding external PPAs...' . PHP_EOL;
    // -y flag required to suppress a message from the author
    // TODO: check if these already exist before adding
    exec('sudo apt-add-repository ppa:ondrej/php -y');
    exec('sudo apt-add-repository ppa:ondrej/apache2 -y');

    echo '[*] Updating apt package list...' . PHP_EOL;
    exec('sudo apt-get update');
    // die unless all required packages are installed and up-to-date
    if (!(installMissingRequirements($requirements))
        && (installAptPackages($requirements, $upgrade_mode = true))
    ) {
        die(
            'Could not upgrade all required packages. Exiting.'
            . PHP_EOL
        );
    }
    return true;
}

/**
 * Returns a list of SQL patch files to apply based on LORIS version
 * differences.
 *
 * @param string $loris_root   The directory where LORIS is installed
 * @param string $version_from Pre-update LORIS version
 * @param string $version_to   Post-update LORIS version
 *
 * @return array Patch files to be applied
 */
function getPatchesFromVersion($loris_root, $version_from, $version_to) : array
{
    // Semantic versioning: 0 = major, 1 = minor, 2 = bugfix
    define('MAJOR', 0);
    define('MINOR', 1);
    define('BUGFIX', 2);
    // Convert string representation of version into arrays of ints
    // TODO: check for dev branches
    $from_versions = array_map('intval', explode('.', $version_from));
    $to_versions   = array_map('intval', explode('.', $version_to));
    // Calculate difference between old version and latest
    $diff_major = $to_versions[MAJOR] - $from_versions[MAJOR];
    $diff_minor = $to_versions[MINOR] - $from_versions[MINOR];
    // $diff_bugfix = $version_to_array[2] - $version_from_array[2];
    echo "[**] Latest version $version_to is ahead of installed $version_from "
        . "by $diff_major MAJOR release(s), $diff_minor MINOR release(s)."
        . PHP_EOL;

    // For every major version released between the version that is installed
    // and the latest version, add the relevant patches if they begin with
    // a number in that range. For example, if upgrading from 17 to 19, the
    // array will contain all aptches beginning with "17", "18", or "19".
    // i.e.:
    //   [0] => /var/www/loris/SQL/Release_patches/17.0_To_18.0_upgrade_A.sql
    //   [1] => /var/www/loris/SQL/Release_patches/17.0_To_18.0_upgrade_B.sql
    //   [2] => /var/www/loris/SQL/Release_patches/18.0_To_19.0_upgrade.sql
    //   [3] => /var/www/loris/SQL/Release_patches/19.0_To_19.1_upgrade.sql
    // Range will run once when $start = $end. We want this in the case where
    // there is no difference in major versions but there is a change in minor
    // versions. The below loops will, in this case, match the minor release
    // patches.
    $start = $from_versions[MAJOR];
    $end   = $start; // default case: there is a minor release difference
    if ($diff_major > 0) {
        $end = $to_versions[MAJOR];
    }
    $patch_dir           = $loris_root . 'SQL/Release_patches/';
    $all_release_patches = glob($patch_dir . '*.sql');
    $patches = [];
    if ($diff_major > 0 || $diff_minor > 0) {
        foreach (range($start, $end) as $v) {
            foreach ($all_release_patches as $patch) {
                // strpos must be 0 or else this will match w/ e.g. 16.0_To_17.0
                // when the server is already on version 17
                if (strpos(basename($patch), "$v") === 0) {
                    $patches[] = $patch;
                }
            }
        }
    }
    if (isDev()) {
        echo "[+] Developer instance detected. Including developer patches..."
            . PHP_EOL;

        // Add all patches in Archive/$MAJOR.$MINOR. Everything other needed
        // command will be in the Release patches which are been added above
        $dev_patch_dir = $loris_root . 'SQL/Archive/' . $to_versions[MAJOR]
            . '.' . $to_versions[MINOR] . '/';
        $patches       = array_merge($patches, glob($dev_patch_dir . '*.sql'));
    }
    return $patches;
}

/**
 * Apply a list of SQL patch files using exec.  Currently this function is only
 * called with $report_only = true so patches are never applied. This can be
 * changed in the future if this functionality is required.
 *
 * @param array      $patches     Patch files to be applied
 * @param dictionary $db_config   DB config info. Needed for credentials
 * @param bool       $report_only Whether to only display patches or to also
 *                          apply them. Always true (for now).
 *
 * @return bool Always true (for now). False if patches fail to be applied.
 */
function applyPatches($patches, $db_config, $report_only = true) : bool
{
    // Iterate over all patches and source them into MySQL
    $A = $db_config['database'];
    $u = $db_config['username'];
    $p = $db_config['password'];
    $h = $db_config['host'];
    if ($report_only === true) {
        echo '[-] NOTE: Running in Report-Only mode. Patching commands will be '
            . 'displayed but not executed.' . PHP_EOL;
        sleep(1);
    }
    foreach ($patches as $patch) {
        $cmd = "mysql -h $h -u $u -p -A $A < $patch";
        if ($report_only === false) {
            if (doExec($cmd) === false) {
                break;
            }
        } else {
            echo "\t] $cmd" . PHP_EOL;
        }
    }
    return true;
}


/**
 * Prints a list of missing apt packages and prompts user to install them.
 *
 * @param array $requirements Required packages determined missing earlier
 *
 * @return bool True if all packages install properly. False otherwise.
 */
function installMissingRequirements($requirements) : bool
{
    $to_install = getMissingRequirements($requirements);
    if (empty($to_install)) {
        return true;
    }
    echo '[-] Required package(s) not installed:' . PHP_EOL;
    foreach ($to_install as $tool) {
        echo "\t* {$tool}" . PHP_EOL;
    }
    $answers       = [
                      'Y',
                      'n',
                     ];
    $defaultAnswer = 'Y';
    writeQuestion('Install now?', $answers);
    $answer = readAnswer($answers, $defaultAnswer);
    if ($answer != 'Y') {
        echo '[-] Not installing requirements...' . PHP_EOL;
        return false;
    }
    echo '[*] Installing requirements...' . PHP_EOL;
    return installAptPackages($to_install);
}

/**
 * Takes an array of packages to install using apt-get.  Uses exec to install
 * or upgrade apt packages based on $upgrade_mode.
 *
 * @param array $packages     List of apt packages to install
 * @param bool  $upgrade_mode If true, only upgrades packages. False to install
 *
 * @return bool true if all packages installed properly. False otherwise.
 */
function installAptPackages($packages, $upgrade_mode = false) : bool
{
    foreach ($packages as $package) {
        if (installAptPackage($package, $upgrade_mode) !== true) {
            return false;
        }
    }
    return true;
}

/**
 * Installs or upgrades an individual apt package.
 *
 * @param string $name         Name of package to install
 * @param bool   $only_upgrade Whether to upgrade or install a package
 *
 * @return bool True if package installed/upgraded successfull. Otherwise false
 */
function installAptPackage($name, $only_upgrade = false) : bool
{
    if ($only_upgrade) {
        $cmd = "sudo apt-get install --only-upgrade ";
    } else {
        $cmd = "sudo apt-get install ";
    }
    $cmd .= escapeshellarg($name);
    return doExec($cmd);
}

/**
 * Runs 3rd-party package managers using exec
 *
 * @return bool True if all commands execute correctly. False otherwise
 */
function runPackageManagers() : bool
{
    $cmd = 'composer install';
    if (!isDev()) {
        $cmd .= ' --no-dev';
    }
    if (doExec($cmd) === false) {
        return false;
    }

    $cmd = 'composer dump-autoload';
    if (doExec($cmd) === false) {
        return false;
    }

    $cmd = 'npm install';
    if (doExec($cmd) === false) {
        return false;
    }
    return true;
}

/**
 * Use wget to query Github API for latest LORIS release info
 *
 * @return string JSON data from Github API
 */
function getLatestReleaseInfo() : string
{
    // get latest release based on GithubAPI
    $release_url = 'https://api.github.com/repos/aces/Loris/releases/latest';
    // capture json content using wget in quiet mode, reading from STDIN
    return shell_exec('wget -qnv -O - ' . escapeshellarg($release_url));
}

/**
 * Slurps VERSION file in LORIS root and returns contents
 *
 * @param string $loris_root_dir The directory where LORIS is installed
 *
 * @return string LORIS version from VERSION file. '?' if not found
 */
function getVersionFromLORISRoot($loris_root_dir) : string
{
    // Backup source code to e.g. /tmp/bkp-LORIS_v19.x-dev_16-May-2018
    $version_filepath = $loris_root_dir . 'VERSION';
    if (!file_exists($version_filepath)) {
        echo "ERROR: Could not find VERSION file in $loris_root_dir." . PHP_EOL;
        return '?';
    }
    return trim(file_get_contents($version_filepath));
}

/**
 * Download zipped LORIS release code to $download_path
 *
 * @param string $download_path Path to release code download
 *
 * @return string, the download path if one exists, otherwise the empty string
 */
function downloadLatestRelease($download_path = '/tmp/loris_') : string
{
    echo "[-] Querying for latest release version... ";
    $j = json_decode(getLatestReleaseInfo());
    echo 'Got ' . $j->{'tag_name'} . PHP_EOL;
    $download_path .= $j->{'tag_name'}; // include

    $src_code_url   = $j->{'zipball_url'};
    $download_path .= '.zip';
    if (file_exists($download_path)) {
        echo "$download_path already exists. Not downloading." . PHP_EOL;
        return $download_path;
    }
    $cmd = "wget -qnv -O $download_path $src_code_url";
    exec($cmd, $output, $status);
    if ($status !== 0) {
        echo bashErrorToString($cmd, $output, $status);
        return '';
    }
    return $download_path;
}

/**
 * Check if all tools in $required are installed
 *
 * @param array $required Packages required by LORIS
 *
 * @return array of names of missing requirements
 */
function getMissingRequirements($required) : array
{
    $missing = [];
    foreach ($required as $tool) {
        if (!installed($tool)) {
            $missing[] = $tool;
        }
    }

    return $missing;
}

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
 * Returns true or false depending on whether the string 'dev' is in the
 * VERSION file.  This is used to determine whether the current LORIS instance
 * is a development instance or not.
 *
 * @return bool True if VERSION contains 'dev'. False otherwise.
 */
function isDev() : bool
{
    $config         = \NDB_Config::singleton();
    $paths          = $config->getSetting('paths');
    $version_string = getVersionFromLORISRoot($paths['base']);
    // if dev string exists in VERSION file
    return strpos($version_string, 'dev') !== false;
}

/**
 * Recursively copies a directory.  Items in $blacklist are not copied.
 *
 * @param string $src Path to directory to be copied
 * @param string $dst Path to the new copy
 *
 * @return void
 *
 * @link https://secure.php.net/manual/en/function.copy.php#91010
 */
function recurseCopy($src, $dst) : void
{
    $blacklist = [
                  '.',
                  '..',
                  '.git', // let git handle this
                  'vendor', // let composer handle this
                  'user_uploads', // could be very large files
                  'templates_c', // no need to backup compiled files
                 ];
    $dir       = opendir($src);
    if (file_exists($dst)) {
        echo "[-] WARNING: $dst already exists. Not backing up." . PHP_EOL;
        return;
    }
    mkdir($dst);
    while (false != ( $file = readdir($dir)) ) {
        // don't backup files in the blacklist
        foreach ($blacklist as $item) {
            if ($file === $item) {
                continue 2;
            }
        }
        if (!is_readable($src . '/' . $file)) {
            $out = "[-] WARNING: Insufficient permissions to read $file";
            if (is_dir($src . '/' . $file)) {
                $out .= '/';
            }
            $out .= '. This file/folder will not be backed up.' . PHP_EOL;
            echo $out;
            continue;
        }
        if (is_dir($src . '/' . $file) ) {
            recurseCopy($src . '/' . $file, $dst . '/' . $file);
        } else {
            copy($src . '/' . $file, $dst . '/' . $file);
        }
    }
    closedir($dir);
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
 * Gets user input from STDIN and checks if it matches a valye in
 * $possibleAnswers.  If not, the default answer is used.  Inteded to follow
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

    if (!in_array($answer, $possibleAnswers)) {
        return $defaultAnswer;
    }

    return $answer;
}

/**
 * Prints and executes a bash command using exec.  Prints an error message on
 * failure (a 0 exit code in bash is a success. Anything else is considered an
 * error here.
 *
 * @param string $cmd An executable bash command
 *
 * @return bool True if bash command exits normally. False otherwise.
 */
function doExec($cmd) : bool
{
    echo "[+] Executing bash command `$cmd`... " . PHP_EOL;
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
    $error = "[-] ERROR: Command `$cmd` failed (error code $status):" . PHP_EOL;
    if (is_iterable($output)) {
        foreach ($output as $item) {
            $error .= $item . PHP_EOL;
        }
    }
    return $error;
}
