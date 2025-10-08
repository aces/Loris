<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category Notification
 * @package  Notification
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * A class allowing to issue notifications using several services including sms,
 * phone, email and loris in-site notifications.
 *
 * @category Notification
 * @package  Notification
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Notifier extends NDB_Notifier_Abstract
{
    /**
     * NDB_Notifier constructor.
     *
     * @param string $module_name    module issuing notification
     * @param string $operation_type operation triggering notification
     * @param array  $extra_tpl_data additional variables to be sent to the tpl
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
        array $extra_tpl_data = [],
        bool $asAdmin = false
    ) {
        parent::__construct(
            $module_name,
            $operation_type,
            $extra_tpl_data,
            $asAdmin
        );
    }

    /**
     * Function to be overridden by module using the notification system
     *
     * @param array   $extra_tpl_data additional variables to be sent to the
     *                                template.
     * @param ?string $custom_message message overriding module-defined message
     *
     * @return void
     */
    public function notify(
        array $extra_tpl_data=[],
        ?string $custom_message=null
    ): void {
        $projectID = $extra_tpl_data['project'] ?? null;
        unset($extra_tpl_data['project']);
        $this->tpl_data = $this->tpl_data + $extra_tpl_data;

        if (!empty($custom_message)) {
            $this->template ="notifier_custom.tpl";
            $this->tpl_data['custom_message'] =$custom_message;
        }

        // Basic email handler
        if (!empty($this->notified['email_text'])) {
            $this->_sendEmails($projectID);
        }

    }

    /**
     * Send emails to concerned users.
     *
     * @param ?string $projectID project ID
     *
     * @return void
     *
     * TODO add validation for email sent/failed
     */
    private function _sendEmails(?string $projectID=null): void
    {
        foreach ($this->notified['email_text'] as $name=>$uid) {
            $notifierID  = $this->notifier->getId();
            $senderName  = $this->notifier->getFullname();
            $senderEmail = $this->notifier->getEmail();
            $this->tpl_data['notified_user'] = $name;
            $this->tpl_data['notifier_user'] = "$senderName <$senderEmail>";
            $recipientEmail = $this->getEmail((int)$uid);

            $factory = NDB_Factory::singleton();
            $db      = $factory->database();
            $recipientUserID = $db->pselectOne(
                "SELECT UserID FROM users WHERE ID=:uid",
                ['uid' =>$uid]
            );
            $recipientUser   = \User::factory($recipientUserID);
            if ($projectID
                && !$recipientUser->hasProject(new \ProjectID($projectID))
            ) {
                return;
            }

            if ($notifierID === $uid) {
                // TODO send confirmation email instead
            } else {
                Email::send(
                    $recipientEmail,
                    $this->template,
                    $this->tpl_data
                );

                $this->log($notifierID, (int)$uid, 'email_text');
            }
        }
    }
}
