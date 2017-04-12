<?php
/**
  * Handles all permissions for the module.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */

/**
  * Handles all permissions for the module.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class AcknowledgementPermission
{
    /**
     * Used internally so, when the great refactoring comes,
     * we may be spared from disaster.
     *
     * @param int $userId The user id
     *
     * @return string|null The username on success
     */
    private static function _userId2Username($userId)
    {
        //The great prophets of ages past decided UserID meant Username
        //and ID meant User Id
        $result = Database::singleton()->pselectOne(
            "
                SELECT
                    UserID
                FROM
                    users
                WHERE
                    ID = :userId
            ",
            array("userId" => $userId)
        );
        return is_string($result) ?
            $result : null;
    }
    /**
     * Checks if the user can view acknowledgements
     * of at least one center
     *
     * @param int $userId The user id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canViewForAtLeastOneCenter($userId)
    {
        return count(self::fetchAllViewableCenter($userId)) > 0;
    }
    /**
     * Checks if the user can view a specific acknowledgement
     *
     * @param int $userId            The user id
     * @param int $acknowledgementId The acknowledgement id
     *                       //Unused at the moment, anticipating refactor
     *
     * @return bool `true` if the user has the permission
     */
    public static function canView($userId, $acknowledgementId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return $user->hasPermission("acknowledgements_view");
    }
    /**
     * Checks if the user can view acknowledgements for a given center
     *
     * @param int $userId   The user id
     * @param int $centerId The center id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canViewForCenter($userId, $centerId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return
            $user->hasPermission("acknowledgements_view") &&
            in_array($centerId, $user->getCenterID());
    }
    /**
     * Fetches all centers the user can view acknowledgements for
     *
     * @param int $userId The user id
     *
     * @return array|null On success, each object-element has keys `id`, `name`
     */
    public static function fetchAllViewableCenter($userId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return null;
        }
        $user            = User::factory($username);
        $centerId_arr    = $user->getCenterID();
        $viewable_id_arr = array();
        foreach ($centerId_arr as $centerId) {
            if (self::canViewForCenter($userId, $centerId)) {
                $viewable_id_arr[] = $centerId;
            }
        }
        if (count($viewable_id_arr) == 0) {
            return array();
        }
        $in_str = implode(", ", $viewable_id_arr);
        $result = Database::singleton()->pselect(
            "
                SELECT
                    CenterID AS id,
                    Name AS name
                FROM
                    psc
                WHERE
                    CenterID IN ($in_str)
            ",
            array()
        );

        //Objects are easier to work with, imo
        //Cleaner syntax
        for ($i=0; $i<count($result); ++$i) {
            $result[$i] = (object)$result[$i];
        }
        return $result;
    }
    /**
     * Checks if the user can insert acknowledgements for a given center
     *
     * @param int $userId   The user id
     * @param int $centerId The center id
     *
     * @return bool `true` if the user has the permission
     */
    public static function caninsertForCenter($userId, $centerId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return
            $user->hasPermission("acknowledgements_edit") &&
            in_array($centerId, $user->getCenterID());
    }
    /**
     * Checks if the user can update a specific acknowledgement
     *
     * @param int $userId            The user id
     * @param int $acknowledgementId The acknowledgement id
     *                                //Unused at the moment,
     *                                //anticipating refactor
     *
     * @return bool `true` if the user has the permission
     */
    public static function canupdate($userId, $acknowledgementId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return $user->hasPermission("acknowledgements_edit");
    }
    /**
     * Checks if the user can delete a specific acknowledgement
     *
     * @param int $userId            The user id
     * @param int $acknowledgementId The acknowledgement id
     *                                //Unused at the moment,
     *                                //anticipating refactor
     *
     * @return bool `true` if the user has the permission
     */
    public static function canDelete($userId, $acknowledgementId)
    {
        //canDelete() is a synonym for canupdate() for now
        //May have different permissions in the future?
        return self::canupdate($userId, $acknowledgementId);
    }
    /**
     * Checks if the user can administer acknowledgements for a given center
     *
     * @param int $userId   The user id
     * @param int $centerId The center id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canAdministerForCenter($userId, $centerId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        //For now, acknowledgements_edit = admin rights
        //May change in future
        return
            $user->hasPermission("acknowledgements_edit") &&
            in_array($centerId, $user->getCenterID());
    }
    /**
     * Fetches all centers the user can administer acknowledgements for
     *
     * @param int $userId The user id
     *
     * @return array|null On success, each object-element has keys `id`, `name`
     */
    public static function fetchAllAdministrableCenter($userId)
    {
        $username = self::_userId2Username($userId);
        if (is_null($username)) {
            return null;
        }
        $user         = User::factory($username);
        $centerId_arr = $user->getCenterID();
        $administrable_id_arr = array();
        foreach ($centerId_arr as $centerId) {
            if (self::canAdministerForCenter($userId, $centerId)) {
                $administrable_id_arr[] = $centerId;
            }
        }
        if (count($administrable_id_arr) == 0) {
            return array();
        }
        $in_str = implode(", ", $administrable_id_arr);
        $result = Database::singleton()->pselect(
            "
                SELECT
                    CenterID AS id,
                    Name AS name
                FROM
                    psc
                WHERE
                    CenterID IN ($in_str)
            ",
            array()
        );

        //Objects are easier to work with, imo
        //Cleaner syntax
        for ($i=0; $i<count($result); ++$i) {
            $result[$i] = (object)$result[$i];
        }
        return $result;
    }
    /**
     * Checks if the user can administer acknowledgements
     * of at least one center
     *
     * @param int $userId The user id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canAdministerForAtLeastOneCenter($userId)
    {
        return count(self::fetchAllAdministrableCenter($userId)) > 0;
    }
}
?>
