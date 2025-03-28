<?php declare(strict_types=1);

/**
 * A static class to encapsulate the notification spooling system
 *
 * PHP Version 7
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * A static class to encapsulate the notification spooling system
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Notify
{
    /**
     * Spools a new notification message for sending, unless the exact
     * same message (including type) is already in the spool.
     *
     * @param string    $type     The name of the notification type
     * @param string    $message  The message itself
     * @param ?CenterID $centerID CenterID of the target recipients
     *                            (if null, goes to all users)
     *
     * @return void
     */
    static function spool(
        string $type,
        string $message,
        ?CenterID $centerID=null
    ): void {

        $typeID = Notify::getTypeID($type);
        if (empty($typeID)) {
            throw new LorisException(
                "Could not retrieve notification type id for type '$type'"
            );
        }

        $setArray = [
            'NotificationTypeID' => $typeID,
            'TimeSpooled'        => date("Y-m-d H:i:s"),
            'Message'            => $message,
            'CenterID'           => $centerID,
        ];

        $db = \NDB_Factory::singleton()->database();
        $db->insert('notification_spool', $setArray);
    }

    /**
     * Gets the notification typeID for the given type
     *
     * @param string $type The name of the notification type
     *
     * @return int NotificationTypeID
     */
    static function getTypeID(string $type): int
    {
        $result = \NDB_Factory::singleton()->database()->pselectOneInt(
            "SELECT NotificationTypeID FROM notification_types WHERE Type=:TP",
            ['TP' => $type]
        );
        if (is_null($result)) {
            throw new \NotFound();
        }
        return $result;
    }
}
