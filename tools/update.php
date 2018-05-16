<?php

// update LORIS
//
// 1. Create a back-up of the DB and of the loris root (?)
//
// 2. Update server requirements (e.g. PHP version, other requirements0
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
if (PHP_MAJOR_VERSION < 7) {
    die("{$argv[0]} and LORIS require PHP 7 or higher.");
}
echo'This script will prompt for superuser privileges'
    . ' as they are needed to e.g. update apt packages.' . PHP_EOL;
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
    // PHP version required for LORIS. Change this value as needed.
    $version = '7.2'; 
    // all necessary apt packages to get LORIS running
    //https://github.com/aces/Loris/wiki/Installing-Loris-in-Depth
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
    updateRequiredPackages($loris_requirements);

    $paths = $config->getSetting('paths');
    $loris_root_dir = $paths['base'];
    $backup_dir = "/tmp/bkp_loris"; // TODO: should this be configurable?

    $version_filepath = $loris_root_dir . 'VERSION';
    if (!file_exists($version_filepath)) {
        echo "Could not find VERSION file in $loris_root_dir." . PHP_EOL;
    } else {
        $backup_dir .= '-v' . trim(file_get_contents($version_filepath));
    }
    $backup_dir .= '_' . date("D-M-j-Y") . '/'; // format: Thu-May-10-2018
    
    echo "Backing up $loris_root_dir to $backup_dir" . PHP_EOL;
    recurse_copy($loris_root_dir, $backup_dir);
    $tarball_path = downloadLatestRelease();
    if (empty($tarball_path)) {
        die('Could not download the latest LORIS release.');
    }
$dst_dir = '/tmp/';
    $cmd = "unzip -o " .escapeshellarg($tarball_path) . ' -d ' 
        . escapeshellarg($dst_dir);
    exec($cmd, $output, $status);
    if ($status !== 0) {
        die(bashErrorToString($cmd, $output, $status));
    }
    // TODO: Retrive name of inflated directory. aces_Loris_commit(?)
    // TODO: Use rsync to overwrite files in $loris_root
}

function updateRequiredPackages($requirements) : bool {
    echo 'Updating required packages...' . PHP_EOL;
    echo 'Adding external PPA for most up-to-date PHP' . PHP_EOL;
    // -y flag required to suppress a message from the author
    exec('sudo apt-add-repository ppa:ondrej/php -y');
    exec('sudo apt-add-repository ppa:ondrej/apache2 -y');

    echo 'Updating apt package list...' . PHP_EOL;
    exec('sudo apt-get update');
    // die unless all required packages are installed and up-to-date
    if (!(installMissingRequirements($requirements))
        && (installAptPackages($requirements, $upgrade_mode = true))) {
        die('Could not upgrade all required packages. Exiting.'
            . PHP_EOL
        );
    }
    echo 'All requirements satisfied and up-to-date.' . PHP_EOL;
    return true;
}

function installMissingRequirements($requirements) : bool
{
    $to_install = getMissingRequirements($requirements);
    if (empty($to_install)) {
        return true;
    }
    echo 'Required package(s) not installed:' . PHP_EOL;
    foreach ($to_install as $tool) {
        echo "\t* {$tool}" . PHP_EOL;
    }
    $answers = ['Y', 'n'];
    $defaultAnswer = 'Y';
    writeQuestion('Install now?', $answers);
    $answer = readAnswer($answers, $defaultAnswer);
    if ($answer != 'Y') {
        echo 'Not installing requirements...' . PHP_EOL;
        return false;
    }
    echo 'Installing requirements...' . PHP_EOL;
    return installAptPackages($to_install);
}

/** Takes an array of packages to install using apt-get
 *
 * @return bool true if all packages installed properly. False otherwise.
 */
function installAptPackages($packages, $upgrade_mode = false) : bool
{
    foreach($packages as $package) {
        if (installAptPackage($package, $upgrade_mode) !== true) {
            return false;
        }
    }
    return true;
}

function installAptPackage($name, $only_upgrade = false) : bool 
{
    if ($only_upgrade) {
        $cmd = "sudo apt-get install --only-upgrade ";
    } else {
        $cmd = "sudo apt-get install ";
    }
    $cmd .= escapeshellarg($name);
    echo "Running command `$cmd`...";
    exec($cmd, $output, $status);
    // in Bash a 0 exit status means success
    if ($status !== 0) {
        echo bashErrorToString($cmd, $output, $status);
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
    echo "Querying for latest release version... ";
    $release_url = 'https://api.github.com/repos/aces/Loris/releases/latest';
    // capture json content using wget in quiet mode, reading from STDIN
    $response = shell_exec('wget -qnv -O - ' . escapeshellarg($release_url));
    $j = json_decode($response);
    echo 'Got ' . $j->{'tag_name'} . PHP_EOL;
    $download_path .= $j->{'tag_name'}; // include

    $src_code_url = $j->{'zipball_url'};
    $download_path .= '.zip';
    if(file_exists($download_path)) {
        echo "$download_path already exists. Aborting download." . PHP_EOL;
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

/** Check that tools required by this script are installed
 *
 * @return array of names of missing requirements
 */
function getMissingRequirements($required) : array
{
    $missing = [];
    foreach($required as $tool){
        if (!installed($tool)) $missing[] = $tool;
    }

    return $missing;
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

/** 
 * @link https://secure.php.net/manual/en/function.copy.php#91010
 */
function recurse_copy($src,$dst) { 
    $blacklist = [
        '.',
        '..',
        '.git', // let git handle this
        'vendor', // let composer handle this
        'user_uploads', 
        'templates_c', // no need to backup compiled files
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

function bashErrorToString($cmd, $output, $status) : string
{
    $error = "ERROR: Command `$cmd` failed (error code $status):" . PHP_EOL;
    if (is_iterable($output)){
        foreach($output as $item) {
            $error .= $item . PHP_EOL;
        }
    }
    return $error;
}
