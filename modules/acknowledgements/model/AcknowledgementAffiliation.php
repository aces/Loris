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
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $affiliation_id     The affiliation id
     *
     * @return bool `true` if exists
     */
    public static function exists($acknowledgement_id, $affiliation_id)
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
                            acknowledgement_id = :acknowledgement_id AND
                            affiliation_id     = :affiliation_id
                    )
            ",
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "affiliation_id"     => $affiliation_id,
            )
        );
        return ($result === "1");
    }
    /**
     * Checks the acknowledgement and affiliation are from the same center
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $affiliation_id     The affiliation id
     *
     * @return bool `true` if they are from the same center
     */
    public static function hasSameCenterId($acknowledgement_id, $affiliation_id)
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
                            ack_center_affiliation
                        WHERE
                            id = :affiliation_id
                    )
            ",
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "affiliation_id"     => $affiliation_id,
            )
        );
        return ($result === "1");
    }
    /**
     * Inserts a affiliation to the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $affiliation_id     The affiliation id
     *
     * @return bool `true` on success
     */
    public static function insertIfNotExists($acknowledgement_id, $affiliation_id)
    {
        if (self::exists($acknowledgement_id, $affiliation_id)) {
            return true;
        }
        if (!self::hasSameCenterId($acknowledgement_id, $affiliation_id)) {
            return false;
        }

        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    acknowledgement_affiliation (acknowledgement_id, affiliation_id)
                VALUES (
                    :acknowledgement_id,
                    :affiliation_id
                )
            "
        );
        return $stmt->execute(
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "affiliation_id"     => $affiliation_id,
            )
        );
    }
    /**
     * Deletes a affiliation from the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param string $affiliation_id     The affiliation id
     *
     * @return bool `true` on success
     */
    public static function deleteIfExists($acknowledgement_id, $affiliation_id)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement_affiliation
                WHERE
                    acknowledgement_id = :acknowledgement_id AND
                    affiliation_id     = :affiliation_id
            "
        );
        return $stmt->execute(
            array(
             "acknowledgement_id" => $acknowledgement_id,
             "affiliation_id"     => $affiliation_id,
            )
        );
    }
    /**
     * Deletes all affiliations from the acknowledgement
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
                    acknowledgement_affiliation
                WHERE
                    acknowledgement_id = :acknowledgement_id
            "
        );
        return $stmt->execute(
            array("acknowledgement_id" => $acknowledgement_id)
        );
    }
    /**
     * Fetches all affiliations of the acknowledgement
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
                    acknowledgement_affiliation ack
                JOIN
                    ack_center_affiliation item
                ON
                    item.id = ack.affiliation_id
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
     * Repopulates affiliations of the acknowledgement
     *
     * @param string $acknowledgement_id The acknowledgement id
     * @param array  $id_arr             The array of affiliation ids
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
