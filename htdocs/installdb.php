<?php
/**
 * This file represents the main entry point into the Loris installer.
 *
 * It should only be accessed the first time LORIS is installed.
 *
 * Since it's written in PHP, obviously Apache and PHP are required to be
 * set up before accessing this page. Nonetheless, it will verify all
 * of the dependencies on the server being installed, create required
 * accounts, and source the schema. Users can either user the NeuroDebian,
 * or Docker packages or set them up themselves depending on their experience.
 *
 * The user must have also already run `composer install` before accessing
 * this page, because the vendor/autoload.php file is required to load smarty.
 *
 * It does the following:
 *    1. Check if LORIS is already installed (there's a config.xml
 *       setup), and if so bail to ensure it doesn't affect an
 *       existing system.
 *    2. Check that the external dependencies are installed (PHP version,
 *       MySQL, etc) and check their versions (if possible.)
 *    3. Prompt for the admin MySQL account to use for setup
 *    4. Check that the LORIS database doesn't already exist
 *    5. Prompt for (and create) the non-root MySQL user
 *    5a. Prompt for and update the LORIS frontend admin account username
 *       and password at the same time.
 *    6. Create the database, MySQL user, source the schema, and
 *       reset the admin username and password in the users table
 *    7. Write the config.xml if possible. If the directory isn't
 *       writable, print the content that should go there and ask
 *       the user to manually create the file.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

// the installer directory doesn't get autoloaded by composer, so we
// need to manually require this.
require_once __DIR__ . "/../php/installer/Installer.class.inc";

// Since LORIS isn't configured yet, these classes from the php/
// directory won't work. We need stubs for the installer to use, and
// they need to have the same name so that composer doesn't try and
// autoload the ones that we can't use which try to access config.xml.
// We don't need to implement all the functionality, just enough for
// smarty to use when it gets autoloaded.
require_once __DIR__ . "/../php/installer/Database.class.inc";
require_once __DIR__ . "/../php/installer/NDB_Config.class.inc";

$installer = new Installer("../project");

// Check the dependencies of this script.
if ($installer->CheckPreconditionsValid() === false) {
    $err = $installer->GetLastError();
    if ($err == "") {
        $err = "Unknown error checking LORIS install preconditions. Sorry.";
    }
    echo $err;
    exit(2);
}

// Check the dependencies of LORIS
if ($installer->CheckSystemDependenciesValid() == false) {
    $err = $installer->GetLastError();
    if ($err == "") {
        $err = "Unknown error checking system dependencies.";
    }
    echo $err;
    exit(3);
}

require_once __DIR__ . "/../vendor/autoload.php";

ini_set('default_charset', 'utf-8');
// Create an output buffer to capture console output, separately from the
// gzip handler.
//ob_start('ob_gzhandler');
ob_start();
$tpl_data = array();

// Page 1: Help, prompt server, root username, root password
// Page 2: 1. Connect with username/password
// 	2. Check has required permissions -- abort if not
//	 3. Source schema
// Page 3: Help, prompt for new username/password (include defaults)
// Page 4: 1. Check if user exists -- if so, error, if not create
//	 2. Update config.xml if write access, otherwise download copy
switch($_POST['formname']) {
case 'validaterootaccount':
    // This will connect to MySQL, check the permissions of the
    // account provided, check that the database doesn't already
    // exist, and create the database.
    if ($installer->CreateMySQLDB($_POST) === false) {
        $tpl_data['error'] = $installer->GetLastError();
        $tpl_data['Page']  = "";
        break;
    }
    if ($installer->SourceSchema($_POST) === false) {
        $tpl_data['error'] = $installer->GetLastError();
        $tpl_data['Page']  = "";
        break;
    }
    if ($installer->UpdateBaseConfig($_POST) === false) {
        $tpl_data['error'] = $installer->GetLastError();
        $tpl_data['Page']  = "";
        break;
    }

    $tpl_data['Page'] = "MySQLUserPrompt";
    break;
case 'createmysqlaccount':
    if ($installer->CreateMySQLAccount($_POST) === false) {
        $tpl_data['error'] = $installer->GetLastError();
        $tpl_data['Page']  = "MySQLUserPrompt";
        break;
    }

    if ($installer->ResetFrontEndAdmin($_POST) === false) {
        $tpl_data['error'] = $installer->GetLastError();
        $tpl_data['Page']  = "MySQLUserPrompt";
        break;
    }

    if ($installer->ConfigWritable()) {
        if ($installer->WriteConfig($_POST) === false) {
            $tpl_data['error'] = $installer->GetLastError();
            $tpl_data['Page']  = "MySQLUserPrompt";
            break;
        }
        $tpl_data['configfile'] = $installer->GetBaseDir() . "/project/config.xml";
    } else {
        $tpl_data['configlocation'] = $installer->GetBaseDir()
                 . "/project/config.xml";
        $tpl_data['configcontent']  = htmlspecialchars(
            $installer->GetConfigContent($_POST)
        );
    }
    $tpl_data['Page'] = "Done";
    break;
}
$tpl_data['console'] = htmlspecialchars(ob_get_contents());

// Set up some special smarty variables that are required on different
// pages
if ($tpl_data['Page'] == 'MySQLUserPrompt') {
    $tpl_data['SamplePassword']  = User::newPassword(16);
    $tpl_data['SamplePassword2'] = User::newPassword(16);
} else if ($tpl_data['Page'] == "Done") {
    $tpl_data['lorisurl'] = $installer->getBaseURL();
}
// end ob_start that captures console output. The Smarty hook
// needs to be able to write to the client.
ob_end_clean();

/**
 * Sets a tpl variable based on a request parameter.
 * Used to persist form elements between requests in case of error.
 *
 * @param string $name The request parameter to add to a smarty variable
 *
 * @return none
 */
function tplvar($name)
{
    global $tpl_data;
    if (isset($_REQUEST[$name])) {
        $tpl_data[$name] = $_REQUEST[$name];
    } else {
        $tpl_data[$name] = '';
    }
}
tplvar("dbhost");
tplvar("dbadminuser");
tplvar("dbadminpassword");
tplvar("dbname");
tplvar("lorismysqluser");
tplvar("lorismysqlpassword");
tplvar("frontenduser");
tplvar("frontendpassword");
$smarty = new Smarty_NeuroDB;
$smarty->assign($tpl_data);
$smarty->display('install.tpl');

//ob_end_flush();
?>
