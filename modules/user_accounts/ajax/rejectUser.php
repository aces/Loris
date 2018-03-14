<?php
/**
 * User accounts
 *
 * Handles rejection of pending user accounts by a user that has permissions
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  User_Accounts
 * @author   Leo T. <lthomas.mcin@gmail.com>
 *           Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
    use LORIS\user_accounts as UA;

    define('NO_IDENTIFIER_SUPPLIED', 1);
    define('USER_NOT_FOUND', 2);
    define('INCORRECT_PERMISSION', 3);
    define('ACCOUNT_ACTIVE', 4);

if (isset($_POST['identifier'])) {
    $identifier = $_POST['identifier'];
    _rejectUser($identifier);
} else {
    throw new LorisException("No identifier supplied", NO_IDENTIFIER_SUPPLIED);
    exit(1);
}

/**
 * Checks that logged in user has user_accounts permissions, which is
 * also included in admin permissions
 *
 * @return boolean true if user has admin permission or user accounts false otherwise
 */
function _hasPerm()
{
    $user =& User::singleton();
    if (isset($user)) {
        return $user->hasPermission('user_accounts');
    }
    return false;
}

/**
 * Send DB query to remove user based on userID, checking that the
 * user sending the request has admin permissions and the account
 * can be removed (no password hash => has never had an activity on
 * Loris, and is pending).
 *
 * @param string $userID of account to reject
 *
 * @return void
 */
function _rejectUser($userID)
{
    $DB       = \Database::singleton();
    $config   = \NDB_Config::singleton();
    $baseURL  = $config->getSetting('url');
    $redirect = $baseURL . "/user_accounts/";
    if (!_hasPerm()) {
        throw new LorisException(
            "You do not have the correct permissions for this 
            operation (need admin or user accounts)",
            INCORRECT_PERMISSION
        );
        exit(1);
    } else if (!UA\Edit_User::canRejectAccount($userID)) {
        throw new LorisException(
            "This account is active and connot be rejected",
            ACCOUNT_ACTIVE
        );
        exit(1);
    } else {
        $DB->delete('users', array("UserID" => $userID));
        exit;
    }
}
?>
