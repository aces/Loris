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
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $degree_id          The degree id
     *
     * @return bool `true` if exists
     */
    public static function exists($acknowledgement_id, $degree_id)
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
                            acknowledgement_id = :acknowledgement_id AND
                            degree_id     = :degree_id
                    )
            ",
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "degree_id"          => $degree_id,
            )
        );
        return ($result === "1");
    }
    /**
     * Checks the acknowledgement and degree are from the same center
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $degree_id          The degree id
     *
     * @return bool `true` if they are from the same center
     */
    public static function hasSameCenterId($acknowledgement_id, $degree_id)
    {
        $result = Database::singleton()->pselectOne(
            "
                SELECT
                    (
                        SELECT
                            center_id
                        FROM
                            acknowledgement
                        WHERE
                            id = :acknowledgement_id
                    ) = (
                        SELECT
                            center_id
                        FROM
                            ack_center_degree
                        WHERE
                            id = :degree_id
                    )
            ",
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "degree_id"          => $degree_id,
            )
        );
        return ($result === "1");
    }
    /**
     * Inserts a degree to the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $degree_id          The degree id
     *
     * @return bool `true` on success
     */
    public static function insertIfNotExists($acknowledgement_id, $degree_id)
    {
        if (self::exists($acknowledgement_id, $degree_id)) {
            return true;
        }
        if (!self::hasSameCenterId($acknowledgement_id, $degree_id)) {
            return false;
        }

        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    acknowledgement_degree (acknowledgement_id, degree_id)
                VALUES (
                    :acknowledgement_id,
                    :degree_id
                )
            "
        );
        return $stmt->execute(
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "degree_id"          => $degree_id,
            )
        );
    }
    /**
     * Deletes a degree from the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $degree_id          The degree id
     *
     * @return bool `true` on success
     */
    public static function deleteIfExists($acknowledgement_id, $degree_id)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_degree
                WHERE
                    acknowledgement_id = :acknowledgement_id AND
                    degree_id     = :degree_id
            "
        );
        return $stmt->execute(
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "degree_id"          => $degree_id,
            )
        );
    }
    /**
     * Deletes all degrees from the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     *
     * @return bool `true` on success
     */
    public static function deleteAllOfAcknowledgement($acknowledgement_id)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_degree
                WHERE
                    acknowledgement_id = :acknowledgement_id
            "
        );
        return $stmt->execute(
            array("acknowledgement_id" => $acknowledgement_id)
        );
    }
    /**
     * Fetches all degrees of the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     *
     * @return array The array of objects
     */
    public static function fetchAllOfAcknowledgement($acknowledgement_id)
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
                    item.id = ack.degree_id
                WHERE
                    ack.acknowledgement_id = :acknowledgement_id
                ORDER BY
                    item.title ASC
            ",
            array("acknowledgement_id" => $acknowledgement_id)
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
     * @param string $acknowledgement_id The acknowledgement id
     * @param array  $id_arr             The array of degree ids
     *
     * @return bool `true` on success
     */
    public static function repopulateAllOfAcknowledgement(
        $acknowledgement_id,
        $id_arr
    ) {

        if (!is_array($id_arr)) {
            return false;
        }
        foreach ($id_arr as $id) {
            if (!is_string($id) || !preg_match("/^\d+$/", $id)) {
                return false;
            }
            if (!self::hasSameCenterId($acknowledgement_id, $id)) {
                return false;
            }
        }
        if (!self::deleteAllOfAcknowledgement($acknowledgement_id)) {
            return false;
        }
        foreach ($id_arr as $id) {
            if (!self::insertIfNotExists($acknowledgement_id, $id)) {
                return false;
            }
        }
        return true;
    }
}
?>
