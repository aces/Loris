<?php
require_once 'PEAR.php';

/**
 * SinglePointLogin class
 *
 * This class provides a single-point user login to the NeuroDB GUIs
 * Its public functions can be used to display a login window at the
 * current location while preserving the current state of the GUI.
 * @package main
 */
class SinglePointLogin extends PEAR
{
    /**
     * @var    bool     defines whether a user is currently logged in
     * @access private
     */
    var $_isLoggedIn = false;

    /**
     * @var string      internally held copy of username
     * @access private
     */
    var $_username = null;

    /**
     * Dumps the login form
     *
     * @return void
     * @access public
     */
    function showLoginScreen()
    {   
        $tpl_data = array();
        if(isset($_POST['username'])) {
            $tpl_data['username'] = $_POST['username'];
        } else {
            $tpl_data['username'] = '';
        }

        $tpl_data['currentyear'] = date('Y'); 


        // remove logout from request
        parse_str($_SERVER['QUERY_STRING'], $params);
        unset($params['logout']);

        $config =& NDB_Config::singleton();

        $tpl_data['title'] = $config->getSetting('title');
        $tpl_data['css']=$config->getSetting('css');
        $tpl_data['action'] = $_SERVER['PHP_SELF'].'?'.Utility::unparse_str($params);
        $tpl_data['error_message'] = $this->_lastError;
        $study_links = $config->getSetting('Studylinks');// print_r($study_links);
        foreach(Utility::toArray($study_links['link']) AS $link){
            $LinkArgs = '';
            $BaseURL = $link['@']['url'];
            if(isset($link['@']['args'])) {
                $LinkArgs = $link_args[$link['@']['args']];
            }
            $LinkLabel = $link['#'];
            $WindowName = md5($link['@']['url']);
            $tpl_data['studylinks'][]=array(
                    'url'        => $BaseURL . $LinkArgs,
                    'label'      => $LinkLabel,
                    'windowName' => $WindowName
                    );
        }
        $study_title = $config->getSetting('title');
        $study_logo  = $config->getSetting('studylogo');
        $tpl_data['study_title'] = $study_title;
        $tpl_data['study_logo']  = $study_logo;
        
        //Output template using Smarty
        $smarty = new Smarty_neurodb;
        $smarty->assign($tpl_data);
        $smarty->display('login.tpl');
    }


    /**
     * Dumps the password expiry form
     *
     * @return void
     * @access public
     */
    function showPasswordExpiryScreen()
    {
        $tpl_data['username'] = $_POST['username'];

        // remove logout from request
        parse_str($_SERVER['QUERY_STRING'], $params);
        unset($params['logout']);

        $config =& NDB_Config::singleton();

        $tpl_data['title'] = $config->getSetting('title');
        $tpl_data['css']=$config->getSetting('css');
        $tpl_data['action'] = $_SERVER['PHP_SELF'].'?'.Utility::unparse_str($params);
        $tpl_data['error_message'] = $this->_lastError;

        //Output template using Smarty
        $smarty = new Smarty_neurodb;
        $smarty->assign($tpl_data);
        $smarty->display('password_expiry.tpl');
        die();
    }


    /**
     * Checks whether anyone is currently logged in  
     * 
     * @return bool
     * @access public
     */
    function isLoggedIn()
    {
        return $this->_isLoggedIn;
    }


    /**
     * Saves the new password if last was expired
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function save()
    {
        // get saved data to pre-populate form
        $user =& User::factory($_POST['username']);
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error (".$_POST['username']."): ".$user->getMessage());
        }
        
        // get user's data
        $data = $user->getData();
        
        // check password strength
        if (!User::isPasswordStrong($_POST['password'], array($_POST['confirm'], $data['UserID'], $data['Email']), array('==', '!=', '!='))) {
            $this->_lastError = 'The password is weak, or the passwords do not match';
        }
        
        // check that password has changed
        if (User::md5_unsalt($_POST['password'], $data['Password_md5'])) {
            $this->_lastError = 'You cannot keep the same password';
        }
        
        // if errors
        if (!empty($this->_lastError)) {
            return false;
        }
        
        // make the set
        $set = array(
                     'Password' => NULL, 
                     'Password_md5' => User::md5_salt($_POST['password']), 
                     'Password_expiry' => date('Y-m-d', mktime(0, 0, 0, date('n') + 6, date('j'), date('Y')))
                     );
        
        // update the user
        $success = $user->update($set);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("SinglePointLogin::save(): ".$success->getMessage());
        }
        
        // get config options relating to proftpd
        $config =& NDB_Config::singleton();
        $ftpSettings = $config->getSetting("proftpd");
        
        // if proftpd stuff is enabled:
        if($ftpSettings['enabled'] == 'true') {
            
            // connect to proftpd database
            $ftpdb = new Database();
	    $success = $ftpdb->connect($ftpSettings['database'], $ftpSettings['username'], $ftpSettings['password'], $ftpSettings['host'], false);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("Could not connect to database: ".$success->getMessage());
            }
            
            // check users table to see if we have a valid user 
            $query = "SELECT COUNT(*) AS User_count FROM ftpusers WHERE userid = :UID";
            $row = $ftpdb->pselectRow($query, array('UID' => $_POST['username']));
            if (Utility::isErrorX($row)) {
                return PEAR::raiseError("DB Error: ".$row->getMessage());
            }
            
            // update password
            if($row['User_count'] == 1) {
                
                $setArray['passwd'] = crypt($_POST['password']);
                $success = $ftpdb->update('ftpusers', $setArray, array('userid' => $_POST['username']));
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("SinglePointLogin::save(): ".$success->getMessage());
                }
            } 
            
            // if user does not exist, insert user data
            else {                  
                
                $query = "SELECT MAX(uid) as Max_UID FROM ftpusers";
                
                $maxUID = $ftpdb->pselectOne($query, array());
                if (Utility::isErrorX($maxUID)) {
                    return PEAR::raiseError("DB Error: ".$maxUID->getMessage());
                }
                
                $setArray['userid'] = $_POST['username'];
                $setArray['passwd'] = crypt($_POST['password']);
                $setArray['uid'] = $maxUID + 1;
                $setArray['homedir'] = "/"; 
                
                // insert into proftpd
                $success = $ftpdb->insert("ftpusers", $setArray);
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("SinglePointLogin::save(): ".$success->getMessage());
                }
            }
        }
        return true;
    }
    
    /**
     * Checks whether a given username and password are valid 
     * 
     * @return bool
     * @throws PEAR_Error 
     * @access public
     */
    function authenticate()
    {
        $this->_lastError = '';
         
         ///////////////////////////
         ///initialization/////
         //////////////////////////
         $this->_username = $_POST['username'];
         $setArray = array(
             'userID'=> $this->_username,
             'Success' => 'Y',
             'Failcode' => null,
             'Login_timestamp' => date('Y-m-d H:i:s'),
             'IP_address' => $_SERVER['REMOTE_ADDR'],
             'Page_requested' => $_SERVER['REQUEST_URI']
         );


        // save the new password if the last password expired
        if (isset($_POST['expiry'])) {
            $success = $this->save();
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("SinglePointLogin::authenticate(): ".$success->getMessage());
            }

            if($success == false) {
                $this->showPasswordExpiryScreen();
            }
        }

