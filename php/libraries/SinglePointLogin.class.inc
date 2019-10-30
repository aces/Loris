<?php declare(strict_types=1);
/**
 * This class provides a single point to deal with user authentication
 * and validation of login, displaying the login page if necessary.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * SinglePointLogin class
 *
 * This class provides a single-point user login to the NeuroDB GUIs
 * Its public functions can be used to display a login window at the
 * current location while preserving the current state of the GUI.
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SinglePointLogin
{
    /**
     * Defines whether a user is currently logged in
     */
    var $_isLoggedIn = false;

    /**
     * Internally held copy of username
     */
    var $_username = null;

    /**
     * To carry the error messages
     */
    var $_lastError = null;

    /**
     * Defines whether a user's password has expired
     */
    var $_passwordExpired = false;

    /**
     * Dumps the password expiry form
     *
     * @return void
     * @access public
     */
    function showPasswordExpiryScreen(): void
    {
        // FIXME: This is a temporary hack until the password reset logic is
        // refactored to be sane and keep a token that can be authenticated.
        //
        // We store the username requesting the the password reset on the
        // PHP session superglobal so that the password expiry page can
        // trust it.
        if ($_SERVER['REQUEST_URI'] == "/login/password-expiry/") {
            // Prevent a loop to the same page if we got here
            // while on the password expiry page, which can prevent
            // error messages from being seen.
            return;
        }
        $_SESSION['PasswordExpiredForUser'] = $_POST['username'];
        header("HTTP/1.1 303 See Other");
        header("Location: /login/password-expiry/");
        exit(0);
    }


    /**
     * Checks whether anyone is currently logged in
     *
     * @return bool
     * @access public
     */
    function isLoggedIn(): bool
    {
        return $this->_isLoggedIn;
    }

    /**
     * Checks whether users password is expired
     *
     * @return bool
     * @access public
     */
    function passwordExpired(): bool
    {
        return $this->_passwordExpired;
    }

    /**
     * Saves the new password if last was expired
     *
     * @return bool
     * @access public
     */
    /*
    function save(): bool
    {
        // get saved data to pre-populate form
        $user =& User::factory($_POST['username']);

        // get user's data
        $data = $user->getData();

        // check password strength
        if (!User::isPasswordStrong(
            $_POST['password'],
            array(
                $_POST['confirm'] ?? '',
                $data['UserID'],
                $data['Email'],
            ),
            array(
                '==',
                '!=',
                '!=',
            )
        )
        ) {
            $this->_lastError = 'The password is weak, or'
               . ' the passwords do not match';
            return false;
        }

        if (password_verify($_POST['password'], $data['Password_hash'])) {
            $this->_lastError = 'You cannot keep the same password';
            return false;
        }
        // Check if password is present in existing data breaches.
        if ($user->pwnedPassword($_POST['password'])) {
            $this->_lastError = 'The password you chose is too common. Please '
                . 'choose a more unique password.';
                return false;
        }

        // Reset passwordExpired flag
        $this->_passwordExpired = false;
        $user->updatePassword($_POST['password']);
        return true;
    }
     */

    /**
     * Attempt to authenticate a user's credentials by any supported means.
     *
     * @return bool Whether a user has successfully authenticated.
     */
    function authenticate(): bool
    {
        // Reset passwordExpired flag
        $this->_passwordExpired = false;

        // First try JWT authentication, which is cheaper and
        // doesn't involve database calls
        $headers    = getallheaders();
        $authHeader = isset($headers['Authorization'])
                         ? $headers['Authorization']
                         : '';
        if (!empty($authHeader)) {
            $token = explode(" ", $authHeader);
            // Index 0 is "Bearer", 1 is the token
            if ($this->JWTAuthenticate($token[1]) === true) {
                return true;
            }

        }

        // Now try password validation

        // This wasn't a login form, so don't waste any time
        if (empty($_POST['login'])) {
            return false;
        }
        return $this->passwordAuthenticate($_POST['username'], $_POST['password']);
    }

    /**
     * Attempts to authenticate a JWT token
     *
     * @param string $token The token extracted from the
     *                      Authorization: Bearer header
     *
     * @return bool true if the session is valid, false otherwise
     */
    function JWTAuthenticate(string $token): bool
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $sharedKey = $config->getSetting("JWTKey");

        //$jwt = \Firebase\JWT\JWT::encode($token, $sharedKey);
        try {
            $decoded = \Firebase\JWT\JWT::decode($token, $sharedKey, array("HS256"));
        } catch (Exception $e) {
            return false;
        }

        $decodedArray    = (array) $decoded;
        $this->_username = $decodedArray['user'] ?? 'Unknown';
        return isset($decodedArray['user'])
            && !$this->accountLocked($decodedArray['user']);
    }

    /**
     * Checks whether a given username and password are valid
     *
     * @param string $username The username to validate
     * @param string $password The password to validate
     * @param bool   $redirect If this flag is true, this
     *                         function may instead print
     *                         out a login or password expiry
     *                         page. when trying to authenticate.
     *                         If false, it won't provide any output
     *                         in those situation.
     *
     * @return bool False unless account is valid and password correct.
     * @access public
     */
    function passwordAuthenticate(
        string $username,
        string $password,
        bool $redirect = true
    ): bool {

        $this->_lastError = '';

         ///////////////////////////
         ///initialization/////
         //////////////////////////
        $this->_username = isset($username) ? $username : 'Unknown';

        $setArray = array(
            'userID'          => $this->_username,
            'Success'         => 'Y',
            'Failcode'        => null,
            'Login_timestamp' => date('Y-m-d H:i:s'),
            'IP_address'      => $_SERVER['HTTP_X_FORWARDED_FOR']
                         ?? $_SERVER['REMOTE_ADDR']
                         ?? 'Unknown',
            'Page_requested'  => isset($_SERVER['REQUEST_URI'])
                                              ? $_SERVER['REQUEST_URI']
                                              : 'Unknown',
        );
        // don't waste execution time if no form was submitted

        if (empty($username)) {
            $this->_lastError = 'Please enter a username';
            $this->insertFailedDetail(
                $this->_lastError,
                $setArray
            );
            return false;
        }

        if (empty($password)) {
            $this->_lastError = 'Please enter a password';
            $this->insertFailedDetail(
                $this->_lastError,
                $setArray
            );
            return false;
        }

        // create DB object
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        // check users table to see if we have a valid user
        $query = "SELECT COUNT(*) AS User_count,
                        UserID,
                        Password_expiry < NOW() as Expired,
                        Active,
                        Pending_approval,
                        Password_hash,
			active_from,
			active_to

                    FROM users
                  WHERE UserID = :username
                  GROUP BY UserID";
        $row   = $DB->pselectRow($query, array('username' => $username));

        if (is_null($row) || intval($row['User_count'] ?? 0) !== 1) {
            /* Display generic failure message to front-end so that an
             * attacker will have a harder time knowing the difference
             * between a bad username and a bad password.
             */
            $this->_lastError = "Incorrect username or password.";
            return false;
        }
        /* Check whether a user's account is locked due to too many bad login
         * attempts before actually trying to authenticate their credentials.
         */
        if ($this->accountLocked($username)) {
            $this->_lastError = 'This account is currently suspended due '
                . 'to too many bad login attempts.';
            $this->insertFailedDetail('Account locked', $setArray);
            return false;
        }
        // Validate passsword
        $oldhash = $row['Password_hash'] ?? '';
        if (password_verify($password, $oldhash)) {
            // Rehash according to latest standards if necessary.
            if (password_needs_rehash($oldhash, PASSWORD_DEFAULT)) {
                try {
                    $newHash = new \Password($password);
                    \User::factory($username)->updatePassword(
                        $newHash
                    );
                } catch (\InvalidArgumentException $e) {
                    // Edge-case: if a user has a password based on old LORIS
                    // password standards and it needs rehashing, it will
                    // generate this exception when used above.
                    // Rather than force a password change, we will manually
                    // update the password here without using the Password class
                    $newHash = password_hash(
                        $password,
                        PASSWORD_DEFAULT
                    );
                    \NDB_Factory::singleton()->database()->update(
                        'users',
                        array('Password_hash' => $newHash),
                        array('UserID' => $username)
                    );
                }

            }

            if ($row['Active'] == 'N'
                || $this->disabledDueToInactivity($username, 365)
            ) {
                $this->_lastError = "Your account has been deactivated."
                    . " Please contact your project administrator to"
                    . " reactivate this account.";
                $this->insertFailedDetail(
                    "user account not active",
                    $setArray
                );

                return false;
            }

            // check if the account is no longer active
            $date       = new DateTime();
            $currentDay = $date->getTimestamp();

            if (($row['active_to'] != null)
                && ($currentDay > strtotime($row['active_to']))
            ) {
                $this->_lastError = "Your account has expired."
                    . " Please contact your project administrator to re-activate"
                    . " this account.";
                return false;

            }

            // Check whether the account is expired.
            $date       = new DateTime();
            $currentDay = $date->getTimestamp();

            if (($row['active_to'] != null)
                && ($currentDay > strtotime($row['active_to']))
            ) {
                $this->_lastError = "Your account has expired."
                    . " Please contact your project administrator to re-activate"
                    . " this account.";
                return false;
            }

            // Check if the account is active.
            if (($row['active_from'] != null)
                && ($currentDay < strtotime($row['active_from']))
            ) {
                $this->_lastError = "Your account is not active yet."
                    ." According to our records it will be active from 
            {$row['active_from']}"
                . " Please contact your project administrator";
                return false;
            }

            // Check whether account needs to be approved by an admin
            if ($row['Pending_approval'] == 'Y') {
                $this->_lastError = "Your account has not yet been activated."
                    . " Please contact your project administrator to activate"
                    . " this account.";
                $this->insertFailedDetail("user account pending", $setArray);
                return false;
            }
            if ($row['Active'] == 'N'
                || $this->disabledDueToInactivity($username, 365)
            ) {
                $this->_lastError = "Your account has been deactivated."
                    . " Please contact your project administrator to"
                    . " reactivate this account.";
                $this->insertFailedDetail(
                    "user account not active",
                    $setArray
                );

                return false;
            }

            // Save the new password if the last password expired
            if ($row['Expired']) {
                if ($redirect) {
                    $this->showPasswordExpiryScreen();
                }
                return false;
            }
            // Allow a user to login if none of the previous cases have occurred
            $this->_username = $row['UserID'];

            $DB->insert('user_login_history', $setArray);
            return true;
        }
        /* When the password is wrong, log this detail for rate-limiting
         * purposes.
         */
        $this->insertFailedDetail(
            "Bad password",
            $setArray
        );

        // Fail by default with a generic error message
        $this->_lastError = "Incorrect username or password.";
        return false;
    }

    /**
     * Determines whether a user's account is locked due to too many failed
     * attempts.
     *
     * @param string $username The user account to check.
     *
     * @return bool
     */
    function accountLocked(string $username): bool
    {
        /* A user is locked out if they have made X attempts in the last Y
         * minutes or X' attempts in the last Y' minutes.
         * The reason for using two time windows is to provide some flexibility:
         * legitimate locked-out users to try again in a short time while also
         * preventing attackers from simply trying another X login attempts
         * after Y minutes.
         */

        /* These represent X and X' above, but with more helpful names.
         * These values represent the maximum number of attempts a user may make
         * to login before being locked out.
         */
        $shortLockoutThreshold = 10;
        $longLockoutThreshold  = 15;
        // These represent Y and Y' above, but with more helpful names.
        $shortWindowInMinutes = 15;
        $longWindowInMinutes  = 60;

        // SQL code to run.
        $query  = "SELECT COUNT(loginhistoryID) as loginattempts " .
            "FROM user_login_history " .
            "WHERE userID = :username " .
            "AND IP_address = :ip " .
            "AND Success = 'N' " .
            "AND Login_timestamp > ( " .
            "SELECT IF( MAX(Login_timestamp) > DATE_SUB(NOW(), ".
            "INTERVAL :timeWindowInMinutes MINUTE), " .
                "MAX(Login_timestamp), DATE_SUB(NOW(), " .
                "INTERVAL :timeWindowInMinutes MINUTE) " .
            ") " .
            "FROM user_login_history " .
            "WHERE userID = :username " .
            "AND Success = 'Y'" .
        ");";
        $params = array(
            'username'            => $username,
            'timeWindowInMinutes' => $shortWindowInMinutes,
            'ip'                  => $_SERVER['REMOTE_ADDR'],
        );

        // Query DB for login attempts.
        $database  = \NDB_Factory::singleton()->database();
        $statement = $database->prepare($query);

        $shortFailCount = intval(
            $database->execute($statement, $params)[0]['loginattempts']
        );

        $params['timeWindowInMinutes'] = $longWindowInMinutes;

        $longFailCount = intval(
            $database->execute($statement, $params)[0]['loginattempts']
        );

        return $shortFailCount > $shortLockoutThreshold
            || $longFailCount > $longLockoutThreshold;
    }

    /**
     * Sets the session data (State object)
     *
     * @return void
     * @access public
     */
    function setState(): void
    {
        // someone is logged in
        $this->_isLoggedIn = true;

        // create the session managed State object
        if (!isset($_SESSION['State'])) {
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
    function clearState(): void
    {
        // someone is logged in
        $this->_isLoggedIn = false;

        // create the session managed State object
        if (!isset($_SESSION['State'])) {
            $_SESSION['State'] =& State::singleton();
        }

        $_SESSION['State']->setUsername(null);
    }

    /**
     * Inserts the login (or failed-login) detail into the user_login_history
     *
     * @param string $description description for the failed-login
     * @param array  $setArray    contains data to be inserted
     *
     * @return void
     */
    function insertFailedDetail(string $description, array $setArray): void
    {
        // create DB object
        $DB =& Database::singleton();

        $setArray['Success']     = 'N';
        $setArray['Fail_detail'] = $description;

        // in future, add mapping of error message to Failcode field enum
        $DB->insert('user_login_history', $setArray);
    }

    /**
     * Checks if a user has not logged in for a given amount of time
     * As a side-effect, if true, will also set user field 'active' to 'N'
     * Need to have already confirmed valid user
     *
     * @param string $username            username
     * @param int    $maximumDaysInactive Most allowable days for inactivity
     *
     * @return bool - true if the user has now been disabled
     */
    function disabledDueToInactivity(
        string $username,
        int $maximumDaysInactive
    ): bool {

        $DB    =& Database::singleton();
        $query = "SELECT MAX(Login_timestamp) as Login_timestamp
                  FROM user_login_history 
                  WHERE UserID = :username";

        $row = $DB->pselectRow($query, array('username' => $username));

        /* If the login timestamp is null then this is the user's first time
         * logging in. This will always be the case in our CI environment.
         * The user should not be disabled in this case.
         */
        if (is_null($row) || is_null($row['Login_timestamp'])) {
            return false;
        }
        $last_login = new DateTime($row['Login_timestamp']);
        $time_now   = new DateTime("now");
        $interval   = $last_login->diff($time_now);

        if ($interval->days > $maximumDaysInactive) {
            $DB->update(
                'users',
                array('Active' => 'N'),
                array('UserID' => $username)
            );
            return true;
        }
        return false;
    }
}
