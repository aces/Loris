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

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/PHP_CLI_Helper.class.inc';
require_once __DIR__ . '/generic_includes.php';

error_reporting(E_ALL);
/* Do validation and CLI flag processing */
$required_major_php = 7; //TODO: Update these values as time passes
$required_minor_php = 2;
$required_major_apache = 2;
$required_minor_apache = 4;
// PHP version required for LORIS.
$required_php = "$required_major_php.$required_minor_php";
if (PHP_MAJOR_VERSION < $required_major_php
    || PHP_MINOR_VERSION < $required_minor_php
) {
    die(
        "[-] ERROR: {$argv[0]} and LORIS require PHP v$required_php or higher."
        . PHP_EOL
    );
}
// PHP version required for LORIS.
$apache_info = shell_exec('apache2 -v');
/* Look for the string "$major.$minor" in info string. Also match on versions
 * higher than minor version because we want AT LEAST that version.
 */
$pattern = "/$required_major_apache\.[$required_minor_apache-9]/";
if (preg_match($pattern, $apache_info) === 0) {
    $required_apache = "$required_major_apache.$required_minor_apache";
    die(
        "[-] ERROR: LORIS requires Apache v$required_apache or higher."
        . PHP_EOL
    );
}

// Check that the backup directory argument is present and valid
$backup_dir = $argv[1] ?? '';
if (!is_dir($backup_dir)) {
    echo '[-] ERROR: Argument suppled for backup directory is not a valid '
        . 'directory.' . PHP_EOL;
    die(usageString());
}
// Only apply SQL patches if user explicitly requests it
$apply_patches = false;
if (in_array('--apply-patches', $argv, true)) {
    $apply_patches = true;
}

/* BEGIN UPDATE PROCESS */

/* Below are all the apt packages required for LORIS to run.
 *      @see: https://github.com/aces/Loris/wiki/Installing-Loris-in-Depth
 */
$loris_requirements = [
                       "wget",
                       "zip",
                       "unzip",
                       "php-json",
                       "npm",
                       "software-properties-common",
                       "php-ast",
                       "php$required_php",
                       "php$required_php-mysql",
                       "php$required_php-xml",
                       "php$required_php-json",
                       "php$required_php-mbstring",
                       "php$required_php-gd",
                       "libapache2-mod-php$required_php",
                      ];
// Update apt packages.
echo '[**] Updating required packages...' . PHP_EOL;
if (updateRequiredPackages($loris_requirements)) {
    echo '[**] Required apt packages up-to-date.' . PHP_EOL;
}

// Create db connection and get LORIS version info.
$config    = \NDB_Config::singleton();
$db_config = $config->getSetting('database');
$db        = \Database::singleton();

$paths     = $config->getSetting('paths');
$loris_root_dir = $paths['base'];
// Update other dependencies via e.g. composer and npm
echo '[**] Updating dependencies via package managers...' . PHP_EOL;
chdir($loris_root_dir); // Composer will fail if not in LORIS root
if (runPackageManagers()) {
    echo '[**] Dependencies up-to-date.' . PHP_EOL;
}

// Update source code.


$preupdate_version = getVersionFromLORISRoot($loris_root_dir);
$info            = json_decode(getLatestReleaseInfo());
$release_version = $info->{'tag_name'};
$release_version = substr($release_version, 1); // remove leading 'v'

// Require a confirm flag so nothing is overwritten by accident
if (!in_array('--confirm', $argv, true)) {
    echo "Your LORIS version is $preupdate_version. The current LORIS version "
        . "is $release_version. "
        . PHP_EOL
        . 'Please run this script with the --confirm flag '
        . 'to update your source code to version ' . $release_version
        . PHP_EOL;
    die(usageString());
}
// Display some info and wait so the user can read it.
echo 'This script will prompt for superuser privileges,'
    . ' as they are needed to e.g. update apt packages.' . PHP_EOL;
echo 'You may wish to review code changes tagged with "Caveat For '
    . 'Existing Projects" as they may include changes to your workflow. '
    . PHP_EOL
    . "\t" . 'See: https://github.com/aces/Loris/pulls?'
    . 'q=is%3Apr+label%3A%22Caveat+for+Existing+Projects%22+is%3Amerged'
    . PHP_EOL . PHP_EOL;
