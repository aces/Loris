<?php

// update LORIS
//
// 1. Create a back-up of the DB and of the loris root (?)
//
// 2. Update server dependencies (e.g. PHP version, other dependencies0
//
// 3. Clone/download files from LORIS
//
// 4. Overwrite LORIS path files (rsync?)
//
// 5. Check last patch applied in ~/.loris/
//
// 6. Source SQL patches in chronological order
//
// 7. Run package managers (composer, npm, ....)
//
// 8. Rollback?
//
require_once __DIR__ . "/../vendor/autoload.php";
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";

error_reporting(E_ALL);
if (posix_geteuid() !== 0) {
    die('This script won\'t work without superuser privileges'
        . ' as they are needed to e.g. update apt packages.' . PHP_EOL
        . 'Please run this script again as `sudo php ' . $argv[0] . '`' 
        . PHP_EOL
    );
}
if (PHP_MAJOR_VERSION < 7) {
    die("{$argv[0]} and LORIS require PHP 7 or higher.");
}
main();

function main() {
    // start db connection
    $config    = \NDB_Config::singleton();
    $db_config = $config->getSetting('database');
    $db        = \Database::singleton(
        $db_config['database'],
        $db_config['username'],
        $db_config['password'],
        $db_config['host']
    );
    // make sure we have all the tools necessary to run the script
    $script_dependencies = [
        'wget',
        'tar',
        'php-json',
    ];
    if (installMissingScriptRequirements($script_dependencies) === false) {
        die("Could not install required dependencies for $argv[0]. Exiting."
            . PHP_EOL
        );
    }
    echo 'All script dependencies satisfied.' . PHP_EOL;

    $paths = $config->getSetting('paths');
    $loris_root_dir = $paths['base'];
    $backup_dir = "/tmp/bkp_loris"; // TODO: maybe later this should be configurable

    $version_filepath = $loris_root_dir . 'VERSION';
    if (!file_exists($loris_root_dir . 'VERSION')) {
        echo "Could not find VERSION file in $loris_root_dir." . PHP_EOL;
    } else {
        $backup_dir .= '-v' . trim(file_get_contents($version_filepath));
    }
    $backup_dir .= '_' . date("D-M-j-Y") . '/'; // format: Thu-May-10-2018
    
    echo "Backing up $loris_root_dir to $backup_dir" . PHP_EOL;
    recurse_copy($loris_root_dir, $backup_dir);
    $archive_path = downloadLatestRelease();
    if (empty($archive_path)) {
        die('Could not download the latest LORIS release.');
    }
    $ext = pathinfo($archive_path, PATHINFO_EXTENSION);
    if ($ext === 'zip') {
        echo "Zip found for $archive_path";
        #shell_exec('tar -zxvf $archive_path -C $loris_root_dir');
    } else if ($ext === 'gz') {
        echo "Tar/gzip found for $archive_path";
        #shell_exec('unzip -o $archive_path -d $loris_root_dir');
    } else {
        die('Can\'t do anything with extension' . $ext . PHP_EOL);
    }
}

function installMissingScriptRequirements($dependencies) : bool
{
    $tools_to_install = getMissingScriptRequirements($dependencies);
    if (empty($tools_to_install)) {
        return true;
    }
    echo "Found missing requirements" . PHP_EOL;
    foreach ($tools_to_install as $tool) {
        echo "\t* {$tool}" . PHP_EOL;
    }
    $answers = ['Y', 'n'];
    $defaultAnswer = 'Y';
    writeQuestion('Do you want to install them now?', $answers);
    $answer = readAnswer($answers, $defaultAnswer);
    if ($answer != 'Y') return false;
    echo 'OK.' . PHP_EOL;
    return installAptPackages($tools_to_install);
}

/** Takes an array of packages to install using apt-get
 *
 * @return bool true if all packages installed properly. False otherwise.
 */
function installAptPackages($packages) : bool
{
    foreach($packages as $package) {
        if (installAptPackage($package) === false) {
            return false;
        }
    }
    return true;
}

function installAptPackage($name) : bool 
{
    $cmd = "apt-get install {$name}";
    echo "Running command `$cmd`...";
    exec($cmd, $output, $status);
    // in Bash a 0 exit status means success
    if ($status !== 0) {
        echo "ERROR: Command `$cmd` failed (error code $status): $output" 
             . PHP_EOL;
        return false;
    }
    echo ' Done.' . PHP_EOL;
    return true;
}

