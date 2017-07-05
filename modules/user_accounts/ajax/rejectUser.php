<?php
/**
 * Media uploader.
 *
 * Handles media upload and update actions received from a front-end ajax call
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  User_Accounts
 * @author   Leo T. <lthomas.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

    define('NO_IDENTIFIER_SUPPLIED', 1);
    define('USER_NOT_FOUND', 2);
    define('INCORRECT_PERMISSION', 3);
    define('ACCOUNT_ACTIVE', 4);


if (!isset($_POST['identifier'])) {
    throw new LorisException("No identifier supplied", NO_IDENTIFIER_SUPPLIED);
    exit(1);
} else {
    $identifier = $_POST["identifier"];
    reject_user($identifier);
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
        if (!$user->hasPermission('user_accounts')) {
            return false;
        }
        return true;
    }
    return false;
}

    /**
    * Query database on UserID to check that password has doesn't
    * exist and account is still pending approval, to ensure the
    * users with account activity can't be rejected by setting
    * their status to pending.
    *
    * @param string $identifier of account to verify
    *
    * @return boolean true if Password_hash is null and
    * Pending_approval is Yes, false otherwsie
    *
    * @throws Loris exception if the userID isn't found in the database.
    */
function _canRejectAccount($identifier)
{
    $DB = Database::singleton();
    try{
        $fields =  $DB->pselect(
            "SELECT Password_hash, Pending_approval
                       FROM users
                       WHERE UserID=:id",
            array("id" => $identifier)
        );
        if (is_null($fields[0]['Password_hash'])
            && $fields[0]['Pending_approval']=="Y"
        ) {
            return true;
        }
        return false;
    } catch (DatabaseException $e) {
        throw new LorisException("User not found in database", USER_NOT_FOUND);
        exit(1);
    }
}


    /**
    * Send DB query to remove user based on userID, checking that the
    * user sending the request has admin permissions and the account
    * can be removed (no password hash => has never had an activity on
    * Loris, and is pending).
    *
    * @return void
    */
    // @codingStandardsIgnoreStart
    function reject_user($identifier)
    {
    // @codingStandardsIgnoreEnd
        $DB      = Database::singleton();
        $config  = NDB_Config::singleton();
        $baseURL = $config->getSetting('url');

        $redirect = $baseURL . "/user_accounts/";

    if (!_hasPerm()) {
        throw new LorisException(
            "You do not have the correct permissions for this 
            operation (need admin or user accounts)",
            INCORRECT_PERMISSION
        );
        exit(1);
    } else {
        if (!_canRejectAccount($identifier)) {
            throw new LorisException(
                "This account is active and connot be rejected",
                ACCOUNT_ACTIVE
            );
            exit(1);
        } else {
            $DB->delete('users', array("UserID" => $identifier));
            exit;
        }
    }
    }

?>