sleep(3);
echo '[***] Beginning LORIS update process.' . PHP_EOL;
echo '[*] Release notes:' . PHP_EOL;
echo $info->{'body'} . PHP_EOL . PHP_EOL;
echo "[**] Updating LORIS source code "
    . "($preupdate_version --> $release_version)" . PHP_EOL;
if (updateSourceCode($loris_root_dir, $backup_dir)) {
    echo '[+] LORIS source code files successfully updated.' . PHP_EOL;
}


// Print required SQL patches and commands needed to apply them
if ($apply_patches === true && $preupdate_version === '?') {
    echo "[-] Preupdate version unknown. Can't apply patches!" . PHP_EOL;
} else {
    $patches = getPatchesFromVersion(
        $loris_root_dir,
        $preupdate_version,
        $release_version
    );
    if (count($patches) > 0) {
        echo "[*] Patches to update:" . PHP_EOL;
        foreach ($patches as $filename) {
            echo "\t] " . $filename . PHP_EOL;
        }
        echo '[*] Applying SQL patches...' . PHP_EOL;
        applyPatches($patches, $db_config, $apply_patches);
    } else {
        echo '[*] No patches to apply...' . PHP_EOL;
    }
}
echo "[***] Done." . PHP_EOL;

/**
 * Creates a backup of LORIS root.  Downloads and extracts new files from
 * the newest release on Github.  Overwrites source code with new files.  Script
 * will die on certain errors.
 *
 * @param string $loris_root_dir The directory where LORIS is installed
 * @param string $backup_dir     The directory prefix where backups are stored.
 *
 * @return bool True if rsync executes successfully, false otherwise.
 */
