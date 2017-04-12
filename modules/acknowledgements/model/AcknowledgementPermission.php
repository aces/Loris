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
     * @param int $user_id The user id
     *
     * @return string|null The username on success
     */
    private static function _userId2Username($user_id)
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
                    ID = :user_id
            ",
            array("user_id" => $user_id)
        );
        return is_string($result) ?
            $result : null;
    }
    /**
     * Checks if the user can view acknowledgements
     * of at least one center
     *
     * @param int $user_id The user id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canViewForAtLeastOneCenter($user_id)
    {
        return count(self::fetchAllViewableCenter($user_id)) > 0;
    }
    /**
     * Checks if the user can view a specific acknowledgement
     *
     * @param int $user_id            The user id
     * @param int $acknowledgement_id The acknowledgement id
     *                       //Unused at the moment, anticipating refactor
     *
     * @return bool `true` if the user has the permission
     */
    public static function canView($user_id, $acknowledgement_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return $user->hasPermission("acknowledgements_view");
    }
    /**
     * Checks if the user can view acknowledgements for a given center
     *
     * @param int $user_id   The user id
     * @param int $center_id The center id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canViewForCenter($user_id, $center_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return
            $user->hasPermission("acknowledgements_view") &&
            in_array($center_id, $user->getCenterID());
    }
    /**
     * Fetches all centers the user can view acknowledgements for
     *
     * @param int $user_id The user id
     *
     * @return array|null On success, each object-element has keys `id`, `name`
     */
    public static function fetchAllViewableCenter($user_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return null;
        }
        $user            = User::factory($username);
        $center_id_arr   = $user->getCenterID();
        $viewable_id_arr = array();
        foreach ($center_id_arr as $center_id) {
            if (self::canViewForCenter($user_id, $center_id)) {
                $viewable_id_arr[] = $center_id;
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
     * @param int $user_id   The user id
     * @param int $center_id The center id
     *
     * @return bool `true` if the user has the permission
     */
    public static function caninsertForCenter($user_id, $center_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return
            $user->hasPermission("acknowledgements_edit") &&
            in_array($center_id, $user->getCenterID());
    }
    /**
     * Checks if the user can update a specific acknowledgement
     *
     * @param int $user_id            The user id
     * @param int $acknowledgement_id The acknowledgement id
     *                                //Unused at the moment,
     *                                //anticipating refactor
     *
     * @return bool `true` if the user has the permission
     */
    public static function canupdate($user_id, $acknowledgement_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        return $user->hasPermission("acknowledgements_edit");
    }
    /**
     * Checks if the user can delete a specific acknowledgement
     *
     * @param int $user_id            The user id
     * @param int $acknowledgement_id The acknowledgement id
     *                                //Unused at the moment,
     *                                //anticipating refactor
     *
     * @return bool `true` if the user has the permission
     */
    public static function canDelete($user_id, $acknowledgement_id)
    {
        //canDelete() is a synonym for canupdate() for now
        //May have different permissions in the future?
        return self::canupdate($user_id, $acknowledgement_id);
    }
    /**
     * Checks if the user can administer acknowledgements for a given center
     *
     * @param int $user_id   The user id
     * @param int $center_id The center id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canAdministerForCenter($user_id, $center_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return false;
        }
        $user = User::factory($username);
        //For now, acknowledgements_edit = admin rights
        //May change in future
        return
            $user->hasPermission("acknowledgements_edit") &&
            in_array($center_id, $user->getCenterID());
    }
    /**
     * Fetches all centers the user can administer acknowledgements for
     *
     * @param int $user_id The user id
     *
     * @return array|null On success, each object-element has keys `id`, `name`
     */
    public static function fetchAllAdministrableCenter($user_id)
    {
        $username = self::_userId2Username($user_id);
        if (is_null($username)) {
            return null;
        }
        $user          = User::factory($username);
        $center_id_arr = $user->getCenterID();
        $administrable_id_arr = array();
        foreach ($center_id_arr as $center_id) {
            if (self::canAdministerForCenter($user_id, $center_id)) {
                $administrable_id_arr[] = $center_id;
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
     * @param int $user_id The user id
     *
     * @return bool `true` if the user has the permission
     */
    public static function canAdministerForAtLeastOneCenter($user_id)
    {
        return count(self::fetchAllAdministrableCenter($user_id)) > 0;
    }
}
?>