        // don't waste execution time if no form was submitted
        if (empty($_POST['login'])) {
            return false;
        }
        if (empty($_POST['username'])) {
            $this->_lastError = 'Please enter a username';
            $this->insertFailedDetail($this->_lastError, $setArray);///insert failed_detail into user_login_history
            return false;
        }
        if (empty($_POST['password'])) {
            $this->_lastError = 'Please enter a password';
            $this->insertFailedDetail($this->_lastError, $setArray);///insert failed_detail into user_login_history
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // check users table to see if we have a valid user
        $query = "SELECT COUNT(*) AS User_count, Password_md5, Password_expiry, Active, Pending_approval FROM users WHERE UserID = :username GROUP BY UserID";
        $row = $DB->pselectRow($query, array('username' => $_POST['username']));
        if (Utility::isErrorX($row)) {
            return PEAR::raiseError("DB Error: ".$row->getMessage());
        }

        if ($row['User_count'] == 1) {
            // validate the user
            if (User::md5_unsalt($_POST['password'], $row['Password_md5'])) {
                // check that the user is active
                if ($row['Active'] == 'N') {
                    $this->_lastError = "Your account has been deactivated.  Please contact your project administrator to reactivate this account.";
                    $this->insertFailedDetail("user account not active", $setArray);///insert failed_detail into user_login_history

                    return false;
                }

                if ($row['Pending_approval'] == '1') {
                    $this->_lastError = "Your account has not yet been activated.  Please contact your project administrator to activate this account.";
                    $this->insertFailedDetail("user account pending", $setArray);
                    return false;
                }

                // check if the password expired
                if (strcmp($row['Password_expiry'], date('Y-m-d', time())) < 1) {
                    // show password expiry screen
                    $this->showPasswordExpiryScreen();
                }

                // user is valid
                $this->_username = $_POST['username'];
                // insert the user into the user_login_history table
                $result =  $DB->insert('user_login_history', $setArray);
                return true;
            }
            // bad usename or password
        }

        $this->_lastError = "Incorrect username or password";
        $this->insertFailedDetail($this->_lastError, $setArray);///insert failed_detail into user_login_history
        return false;
    }

    /**
     * Sets the session data (State object)
     * 
     * @return void
     * @access public
     */
    function setState()
    {
        // someone is logged in
        $this->_isLoggedIn = true;

        // create the session managed State object
        if(!isset($_SESSION['State'])) {
            $_SESSION['State'] =& State::singleton();
        }

        $_SESSION['State']->setUsername($this->_username);
    }

    /**
     * Clears the authentication related session data (State object)
     * 
     * @return void
     * @access public
     */
    function clearState()
    {
        // someone is logged in
        $this->_isLoggedIn = false;

        // create the session managed State object
        if(!isset($_SESSION['State'])) {
            $_SESSION['State'] =& State::singleton();
        }

        $_SESSION['State']->setUsername(null);
    }

     /**
     * Inserts the login (or failed-login) detail into the user_login_history
     *
     * @param String $description description for the failed-login 
     * @param Array  $setArray    contains data to be inserted
     * 
     * @return null
      */
     function insertFailedDetail($description, $setArray)
     {
         // create DB object
         $DB =& Database::singleton();
         if (Utility::isErrorX($DB)) {
             return PEAR::raiseError(
                 "Could not connect to database: ".$DB->getMessage()
             );
         }
         $setArray['Success'] = 'N';
         $setArray['Fail_detail'] = $description;
         // in future, add mapping of error message to Failcode field enum
         $result =  $DB->insert('user_login_history', $setArray);
     }

}
?>
