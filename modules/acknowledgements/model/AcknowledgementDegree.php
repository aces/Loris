<?php
/**
  * Handles all degrees of an acknowledgement.
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
  * Handles all degrees of an acknowledgement.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class AcknowledgementDegree
{
    /**
     * Checks if it exists
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $degreeId          The degree id
     *
     * @return bool `true` if exists
     */
    public static function exists($acknowledgementId, $degreeId)
    {
        $result = Database::singleton()->pselectOne(
            "
                SELECT
                    EXISTS (
                        SELECT
                            *
                        FROM
                            acknowledgement_degree
                        WHERE
                            acknowledgementId = :acknowledgementId AND
                            degreeId     = :degreeId
                    )
            ",
            array(
             "acknowledgementId" => $acknowledgementId,
             "degreeId"          => $degreeId,
            )
        );
        return ($result === "1");
    }
    /**
     * Checks the acknowledgement and degree are from the same center
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $degreeId          The degree id
     *
     * @return bool `true` if they are from the same center
     */
    public static function hasSameCenterId($acknowledgementId, $degreeId)
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
                            ack_center_degree
                        WHERE
                            id = :degreeId
                    )
            ",
            array(
             "acknowledgementId" => $acknowledgementId,
             "degreeId"          => $degreeId,
            )
        );
        return ($result === "1");
    }
    /**
     * Inserts a degree to the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $degreeId          The degree id
     *
     * @return bool `true` on success
     */
    public static function insertIfNotExists($acknowledgementId, $degreeId)
    {
        if (self::exists($acknowledgementId, $degreeId)) {
            return true;
        }
        if (!self::hasSameCenterId($acknowledgementId, $degreeId)) {
            return false;
        }

        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    acknowledgement_degree (acknowledgementId, degreeId)
                VALUES (
                    :acknowledgementId,
                    :degreeId
                )
            "
        );
        return $stmt->execute(
            array(
             "acknowledgementId" => $acknowledgementId,
             "degreeId"          => $degreeId,
            )
        );
    }
    /**
     * Deletes a degree from the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param string $degreeId          The degree id
     *
     * @return bool `true` on success
     */
    public static function deleteIfExists($acknowledgementId, $degreeId)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_degree
                WHERE
                    acknowledgementId = :acknowledgementId AND
                    degreeId     = :degreeId
            "
        );
        return $stmt->execute(
            array(
             "acknowledgementId" => $acknowledgementId,
             "degreeId"          => $degreeId,
            )
        );
    }
    /**
     * Deletes all degrees from the acknowledgement
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
                    acknowledgement_degree
                WHERE
                    acknowledgementId = :acknowledgementId
            "
        );
        return $stmt->execute(
            array("acknowledgementId" => $acknowledgementId)
        );
    }
    /**
     * Fetches all degrees of the acknowledgement
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
                    acknowledgement_degree ack
                JOIN
                    ack_center_degree item
                ON
                    item.id = ack.degreeId
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
     * Repopulates degrees of the acknowledgement
     *
     * @param string $acknowledgementId The acknowledgement id
     * @param array  $id_arr            The array of degree ids
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
