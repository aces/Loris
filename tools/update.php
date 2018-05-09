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

if (posix_geteuid() !== 0) {
    die('This script won\'t work without superuser privileges' .
        ' as they are needed to e.g. update apt packages.' . PHP_EOL);
}
main();

function main() {
    error_reporting(E_ALL);
    // start db connection
    $config    = \NDB_Config::singleton();
    $db_config = $config->getSetting('database');
    $db        = \Database::singleton(
        $db_config['database'],
        $db_config['username'],
        $db_config['password'],
        $db_config['host']
    );

    $paths = $config->getSetting('paths');
    $loris_root_dir = $paths['base'];
    $backup_dir = "/tmp/bkp_loris/"; // TODO: maybe later this should be configurable
    
    echo "Backing up $loris_root_dir to $backup_dir..." . PHP_EOL;
    //recurse_copy($loris_root_dir, $backup_dir);
    downloadLatestRelease();
}


function downloadLatestRelease($download_dir = '/tmp/loris_release') {
    // get latest release based on GithubAPI
    $url = 'https://api.github.com/repos/aces/Loris/releases/latest';
    if (!installed('which wget')) {
        $response = shell_exec('wget -qnv -O - ' . $url);
    } else {
        die('wget does not exist in the system. Can\'t fetch release.');
    }
    $j = json_decode($response);

    if (shell_exec('which unzip')) {
        shell_exec("wget -O $download_dir $j->{'zipball_url'}");
    } else if (shell_exec('which tar')) {
        shell_exec("wget -O $download_dir $j->{'tarball_url'}");
    } else {
        die('Could not find either unzip or tar on the system.'
            . ' Not downloading release because the files can\'t be'
            . ' extracted.' . PHP_EOL;
        );
    }

}

function installed($tool) : boolean {
    if(shell_exec("which $tool")) return true;
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
        echo "$dst already exists. Not backing up" . PHP_EOL;
        return;
    }
    mkdir($dst); 
    while(false != ( $file = readdir($dir)) ) { 
        // don't backup files in the blacklist
        foreach($blacklist as $item) {
            if ($file === $item) continue 2;
        }
        if (!is_readable($src . '/' . $file)) {
            $out = "Insufficient permissions to read $file";
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
