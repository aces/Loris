<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category Notification
 * @package  Notification
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


/**
 * Abstract class serving as base for project notification system implementation.
 *
 * This class implements a module-specific operation-specific user-specific
 * permission-checking site-checking system allowing to trigger automatic
 * notifications to users from anywhere in the code. This code is meant to be
 * extended by projects to accommodate different types of notifications with
 * different formats depending on project preferences
 *
 * A basic implementation of this abstract class is found on loris, it uses basic
 * emails to issue notifications. Projects are responsible of overriding the
 * mentioned example to send different formats such as SMS, phone or HTML/email
 * notifications.
 *
 * The ***NDB_Notifier_Abstract.class.inc*** implements the entire notification
 * logic with the exception of the `notify()` function. In order to use the
 * Notifier system, the project must choose to implement its own extension of
 * the notifier class or use the basic model provided by loris. The abstract
 * parent provides, upon instantiation of the child object, a list of users
 * which will be notified by this specific event. A set of Static helper functions
 * allows programmers to query different characteristics of the current state of
 * the system (modules enabled, services, services per module, ...)
 *
 * The ***NDB_Notifier.class.inc*** implements the `abstract notify()` function to
 * manage the behaviour of the notifications being issued. If project uses
 * different services then the basic text emails, it is within there capacity to
 * modify and implement the procedure for each service independently. An example
 * implementation is available on loris and used in the media and
 * document-repository modules.
 *
 * @category Notification
 * @package  Notification
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class NDB_Notifier_Abstract
{
    /**
     * Current logged in user issuing the notification.
     *
     * @var array [ID,name,email]
     */
    protected $notifier;

    /**
     * Boolean for notification being issue as administrator. Comes from DB
     * notification_modules table but can be overwritten in construct()
     *
     * @var bool
     */
    private $_asAdmin;

    /**
     * Admin user issuing the notification (if applicable).
     *
     * @var string
     */
    private $_adminNotifier;

    /**
     * List of users to be notified and notification methods.
     *
     * @var array
     */
    protected $notified =array();

    /**
     * Module for which the notifier is setup
     *
     * @var string
     */
    protected $module;

    /**
     * Operation for which the notifier is setup
     *
     * @var string
     */
    protected $operation;

    /**
     * Template to use for email/sms/phone
     *
     * @var string
     */
    protected $template;

    /**
     * Data to be sent to the template fo filling
     *
     * @var array
     */
    protected $tpl_data =array();

    /**
     * NDB_Notifier constructor.
     *
     * @param string $module_name    module issuing notification
     * @param string $operation_type operation triggering notification
     * @param array  $extra_tpl_data additional variables to be sent to the tpl.
     * @param bool   $asAdmin        when true, sends notification as if
     *                               triggered by administrator not user. Emails
     *                               are not restricted to sites or permissions
     *
     * @throws LorisException Exception thrown if module is not supported
     *                        by the notifier.
     */
    public function __construct(
        string $module_name,
        string $operation_type,
        array $extra_tpl_data,
        bool $asAdmin
    ) {
        $config = \NDB_Config::singleton();

        $this->module         = $module_name;
        $this->operation      = $operation_type;
        $this->notified       = $this->_get2DListToNotify();
        $this->notifier       = $this->_getLoggedInUser();
        $this->_adminNotifier = $this->_getAdminUser();
        $this->tpl_data['study_logo'] = $config->getSetting('studylogo');
        $this->tpl_data['baseurl']    = $config->getSetting('url');
        $this->tpl_data['study_name'] = $config->getSetting('title');

        if (!is_null($extra_tpl_data)) {
            $this->tpl_data = $this->tpl_data + $extra_tpl_data;
        }

        // Notification Module information from DB
        $nmDetails = NDB_Notifier::getNotificationModules();
        $nmID      = NDB_Notifier::getNotificationModuleID(
            $module_name,
            $operation_type
        );
        $nmInfo    = $nmDetails[$nmID];

        if (empty($nmInfo)) {
            throw new LorisException(
                "Notifications have not been set-up for module: $module_name and ".
                "operation: $operation_type."
            );
        }

        // ADMIN Logic
        // asAdmin boolean in the code takes precedence over DB value
        if (!is_null($asAdmin)) {
            $this->_asAdmin = $asAdmin;
        } else {
            $this->_asAdmin = ($nmInfo['as_admin'] === 'N') ? false : true;
        }
        if ($this->_asAdmin) {
            $this->notifier =$this->_adminNotifier;
        }

        //TEMPLATE File
        $this->template = $nmInfo['template_file'];
    }

    /**
     * Getter for user issuing notification
     *
     * @return array   User issuing notification in form [ID,name,email]
     */
    public function getNotifier(): array
    {
        return $this->notifier;
    }

    /**
     * Getter for users receiving notification
     *
     * @return array    Users receiving notifications from this module
     */
    public function getNotified(): array
    {
        return $this->notified;
    }

    /**
     * Gets information of logged in user and returns a name-email string combination
     *
     * @return array   string in the form `First Last <email@domain.com>`
     */
    private function _getLoggedInUser(): array
    {
        $user       = \User::singleton();
        $info_array = array();
        $info_array['ID']    = $user->getData('ID');
        $info_array['name']  = $user->getFullname();
        $info_array['email'] = $user->getData('Email');
        return $info_array;
    }

    /**
     * Gets information of admin user and returns a name-email string combination
     *
     * @return array  `First Last <email@domain.com>`
     */
    private function _getAdminUser(): array
    {
        $result           = \Database::singleton()->pselectRow(
            "SELECT ID, Real_name, Email FROM users WHERE UserID='admin'",
            array()
        );
        $info_array       =array();
        $info_array['ID'] = $result['ID'];
        $info_array['name']  = $result['Real_name'];
        $info_array['email'] = $result['Email'];
        return $info_array;
    }

    /**
     * Gets 2D list of user emails/phone numbers from database grouped by
     * notification service
     *
     * @return array   2D list of user emails and/or phone numbers grouped by
     *                 available service.
     */
    private function _get2DListToNotify(): array
    {
        //array of sites concerned
        $sites_concerned =  \User::singleton()->getCenterIDs();
        $sql_sites       =implode(",", $sites_concerned);

        // query needs to take into account the notified user permissions.
        $query  = "SELECT DISTINCT 
                    u.ID as user,
                    u.Real_name, 
                    u.Email, 
                    u.Phone,
                    nm.*, 
                    ns.*
                  FROM users u 
                    JOIN users_notifications_rel unr ON (u.ID = unr.user_id) 
                    JOIN notification_modules nm ON (nm.id = unr.module_id)
                    JOIN notification_services ns ON (ns.id = unr.service_id)
                    JOIN user_perm_rel upr ON (u.ID=upr.UserID)
                    JOIN user_psc_rel upsc ON (u.ID=upsc.UserID)
                  WHERE nm.module_name=:nm
                    AND nm.operation_type=:ot
                    ";
        $params = array(
                   "nm" => $this->module,
                   "ot" => $this->operation,
                  );

        if (!$this->_asAdmin) {
            $query        .=" AND (FIND_IN_SET(upsc.CenterID,:cid) > 0 
                            OR upr.permID=(SELECT permID 
                                            FROM permissions 
                                            WHERE code='access_all_profiles')
                        )
                    ";
            $params["cid"] = $sql_sites;

        }

        $result = \Database::singleton()->pselect($query, $params);

        //parse $result and create 2D array
        $n_list = array();
        foreach ($result as $row) {
            if ($this->_hasNotificationPermission($row['user'])) {
                $n_list[$row['service']][$row['Real_name']] = $row['user'];
            }

        }
        return $n_list;
    }

    /**
     * Function asserting if given user should receive a notification
     * for this operation given his permissions.
     *
     * @param string $uid containing the userID
     *
     * @return bool   permissions sufficient for notification
     */
    private function _hasNotificationPermission(string $uid): bool
    {
        $DB      = Database::singleton();
        $current = $DB->pselect(
            "SELECT * FROM user_perm_rel WHERE userID=:uid",
            array("uid" => $uid)
        );

        $necessary = $DB->pselect(
            "SELECT * 
             FROM notification_modules_perm_rel mp
                  JOIN notification_modules nm ON (nm.id=mp.notification_module_id)
             WHERE nm.module_name=:mid
                  AND nm.operation_type=:ot",
            array(
             "mid" => $this->module,
             "ot"  => $this->operation,
            )
        );

        $reqPerm  =array();
        $userPerm =array();
        //Build and compare arrays
        foreach ($necessary as $k=>$row) {
            $reqPerm[] =$row['perm_id'];
        }

        foreach ($current as $k=>$row) {
            $userPerm[] =$row['permID'];
        }

        $diff = array_diff($reqPerm, $userPerm);

        if (empty($diff)) {
            return true;
        }
        return false;
    }

    /**
     * Get email of a user from his ID
     *
     * @param string $uid containing the userID
     *
     * @return string  email of the user
     */
    protected function getEmail(string $uid): string
    {
        return \Database::singleton()->pselectOne(
            "SELECT Email FROM users WHERE ID=:uid",
            array("uid" => $uid)
        );
    }

    /**
     * Get phone number of a user from his ID
     *
     * @param int $uid containing the userID
     *
     * @return ?string  Phone number of the user
     */
    protected function getPhone(int $uid): ?string
    {
        return \Database::singleton()->pselectOne(
            "SELECT Phone FROM users WHERE ID=:uid",
            array("uid" => $uid)
        );
    }

    /**
     * Abstract function notify. To be implemented by project depending on
     * services offered (text_email, HTML email, sms, phone calls, ...).
     *
     * @return mixed
     */
    abstract function notify();

    /**
     * Logs in the history table the notifications that have been sent
     *
     * @param string $trigger_user user that triggered the notification system
     * @param string $target_user  user that receives a notification from the system
     * @param string $service      notification service used for this message
     *
     * @return void
     */
    protected function log(
        string $trigger_user,
        string $target_user,
        string $service
    ): void {

        \Database::singleton()->insert(
            'notification_history',
            array(
             "module_id"    => $this->getNotificationModuleID(
                 $this->module,
                 $this->operation
             ),
             "service_id"   => $this->getNotificationServiceID(
                 $service
             ),
             "trigger_user" => $trigger_user,
             "target_user"  => $target_user,
            )
        );
    }

    /**
     * Static Getter for list of modules, operations and services for the study
     *
     * @return array    associative 3D array grouped by module then operation
     *                  then description/services
     */
    public static function getNotificationModuleServices(): array
    {
        $DB = Database::singleton();

        $query  = "
            SELECT 
                nm.*, 
                ns.*, 
                p.code,
                CASE 
                    WHEN ms.module_id IS NULL AND ms.service_id IS NULL THEN 'N' 
                    ELSE 'Y' 
                END AS avail 
            FROM notification_modules nm 
              JOIN notification_services ns
              LEFT JOIN notification_modules_services_rel ms 
                      ON (ms.module_id=nm.id AND ms.service_id=ns.id)
              LEFT JOIN notification_modules_perm_rel mp
                      ON (mp.notification_module_id=nm.id)
              LEFT JOIN permissions p ON (p.permID=mp.perm_id)
                      ";
        $params = array();
        $result = $DB->pselect($query, $params);

        $n_list =array();
        foreach ($result as $row) {
            $mn   = $row['module_name'];
            $ot   = $row['operation_type'];
            $perm = $row['code'];
            $n_list[$mn][$ot]['desc']          = $row['description'];
            $n_list[$mn][$ot][$row['service']] = $row['avail'];
            if (!empty($perm)) {
                $n_list[$mn][$ot]['perm'][] = $perm;
            }
        }
        return $n_list;
    }

    /**
     * Static Getter for list of services for the study
     *
     * @return array    associative array of id=>services
     */
    public static function getNotificationServices(): array
    {
        $result = \Database::singleton()->pselect(
            'SELECT * FROM notification_services',
            array()
        );

        $n_services =array();
        foreach ($result as $row) {
            $n_services[$row['id']] = $row['service'];
        }
        return $n_services;
    }


    /**
     * Static Getter for list of services for the study
     *
     * @return array    associative array of id=>module/operation/description
     */
    public static function getNotificationModules() :array
    {
        $result = \Database::singleton()->pselect(
            'SELECT * FROM notification_modules',
            array()
        );

        $n_modules =array();
        foreach ($result as $row) {
            $n_modules[$row['id']]['module_name']    = $row['module_name'];
            $n_modules[$row['id']]['operation_type'] = $row['operation_type'];
            $n_modules[$row['id']]['description']    = $row['description'];
            $n_modules[$row['id']]['as_admin']       = $row['as_admin'];
            $n_modules[$row['id']]['template_file']  = $row['template_file'];
        }
        return $n_modules;
    }

    /**
     * Static Getter for id given module_name and operation_type
     *
     * @param string $module         name for which id is required
     * @param string $operation_type for the given module
     *
     * @return int    ID of the module/operation combination
     */
    public static function getNotificationModuleID(
        string $module,
        string $operation_type
    ): int {

        $query  = "SELECT id
                  FROM notification_modules
                  WHERE module_name=:mn
                      AND operation_type=:ot
                    ";
        $params = array(
                   "mn" => $module,
                   "ot" => $operation_type,
                  );
        return intval(\Database::singleton()->pselectOne($query, $params));
    }

    /**
     * Static Getter for id given service
     *
     * @param string $service for which id is required
     *
     * @return int    ID of the module/operation combination
     */
    public static function getNotificationServiceID(string $service): int
    {
        $query  = "SELECT id
                  FROM notification_services
                  WHERE service=:serv
                    ";
        $params = array("serv" => $service);
        return intval(\Database::singleton()->pselectOne($query, $params));
    }

    /**
     * Static Getter for list of services for a specific user
     *
     * @param int $uid User ID from the users table
     *
     * @return array    associative array of id=>services
     */
    public static function getUserNotificationModuleServices(int $uid): array
    {
        $query  = "
             SELECT 
                nm.*, 
                ns.*,
                un.*,
                CASE 
                    WHEN un.module_id IS NULL AND un.service_id IS NULL THEN 'N' 
                    ELSE 'Y' 
                END AS subscribed 
            FROM notification_modules nm 
              JOIN notification_services ns
              LEFT JOIN users_notifications_rel un ON (un.module_id=nm.id 
                                                        AND un.service_id=ns.id 
                                                        AND un.user_id=:uid
                                                      )
                      ";
        $params = array("uid" => $uid);
        $result = \Database::singleton()->pselect($query, $params);

        $user_n_list =array();
        foreach ($result as $row) {
            $mn = $row['module_name'];
            $ot = $row['operation_type'];
            $user_n_list[$mn][$ot]['desc']          = $row['description'];
            $user_n_list[$mn][$ot][$row['service']] = $row['subscribed'];
        }
        return $user_n_list;
    }
}
