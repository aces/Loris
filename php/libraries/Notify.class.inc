<?
require_once 'PEAR.php';

/**
 * A static class to encapsulate the notification spooling system
 * @package main
 * @subpackage notification
 */
class Notify extends PEAR
{
    /**
     * Spools a new notification message for sending, unless the exact
     * same message (including type) is already in the spool.
     * @param string    The name of the notification type
     * @param string    The message itself
     * @param int       CenterID of the target recipients (if null, goes to all users)
     * @returns void
     * @static
     */
    function spool($type, $message, $centerID=null)
    {
        $db =& Database::singleton();

        $typeID = Notify::getTypeID($type);
        if(empty($typeID) || Notify::isError($typeID)) return Notify::raiseError("Could not retrieve notification type id for type '$type'");

        $setArray = array('NotificationTypeID'=>$typeID, 'TimeSpooled'=>time(), 'Message'=>$message, 'CenterID'=>$centerID);
        $db->insert('notification_spool', $setArray);
    }

    /**
     * Gets the notification typeID for the given type
     * @param string   The name of the notification type
     * @returns  int   NotificationTypeID
     * @static
     */
    function getTypeID($type)
    {
        $db =& Database::singleton();
        $typeID = $db->selectOne("SELECT NotificationTypeID FROM notification_types WHERE Type='$type'");
        return $typeID;
    }
}