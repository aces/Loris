<?php
/**
 * User accounts
 *
 * Handles rejection of pending user accounts by a user that has permissions
 *
 * Send DB query to remove user based on userID, checking that the
 * user sending the request has admin permissions and the account
 * can be removed (no password hash => has never had an activity on
 * Loris, and is pending).
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  User_Accounts
 * @author   Leo T. <lthomas.mcin@gmail.com>
 *           Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\user_accounts;

// Make sure the permission is checked first to avoid malicious userID scans
if (!(\User::singleton())->hasPermission('user_accounts')) {
    header("HTTP/1.1 403 Forbidden");
    header("Content-Type: text/plain");
    exit(
        "You do not have valid permissions for this
         operation."
    );
}

if (!isset($_POST['identifier'])) {
    header("HTTP/1.1 400 Bad Request");
    header("Content-Type: text/plain");
    exit(
        "No identifier supplied"
    );
}

$rejectee = \User::factory($_POST['identifier']);
$username = $rejectee->getUsername();

if (empty($username) || $rejectee instanceof \LORIS\AnonymousUser) {
    header("HTTP/1.1 404 Not Found");
    header("Content-Type: text/plain");
    exit(
        "This account does not exist"
    );
}

if (!Edit_User::canRejectAccount($rejectee)) {
    header("HTTP/1.1 403 Forbidden");
    header("Content-Type: text/plain");
    exit(
        "This account is active and cannot be rejected"
    );
}

(\Database::singleton())->delete('users', array("UserID" => $username));
header("HTTP/1.1 204 No Content");

