<?php
/**
  * Handles all roles of an acknowledgement.
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
  * Handles all roles of an acknowledgement.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class AcknowledgementRole
{
    /**
     * Checks if it exists
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $roleId            The role id
     *
     * @return bool `true` if exists
     */
    public static function exists($acknowledgementId, $roleId)
    {
        $result = Database::singleton()->pselectOne(
            "
                SELECT
                    EXISTS (
                        SELECT
                            *
                        FROM
                            acknowledgement_role
                        WHERE
                            acknowledgementId = :acknowledgementId AND
                            roleId     = :roleId
                    )
            ",
            array(
             "acknowledgementId" => $acknowledgementId,
             "roleId"            => $roleId,
            )
        );
        return ($result === "1");
    }
    /**
     * Checks the acknowledgement and role are from the same center
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $roleId            The role id
     *
     * @return bool `true` if they are from the same center
     */
    public static function hasSameCenterId($acknowledgementId, $roleId)
    {
        $result = Database::singleton()->pselectOne(
            "
                SELECT
                    (
                        SELECT
                            centerId
                        FROM
                            acknowledgement
                        WHERE
                            id = :acknowledgementId
                    ) = (
                        SELECT
                            centerId
                        FROM
                            ack_center_role
                        WHERE
                            id = :roleId
                    )
            ",
            array(
             "acknowledgementId" => $acknowledgementId,
             "roleId"            => $roleId,
            )
        );
        return ($result === "1");
    }
    /**
     * Inserts a role to the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $roleId            The role id
     *
     * @return bool `true` on success
     */
    public static function insertIfNotExists($acknowledgementId, $roleId)
    {
        if (self::exists($acknowledgementId, $roleId)) {
            return true;
        }
        if (!self::hasSameCenterId($acknowledgementId, $roleId)) {
            return false;
        }

        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    acknowledgement_role (acknowledgementId, roleId)
                VALUES (
                    :acknowledgementId,
                    :roleId
                )
            "
        );
        return $stmt->execute(
            array(
             "acknowledgementId" => $acknowledgementId,
             "roleId"            => $roleId,
            )
        );
    }
    /**
     * Deletes a role from the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $roleId            The role id
     *
     * @return bool `true` on success
     */
    public static function deleteIfexists($acknowledgementId, $roleId)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_role
                WHERE
                    acknowledgementId = :acknowledgementId AND
                    roleId     = :roleId
            "
        );
        return $stmt->execute(
            array(
             "acknowledgementId" => $acknowledgementId,
             "roleId"            => $roleId,
            )
        );
    }
    /**
     * Deletes all roles from the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     *
     * @return bool `true` on success
     */
    public static function deleteAllOfAcknowledgement($acknowledgementId)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_role
                WHERE
                    acknowledgementId = :acknowledgementId
            "
        );
        return $stmt->execute(
            array("acknowledgementId" => $acknowledgementId)
        );
    }
    /**
     * Fetches all roles of the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     *
     * @return array The array of objects
     */
    public static function fetchAllOfAcknowledgement($acknowledgementId)
    {
        $result = Database::singleton()->pselect(
            "
                SELECT
                    item.id, item.title, item.hidden
                FROM
                    acknowledgement_role ack
                JOIN
                    ack_center_role item
                ON
                    item.id = ack.roleId
                WHERE
                    ack.acknowledgementId = :acknowledgementId
                ORDER BY
                    item.title ASC
            ",
            array("acknowledgementId" => $acknowledgementId)
        );
        //Objects are easier to work with, imo
        //Cleaner syntax
        for ($i=0; $i<count($result); ++$i) {
            $result[$i] = (object)$result[$i];
        }
        return $result;
    }
    /**
     * Repopulates roles of the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param array  $id_arr            The array of role ids
     *
     * @return bool `true` on success
     */
    public static function repopulateAllOfAcknowledgement(
        $acknowledgementId,
        $id_arr
    ) {

        if (!is_array($id_arr)) {
            return false;
        }
        foreach ($id_arr as $id) {
            if (!is_string($id) || !preg_match("/^\d+$/", $id)) {
                return false;
            }
            if (!self::hasSameCenterId($acknowledgementId, $id)) {
                return false;
            }
        }
        if (!self::deleteAllOfAcknowledgement($acknowledgementId)) {
            return false;
        }
        foreach ($id_arr as $id) {
            if (!self::insertIfNotExists($acknowledgementId, $id)) {
                return false;
            }
        }
        return true;
    }
}
?>