/**
 *
 *
 * @return string, the download path if one exists, otherwise the empty string 
 */
function downloadLatestRelease($download_path = '/tmp/loris_') : string {
    // get latest release based on GithubAPI
    echo "Querying for latest release version...";
    $release_url = 'https://api.github.com/repos/aces/Loris/releases/latest';
    // capture json content using wget in quiet mode, reading from STDIN
    $response = shell_exec('wget -qnv -O - ' . escapeshellarg($release_url));
    $j = json_decode($response);
    echo 'Got ' . $j->{'tag-name'} . PHP_EOL;
    $download_path .= $j->{'tag_name'}; // include

    $src_code_url = $j->{'tarball_url'};
    $download_path .= '.tar.gz';
    if(file_exists($download_path)) {
        echo "$download_path already exists. Aborting download." . PHP_EOL;
        return $download_path;
    }
    $cmd = "wget -qnv -O $download_path $src_code_url";
    exec($cmd, $output, $status);
    if ($status !== 0) {
        echo "Command `$cmd` failed (exit code $status): $output" . PHP_EOL;
        return '';
    }
    return $download_path;
}

/** Check that tools required by this script are installed
 *
 * @return array of names of missing dependencies
 */
function getMissingScriptRequirements($required) : array
{
    $missing = [];
    foreach($required as $tool){
        if (!installed($tool)) $missing[] = $tool;
    }

    return $missing;
}

function getLatestVersion(){
}

/** Use bash to determine if certain unix tools are installed
 *
 * return bool representing if tool is installed
 */
function installed($tool) : bool
{
    // `which` returns empty if a tool is not installed. 
    // shell_exec captures this output.
    if (shell_exec("which $tool")) return true;
    // check installed pacakages with dpkg. Returns 0 if installed.
    exec("dpkg -s $tool", $output, $status);
    if ($status === 0) return true;
    return false;
}

function update_apt_packages() {
    $dependencies = [];
}

/** 
 * @link https://secure.php.net/manual/en/function.copy.php#91010
 */
function recurse_copy($src,$dst) { 
    $blacklist = [
        '.',
        '..',
        '.git', // let git handle this
        'vendor', // let composer handle this
    ];
    $dir = opendir($src); 
    if (file_exists($dst)){
        echo "WARNING: $dst already exists. Not backing up." . PHP_EOL;
        return;
    }
    mkdir($dst); 
    while(false != ( $file = readdir($dir)) ) { 
        // don't backup files in the blacklist
        foreach($blacklist as $item) {
            if ($file === $item) continue 2;
        }
        if (!is_readable($src . '/' . $file)) {
            $out = "WARNING: Insufficient permissions to read $file";
            if (is_dir($src . '/' . $file)) $out .= '/';
            $out .= '. This file/folder will not be backed up' . PHP_EOL;
            echo $out;
            continue;
        }
        if ( is_dir($src . '/' . $file) ) { 
            recurse_copy($src . '/' . $file, $dst . '/' . $file); 
        } 
        else { 
            copy($src . '/' . $file, $dst . '/' . $file); 
        } 
    } 
    closedir($dir); 
}

/** Check that all required system dependencies are installed
 *
 * @return array of names of missing dependencies
 */
function getMissingSystemRequirements() : array
{
    $missing = [];

    // Check that we have the php json libraries. These are not installed by
    // default on Debian.
    if (!function_exists('json_encode')) {
        $missing[] = 'php-json';
    }

    return $missing;
}


/** Check that the system being installed on meets all LORIS dependencies
 * which can be checked.
 *
 * @return true if system is dependable.
 */
function getOutdatedSystemRequirements() : array
{
    $outdated = [];
    // Check PHP version is supported.
    if (PHP_MAJOR_VERSION < 7) {
        $outdated[] = 'php';
    }

    return $outdated;
}

function writeQuestion($question, $answers)
{
        echo $question . ' (' . implode('/', $answers) . '): ' . PHP_EOL;
}

function readAnswer($possibleAnswers, $defaultAnswer)
{
    $in = fopen('php://stdin', 'rw+');
    $answer = trim(fgets($in));

    if(!in_array($answer, $possibleAnswers))
    {
        return $defaultAnswer;
    }

    return $answer;
}

