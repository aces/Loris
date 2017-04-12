<?php
/**
  * Handles all affiliations of a center.
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
  * Handles all affiliations of a center.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class AckCenterAffiliation
{
    /**
     * Fetches the affiliation.
     *
     * @param string $id The numeric `id`
     *
     * @return object|null The row object if exists
     */
    public static function fetch($id)
    {
        $result = Database::singleton()->pselectRow(
            "
                SELECT
                    *
                FROM
                    ack_center_affiliation
                WHERE
                    id = :id
            ",
            array("id" => $id)
        );
        return empty($result) ?
            null : (object)$result;
    }
    /**
     * Fetches the affiliation.
     *
     * @param int    $centerId The center id
     * @param string $title    The title
     *
     * @return object|null The row object if exists
     */
    public static function fetchByTitle($centerId, $title)
    {
        $result = Database::singleton()->pselectRow(
            "
                SELECT
                    *
                FROM
                    ack_center_affiliation
                WHERE
                    centerId = :centerId AND
                    title = :title
            ",
            array(
             "centerId" => $centerId,
             "title"    => $title,
            )
        );
        return empty($result) ?
            null : (object)$result;
    }
    /**
     * Inserts an affiliation to the center.
     * Affiliations cannot share the same name within a center.
     *
     * @param int    $centerId The center id
     * @param string $title    The title
     *
     * @return string|null The numeric `id` on success
     */
    public static function insert($centerId, $title)
    {
        //Does it exist?
        $item = self::fetchByTitle($centerId, $title);
        if (!is_null($item)) {
            if ($item->hidden) {
                //Unhide it
                if (self::update($item->id, $item->title, false)) {
                    return $item->id;
                } else {
                    return null;
                }

            } else {
                return null;
            }
        }

        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    ack_center_affiliation (centerId, title)
                VALUES (
                    :centerId, :title
                )
            "
        );
        if ($stmt->execute(
            array(
             "centerId" => $centerId,
             "title"    => $title,
            )
        )) {
            return Database::singleton()->_PDO->lastinsertId();
        } else {
            return null;
        }
    }
    /**
     * Updates the affiliation of the center.
     * Note that you cannot and should not update the `centerId`
     * of an existing affiliation.
     *
     * @param string|int $id     The numeric id
     * @param string     $title  The title
     * @param bool       $hidden Is this hidden?
     *
     * @return bool `true` on success
     */
    public static function update($id, $title, $hidden)
    {
        $stmt = Database::singleton()->prepare(
            "
                UPDATE
                    ack_center_affiliation
                SET
                    title  = :title,
                    hidden = :hidden
                WHERE
                    id = :id
            "
        );
        return $stmt->execute(
            array(
             "id"     => $id,
             "title"  => $title,
             "hidden" => $hidden,
            )
        );
    }
    /**
     * Fetches all affiliations of the center.
     *
     * @param int       $centerId The center id
     * @param bool|null $hidden   If `null`, fetches all, regardless of
     *                             `hidden`. If `true`, fetches all hidden.
     *                             If `false`, fetches all not hidden.
     *
     * @return array Each object-element has keys `id`, `title`
     */
    public static function fetchAllOfCenter($centerId, $hidden=false)
    {
        $result = Database::singleton()->pselect(
            "
                SELECT
                    *
                FROM
                    ack_center_affiliation
                WHERE
                    centerId = :centerId AND
                    (
                        (:hidden IS NULL) OR
                        hidden = :hidden2
                    )
                ORDER BY
                    title ASC
            ",
            array(
             "centerId" => $centerId,
             "hidden"   => $hidden,
             "hidden2"  => $hidden,
            )
        );
        //Objects are easier to work with, imo
        //Cleaner syntax
        for ($i=0; $i<count($result); ++$i) {
            $result[$i] = (object)$result[$i];
        }
        return $result;
    }
}
?>
