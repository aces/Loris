#!/usr/bin/php
<?php
/**
 * This script resets a user's password. It assumes it's being
 * run by an administer on the server and doesn't validate the
 * user's password, just blindly resets it.
 *
 * PHP Version 5
 *
 * @category Tools
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
const MIN_NUMBER_OF_ARGS = 2;
$args = $argv;
if ($args[0] == 'php') {
	$args = array_slice($argv, 1);
}
if (count($args) < MIN_NUMBER_OF_ARGS) {
	fwrite(STDERR, "Usage: resetpassword.php username\n");
	fwrite(STDERR, "\nresetpassword.php will prompt for password on stdin\n");
	exit(2);
}

$user = $args[1];

$validate = $DB->pselectOne("SELECT UserID FROM users WHERE UserID=:username", array("username" => $user));
if (empty($validate)) {
	fwrite(STDERR, "Invalid username: $user\n");
	exit(3);
}
echo "Resetting password for user: $user\n";
echo "New password: ";

// Don't echo the password being typed
`/bin/stty -echo`;
$newPass = trim(fgets(STDIN));
$newHash = password_hash($newPass, PASSWORD_DEFAULT);
`/bin/stty echo`;

;

// this script is assumed to be being run by an admin, since they have local
// access to the server. There's no validation of the old password.
$DB->update("users", array("Password_hash" => $newHash), array("UserID" => $user));
echo "\nUpdated password for $user\n";