function updateSourceCode(string $loris_root_dir, string $backup_dir) : bool
{
    // Backup source code to e.g. /tmp/bkp-LORIS_v19.x-dev_16-May-2018
    $backup_dir      .= 'bkp-LORIS';
    $version_filepath = $loris_root_dir . 'VERSION';
    $backup_dir      .= '_v' . getVersionFromLORISRoot($loris_root_dir);
    $backup_dir      .= '_' . date("j-M-Y") . '/'; // e.g. 10-May-2018
    echo "[*] Backing up $loris_root_dir to $backup_dir" . PHP_EOL;
    recurseCopy($loris_root_dir, $backup_dir);

    // Get the release code from Github
    $tarball_path = downloadLatestRelease();
    if (empty($tarball_path)) {
        die('[-] ERROR: Could not download the latest LORIS release.');
    }
    $dst_dir = '/tmp/'; // Parent directory for source code download
    echo '[*] Extracting release files...' . PHP_EOL;
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
        die("[-] ERROR: Could not find downloaded files in $dst_dir" . PHP_EOL);
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
        && (installAptPackages($requirements)))
    {
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
 * @param string $loris_root   The directory where LORIS is installed.
 * @param string $version_from Pre-update LORIS version.
 * @param string $version_to   Post-update LORIS version.
 *
 * @return array Patch files to be applied. Empty if up-to-date.
 */
function getPatchesFromVersion(
    $loris_root,
    $version_from,
    $version_to
): array {

    // Definie indices corresponding to our semantic versioning system.
    define('MAJOR', 0);
    define('MINOR', 1);
    define('BUGFIX', 2);
    // Convert string representation of version into arrays of ints
    $from_versions = array_map('intval', explode('.', $version_from));
    $to_versions   = array_map('intval', explode('.', $version_to));
    // Calculate difference between old version and latest
    $diff_major = $to_versions[MAJOR] - $from_versions[MAJOR];
    $diff_minor = $to_versions[MINOR] - $from_versions[MINOR];
    /* Display output based on version differences. Actual patching occurs
     * below.
     */
    if ($diff_major < 0) {
        echo '[!] Your version of LORIS is ahead of the latest release. If you '
            . 'are not a developer working on the bleeding edge of LORIS, then '
            . 'something has gone very wrong. SQL patches will not be applied.'
            . PHP_EOL;
        return array();
    } else if ($diff_major === 0) {
        // If major version is equal, check for difference in minor releases.
        if ($diff_minor < 0) {
            /* Major versions equal, but installed minor version is ahead of the
             * latest release.
             */
            echo '[!] Your version of LORIS is ahead of the latest release. If '
                . 'you are not a developer working on the bleeding edge of '
                . 'LORIS, then something has gone very wrong. SQL patches will '
                . 'not be applied.'
                . PHP_EOL;
            return array();
        }
        if ($diff_minor > 0) {
            echo "[**] Latest version $version_to is ahead of installed "
                . "$version_from by $diff_minor MINOR release(s)."
                . PHP_EOL;
        } else {
            // If major and minor differences are 0, then LORIS is up-to-date.
            echo "[**] Major and minor versions are equal. No patches to "
                . "apply."
                . PHP_EOL;
            return array();
        }
    } else {
        echo "[**] Latest version $version_to is ahead of installed "
            . "$version_from by $diff_major MAJOR release(s)"
            . PHP_EOL;
    }

    /* Following a discussion on this pull request, it was decided that patching
     * SQL files automatically when a LORIS is more than one version behind
     * should not be supported. This is to minimize errors that could impact
     * data integrity.
     * https://github.com/aces/Loris/pull/3677#discussion_r202814374
     */
    if ($diff_major > 1) {
        echo "[!] Updating database schema when more than one major release "
            . "behind is not supported. Patches will not be applied."
            . PHP_EOL;
        return array();
    }
    /* Similarly, applying patches across multiple minor versions is potentially
     * risky. The user must explicitly opt-in to doing so.
     */
    if ($diff_minor > 1) {
        echo "[!] Updating database schema when more than one minor release "
            . "behind is considered risky. It is recommended to review the "
            . "release notes before continuing and to proceed with caution."
            . PHP_EOL;
        $answers       = [
            'y',
            'N',
        ];
        $defaultAnswer = 'N';
        writeQuestion('Apply patches anyway?', $answers);
        $answer = readAnswer($answers, $defaultAnswer);
        if ($answer != 'y') {
            return array();
        }
    }


    // Add the relevant patches between $start and $end.
    // For example, if upgrading from 18 to 19, the array will contain all 
    // patches beginning with "18", or "19".
    // i.e.:
    //   [0] => /var/www/loris/SQL/Release_patches/18.0_To_19.0_upgrade.sql
    //   [1] => /var/www/loris/SQL/Release_patches/19.0_To_19.1_upgrade.sql
    // Range will run one time when $start = $end. We want this in the case where
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
    return $patches;
}

/**
 * Apply a list of SQL patch files using exec.
 *
 * @param array      $patches       Patch files to be applied
 * @param dictionary $db_config     DB config info. Needed for credentials
 * @param bool       $apply_patches If true, MySQL commands will be run
 *
 * @return bool Whether patches should be automaticaly applied.
 */
function applyPatches($patches, $db_config, $apply_patches = false) : bool
{
    // Iterate over all patches and source them into MySQL
    $A = $db_config['database'];
    $u = $db_config['username'];
    $h = $db_config['host'];
    $privileges = getPrivileges($db_config);
    if ($apply_patches === false) {
        echo '[-] NOTE: Running in Report-Only mode. Patching commands will be '
            . 'displayed but not executed.' . PHP_EOL;
        sleep(1);
    }
    while (count($patches) > 0) {
        $patch = array_shift($patches);
        /* Check that the user has all required privileges before attempting
         * to source MySQL script.
         */
        if (!canApplyPatch($patch, $db_config)) {
            $missing = implode(',', getMissingPrivileges($patch, $db_config));
            echo "[!] DB user $u does not have all the privileges necessary "
                . "to execute MySQL script located at $patch."
                . PHP_EOL
                . "Missing: `$missing`. Can't continue."
                . PHP_EOL;
            return false;
        }
        /* Attempt to source SQL patches. Return false on error. */
        $cmd   = "mysql -h $h -u $u -p -A $A < $patch";
        if ($apply_patches === true) {
            if (doExec($cmd) === false) {
                if (count($patches) > 0) {
                    echo "[!] Aborting the following queued commands:"
                        . PHP_EOL;
                    foreach ($patches as $patch_not_applied) {
                        echo "\t] mysql -h $h -u $u -p -A $A "
                            . "< $patch_not_applied" . PHP_EOL;
                    }
                }
                echo PHP_EOL;
                return false;
            }
        } else {
            echo "\t] $cmd" . PHP_EOL;
        }
    }
    return true;
}

function getPrivileges($db_config): array {
    $A = $db_config['database'];
    $u = $db_config['username'];
    $h = $db_config['host'];
    $p = $db_config['password'];
    /* Run 'SHOW privileges' for this user and parse the output. We are passing
     * the password value on bhelaf of the user here as the SHOW command does
     * not alter any data.
     *
     * NOTE this may have issues when dealing with passwords that contain
     * special characters that the shell may interpret differently. TBD.
     */
    $cmd = "echo 'show privileges' "
        . "| mysql -h $h -u $u --password='$p' -A $A "
        . "| cut -f 1";
    return array_map('strtolower',
        explode(
            "\n", 
            /* Don't use doExec() here because we are entering the password and 
             * don't want it printed to stdout.
             */
            shell_exec($cmd)
        )
    );
}


/**
 * Using the keywords from a MySQL script, determine whether the user in
 * $db_config is able to execute all the commands corresponding to the keywords.
 */
function canApplyPatch(string $patch, $db_config): bool
{
    $num_missing = count(
        getMissingPrivileges(
            $patch,
            $db_config
        )
    );
    return $num_missing === 0;
}

/**
 * Use bash commands to extract MySQL keywords from an sql script.
 */
function getKeywords(string $patch): array
{
    //Scan file for MySQL keywords. Exclude comments and parentheses using grep.
    $cmd = "cut $patch -d ' ' -f 1 "
        . "| sort -u "
        . "| grep -v '\--' | grep -v ')'";
    /* Processing chain: 
     *     Split output of shell exec by new lines into an array
     *     Convert all array values to lower case
     *     Filter out any false values, empty strings in this case.
     */
    return array_filter(
        array_map(
            'strtolower',
            explode(
                "\n", 
                /* Don't use doExec() here because we are entering the password
                 * and don't want it printed to stdout.
                 */
                shell_exec($cmd)
            )
        )
    );
}
function getMissingPrivileges(string $patch, $db_config) {
    $keywords = getKeywords($patch);
    $privileges = getPrivileges($db_config);
    $irrelevantWords = array(
        'prepare',
        'deallocate',
        'set',
    );
    // Filter out keywords that we don't care about
    $keywords = array_filter(
        $keywords, 
        function ($word) use($irrelevantWords) {
            return !in_array($word, $irrelevantWords, true);
        }
    );
    return array_diff($keywords, $privileges);
}

/**
 * Prints a list of missing apt packages and prompts user to install them.
 *
 * @param array $requirements Required packages determined missing earlier
 *
 * @return bool True if all packages install properly. False otherwise.
 */
function installMissingRequirements(array $requirements): bool
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
        echo "[-] ERROR: Could not find VERSION file in $loris_root_dir."
            . PHP_EOL;
        return '?';
    }
    return trim(file_get_contents($version_filepath));
}

/**
 * Download zipped LORIS release code to $download_path
 *
 * @param string $download_path Path to release code download.
 *
 * @return string The download path if one exists, otherwise the empty string.
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
        echo "[-] $download_path already exists. Not downloading." . PHP_EOL;
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
            echo "MISSING: $tool" .PHP_EOL;
            $missing[] = $tool;
        }
    }

    return $missing;
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
 * Returns a string displaying the proper usage of this script
 *
 * @return string Usage information
 */
function usageString() : string
{
    $flags = [
              '<backup-directory>',
              '--confirm',
              '[--apply-patches]',
             ];
    return 'Usage: php update.php ' . implode(' ', $flags) . PHP_EOL;
}
