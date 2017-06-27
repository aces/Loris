<?php
/**
 * Media uploader.
 *
 * Handles media upload and update actions received from a front-end ajax call
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  user_accounts
 * @author   Leo T. <lthomas.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
	
	if (isset($_GET['identifier'])) {
    	$identifier = $_GET['identifier'];
    	reject_user($identifier);
	}
    
    function _hasPerm(){
    	$db   =& Database::singleton();
   	 	$user =& User::singleton();
   	 	if (isset($user)){
    		if (!$user->hasPermission('user_accounts')) {
        		return False;
    		}
    		return True;
    	}
    	return False;
    }

    /**
    * Query database on UserID to check that password has doesn't
    * exist and account is still pending approval, to ensure the
    * users with account activity can't be rejected by setting
    * their status to pending.
    *
    * @param string $id identifier of account to verify
    *
    * @return boolean true is Password_hash is null and
    * Pending_approval is Yes, false otherwsie
    */
    function _canRejectAccount($identifier)
    {
        $DB     = Database::singleton();
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
    }

    /**
    * Send DB query to remove user based on userID through a GET
    * request.
    * The reject user button populates on edit_users page, therefore
    * any user that has access to the button has user_accounts
    * privileges.
    * The URL is redirected to user_account after the operation
    *
    * @return void
    */
    // @codingStandardsIgnoreStart
    function reject_user($identifier)
    {
    // @codingStandardsIgnoreEnd
        $DB     = Database::singleton();

        $redirect = $baseURL . "/user_accounts/";

        // The $editor variable is set by the edit_user script.
        // Checking that this is set ensures that the user is
        // accessing this function through the authorized button
        // and not by pointing their URL directly to this script.
     	if (_hasPerm()){ 
        	if (_canRejectAccount($identifier)){
        		$DB->delete('users', array("UserID" => $identifier));
        		header('Location: '.$redirect);
        	}else{
	        	header("HTTP/1.1 403 Forbidden");

        	}
    	}else{
        	header("HTTP/1.1 403 Forbidden");

    	}

    }