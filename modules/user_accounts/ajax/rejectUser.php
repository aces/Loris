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
    print_r(
        "You do not have the correct permissions for this 
         operation (need admin or user accounts)"
    );
    exit(1);
}

if (!isset($_POST['identifier'])) {
    header("HTTP/1.1 400 Bad Request");
    print_r(
        "No identifier supplied"
    );
    exit(2);
}

$username = (\User::factory($_POST['identifier']))->getUsername();

if (empty($username)) {
    header("HTTP/1.1 404 Not Found");
    print_r(
        "This account do not exists"
    );
    exit(3);
}

if (!Edit_User::canRejectAccount($username)) {
    header("HTTP/1.1 403 Forbidden");
    print_r(
        "This account is active and cannot be rejected"
    );
    exit(4);
}

(\Database::singleton())->delete('users', array("UserID" => $username()));
header("HTTP/1.1 204 No Content");

