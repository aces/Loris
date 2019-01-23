<?php

/**
 * This script takes as input a 'from' version and a 'to' version and returns
 * a list of SQL patches to be run in order to update LORIS from one version to
 * another. Optionally this script can automatically apply the correct sequence
 * of patches. This can only be done if the interval between the supplied
 * versions is not greater than one major release of LORIS.
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
// Only apply SQL patches if user explicitly requests it
$apply_patches = false;
if (in_array('--apply-patches', $argv, true)) {
    $apply_patches = true;
}

// Create db connection and get LORIS version info.
$config    = \NDB_Config::singleton();
$db_config = $config->getSetting('database');
$db        = \Database::singleton();

$paths     = $config->getSetting('paths');
$loris_root_dir = $paths['base'];

// Require a confirm flag so nothing is overwritten by accident
if (!in_array('--confirm', $argv, true)) {
    echo "Your LORIS version is $preupdate_version. The current LORIS version "
        . "is $release_version. "
        . PHP_EOL
        . 'Please run this script with the --confirm flag '
        . 'to update your database to be compatible with version ' 
        . $release_version . PHP_EOL;
    die(usageString());
}
// Display some info and wait so the user can read it.
echo 'You may wish to review code changes tagged with "Caveat For '
    . 'Existing Projects" as they may include changes to your workflow. '
    . PHP_EOL
    . "\t" . 'See: https://github.com/aces/Loris/pulls?'
    . 'q=is%3Apr+label%3A%22Caveat+for+Existing+Projects%22+is%3Amerged'
    . PHP_EOL . PHP_EOL;
echo '[***] Beginning LORIS update process.' . PHP_EOL;
echo '[*] Release notes:' . PHP_EOL;
echo $info->{'body'} . PHP_EOL . PHP_EOL;

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
 * Slurps VERSION file in LORIS root and returns contents
 *
 * @param string $loris_root_dir The directory where LORIS is installed
 *
 * @return string LORIS version from VERSION file. '?' if not found
 */
function getVersionFromLORISRoot(string $loris_root_dir) : string
{
    $version_filepath = $loris_root_dir . 'VERSION';
    if (!file_exists($version_filepath)) {
        echo "[-] ERROR: Could not find VERSION file in $loris_root_dir."
            . PHP_EOL;
        return '?';
    }
    return trim(file_get_contents($version_filepath));
}

/**
 * Returns a string displaying the proper usage of this script
 *
 * @return string Usage information
 */
function usageString() : string
{
    $flags = array(
              '--apply-patches',
              '--confirm',
             );
    return 'Usage: php update.php ' . implode(' ', $flags) . PHP_EOL;
}
