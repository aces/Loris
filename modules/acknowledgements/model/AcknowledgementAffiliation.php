<?php
/**
  * Handles all affiliations of an acknowledgement.
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
  * Handles all affiliations of an acknowledgement.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class AcknowledgementAffiliation
{
    /**
     * Checks if it exists
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $affiliationId     The affiliation id
     *
     * @return bool `true` if exists
     */
    public static function exists($acknowledgementId, $affiliationId)
    {
        $result = Database::singleton()->pselectOne(
            "
                SELECT
                    EXISTS (
                        SELECT
                            *
                        FROM
                            acknowledgement_affiliation
                        WHERE
                            acknowledgementId = :acknowledgementId AND
                            affiliationId     = :affiliationId
                    )
            ",
            array(
             "acknowledgementId" => $acknowledgementId,
             "affiliationId"     => $affiliationId,
            )
        );
        return ($result === "1");
    }
    /**
     * Checks the acknowledgement and affiliation are from the same center
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $affiliationId     The affiliation id
     *
     * @return bool `true` if they are from the same center
     */
    public static function hasSameCenterId($acknowledgementId, $affiliationId)
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
                            ack_center_affiliation
                        WHERE
                            id = :affiliationId
                    )
            ",
            array(
             "acknowledgementId" => $acknowledgementId,
             "affiliationId"     => $affiliationId,
            )
        );
        return ($result === "1");
    }
    /**
     * Inserts a affiliation to the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $affiliationId     The affiliation id
     *
     * @return bool `true` on success
     */
    public static function insertIfNotExists($acknowledgementId, $affiliationId)
    {
        if (self::exists($acknowledgementId, $affiliationId)) {
            return true;
        }
        if (!self::hasSameCenterId($acknowledgementId, $affiliationId)) {
            return false;
        }

        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    acknowledgement_affiliation (acknowledgementId, affiliationId)
                VALUES (
                    :acknowledgementId,
                    :affiliationId
                )
            "
        );
        return $stmt->execute(
            array(
             "acknowledgementId" => $acknowledgementId,
             "affiliationId"     => $affiliationId,
            )
        );
    }
    /**
     * Deletes a affiliation from the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $affiliationId     The affiliation id
     *
     * @return bool `true` on success
     */
    public static function deleteIfExists($acknowledgementId, $affiliationId)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_affiliation
                WHERE
                    acknowledgementId = :acknowledgementId AND
                    affiliationId     = :affiliationId
            "
        );
        return $stmt->execute(
            array(
             "acknowledgementId" => $acknowledgementId,
             "affiliationId"     => $affiliationId,
            )
        );
    }
    /**
     * Deletes all affiliations from the acknowledgement
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
                    acknowledgement_affiliation
                WHERE
                    acknowledgementId = :acknowledgementId
            "
        );
        return $stmt->execute(
            array("acknowledgementId" => $acknowledgementId)
        );
    }
    /**
     * Fetches all affiliations of the acknowledgement
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
                    acknowledgement_affiliation ack
                JOIN
                    ack_center_affiliation item
                ON
                    item.id = ack.affiliationId
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
     * Repopulates affiliations of the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param array  $id_arr            The array of affiliation ids
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
