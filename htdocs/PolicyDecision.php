<?php declare(strict_types=1);

/**
 * Used for saving a User's policy decision
 *
 * PHP Version 8
 *
 * @category Loris
 * @package  LORIS
 * @author   Saagar Arya <saagar.arya@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */


set_include_path(
    get_include_path() . ":" .
    __DIR__ . "/../project/libraries:" .
    __DIR__ . "/../php/libraries"
);

require_once __DIR__ . "/../vendor/autoload.php";
// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client    = new NDB_Client();
$anonymous = ($client->initialize() === false);
if ($anonymous) {
    // If the user is not logged in, we cannot save the policy decision.
    exit;
}

\Utility::saveUserPolicyDecision(
    $_REQUEST['ModuleName'],
    $_REQUEST['PolicyName'],
    $_REQUEST['decision']
);