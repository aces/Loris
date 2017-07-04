<?php
/**
  * Handles all acknowledgements.
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
  * Handles all acknowledgements.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class Acknowledgement
{
    /**
     * Checks if `$str` is a valid MySQL `DATE`.
     * *Does not* check if it's a valid `DATETIME` or `TIMESTAMP`!
     *
     * @param string $str The string to check
     *
     * @return bool `true` if `$str` is a valid MySQL `DATE`
     */
    public static function isValidMySQLDate($str)
    {
        if (is_string($str)
            //@see https://dev.mysql.com/doc/refman/5.7/en/datetime.html
            && preg_match("/^\d{4}-\d{2}-\d{2}$/", $str)
            && $str >= "1000-01-01"
            && $str <= "9999-12-31"
        ) {
            $arr = explode("-", $str);
            //@see http://php.net/manual/en/function.checkdate.php
            return checkdate($arr[1], $arr[2], $arr[0]);
        } else {
            return false;
        }
    }
    /**
     * Convenience method for getting the valid date range
     *
     * @return object Has keys `start`, `end`, denoting the range
     */
    public static function fetchValidDateRange()
    {
        $config = NDB_Config::singleton();
        return (object)array(
                        "start" => $config->getSetting("startYear") . "-01-01",
                        "end"   => $config->getSetting("endYear")   . "-12-31",
                       );
    }
    /**
     * Checks if `$str` is a valid study date.
     *
     * @param string $str The string to check
     *
     * @return bool `true` if `$str` is a valid study date
     */
    public static function isValidStudyDate($str)
    {
        if (!self::isValidMySQLDate($str)) {
            return false;
        }
        $range = self::fetchValidDateRange();
        return $str >= $range->start && $str <= $range->end;
    }
    /**
     * Convenience method to check if start and end dates are valid.
     *
     * @param string $startDate The start date
     * @param string $endDate   The end date
     *
     * @return bool `true` if dates are valid,
     *              and `$endDate >= $startDate`, if applicable
     */
    public static function isValidStartToEndDate($startDate, $endDate)
    {
        if (is_null($startDate)) {
            if (is_null($endDate)) {
                return true; //It is valid for both to be null
            } else {
                //Only need to check `$endDate`
                return self::isValidStudyDate($endDate);
            }
        } else if (is_null($endDate)) {
            //Only need to check `$startDate`
            return self::isValidStudyDate($startDate);
        } else {
            return
                self::isValidStudyDate($startDate) &&
                self::isValidStudyDate($endDate) &&
                $endDate >= $startDate;
        }
    }
    /**
     * Inserts a new acknowledgement
     *
     * @param int         $centerId         The center id
     * @param string      $fullName         The full name
     * @param string      $citationName     The citation name
     * @param string      $startDate        The start date in MySQL `DATE` format
     * @param string|null $endDate          The end date in MySQL `DATE` format,
     *                                         Must be >= $startDate
     * @param bool        $inStudyAtPresent Is the user part of the study
     *                                         at the moment?
     *
     * @return string|null The numeric `id` on success
     */
    public static function insert(
        $centerId,
        $fullName,
        $citationName,
        $startDate,
        $endDate,
        $inStudyAtPresent
    ) {

        if (!self::isValidStartToEndDate($startDate, $endDate)) {
            return null;
        }
        $stmt = Database::singleton()->prepare(
            "
                INSERT INTO
                    acknowledgement (
                        centerId,
                        fullName,
                        citationName,
                        startDate,
                        endDate,
                        inStudyAtPresent
                    )
                VALUES (
                    :centerId,
                    :fullName,
                    :citationName,
                    :startDate,
                    :endDate,
                    :inStudyAtPresent
                )
            "
        );
        if ($stmt->execute(
            array(
             "centerId"         => $centerId,
             "fullName"         => $fullName,
             "citationName"     => $citationName,
             "startDate"        => $startDate,
             "endDate"          => $endDate,
             "inStudyAtPresent" => $inStudyAtPresent,
            )
        )) {
            return Database::singleton()->_PDO->lastinsertId();
        } else {
            return null;
        }
    }
    /**
     * Updates the acknowledgement.
     * Note that you cannot and should not update the `centerId`
     * of an existing acknowledgement.
     *
     * @param string      $id               The numeric `id`
     * @param string      $fullName         The full name
     * @param string      $citationName     The citation name
     * @param string      $startDate        The start date in MySQL `DATE` format
     * @param string|null $endDate          The end date in MySQL `DATE` format,
     *                                         Must be >= $startDate
     * @param bool        $inStudyAtPresent Is the user part of the study
     *                                         at the moment?
     *
     * @return bool `true` on success
     */
    public static function update(
        $id,
        $fullName,
        $citationName,
        $startDate,
        $endDate,
        $inStudyAtPresent
    ) {

        if (!self::isValidStartToEndDate($startDate, $endDate)) {
            return false;
        }
        $stmt = Database::singleton()->prepare(
            "
                UPDATE
                    acknowledgement
                SET
                    fullName     = :fullName,
                    citationName = :citationName,
                    startDate    = :startDate,
                    endDate      = :endDate,
                    inStudyAtPresent = :inStudyAtPresent
                WHERE
                    id = :id
            "
        );
        return $stmt->execute(
            array(
             "id"               => $id,
             "fullName"         => $fullName,
             "citationName"     => $citationName,
             "startDate"        => $startDate,
             "endDate"          => $endDate,
             "inStudyAtPresent" => $inStudyAtPresent,
            )
        );
    }
    /**
     * Deletes the acknowledgement.
     *
     * @param string $id The numeric `id`
     *
     * @return bool `true` on success
     */
    public static function delete($id)
    {
        $stmt = Database::singleton()->prepare(
            "
                DELETE FROM
                    acknowledgement
                WHERE
                    id = :id
            "
        );
        return $stmt->execute(
            array("id" => $id)
        );
    }
    /**
     * Fetches the acknowledgement.
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
                    acknowledgement
                WHERE
                    id = :id
            ",
            array("id" => $id)
        );
        return empty($result) ?
            null : (object)$result;
    }
    /**
     * Fetches all acknowledgements of the center.
     *
     * @param int|null $centerId The center id; null for all centers
     * @param array    $data     The data to modify fetched output
     *
     * @return array|null Each object-element has keys `id`, `title`;
     *                    `null` on failure
     */
    public static function fetchAllOfCenter($centerId, $data=array())
    {
        $query = "
                SELECT
                    *
                FROM
                    acknowledgement
                WHERE
                    (
                        centerId = :centerId OR
                        :centerId2 IS NULL
                    )
                    [[WHERE]]
                ORDER BY
                    (startDate IS NULL) DESC,
                    startDate ASC,
                    (endDate IS NULL) DESC,
                    endDate ASC,
                    (inStudyAtPresent IS NULL) DESC,
                    inStudyAtPresent DESC,
                    citationName ASC,
                    fullName ASC
                [[LIMIT]]
            ";
        $args  = array(
                  "centerId"  => $centerId,
                  "centerId2" => $centerId,
                 );

        //[[WHERE]]
        $where_arr = array();
        if (isset($data["fullName"])) {
            $where_arr[]      = "fullName LIKE :fullName";
            $args["fullName"] = "%".$data["fullName"]."%";
        }
        if (isset($data["citationName"])) {
            $where_arr[]          = "citationName LIKE :citationName";
            $args["citationName"] = "%".$data["citationName"]."%";
        }
        if (isset($data["startDate"])) {
            $where_arr[]       = "startDate >= :startDate";
            $args["startDate"] = $data["startDate"];
        }
        if (isset($data["endDate"])) {
            $where_arr[]     = "endDate <= :endDate";
            $args["endDate"] = $data["endDate"];
        }
        if (isset($data["filter_inStudyAtPresent"])
            && $data["filter_inStudyAtPresent"]
        ) {
            if (is_null($data["inStudyAtPresent"])) {
                $where_arr[] = "inStudyAtPresent IS NULL";
            } else {
                $where_arr[] = "inStudyAtPresent = :inStudyAtPresent";
                $args["inStudyAtPresent"] = $data["inStudyAtPresent"];
            }
        }
        if (count($where_arr) == 0) {
            $query = str_replace("[[WHERE]]", "", $query);
        } else {
            $where = "AND " . implode(" AND ", $where_arr);
            $query = str_replace("[[WHERE]]", $where, $query);
        }
        //[[LIMIT]]
        $start = isset($data["start"]) ? $data["start"] : null;
        $count = isset($data["count"]) ? $data["count"] : null;
        if (is_null($start)) {
            $query = str_replace("[[LIMIT]]", "", $query);
        } else if (is_null($count)) {
            $query         = str_replace("[[LIMIT]]", "LIMIT :start", $query);
            $args["start"] = $start;
        } else {
            $query = str_replace("[[LIMIT]]", "LIMIT :start, :count", $query);

            $args["start"] = $start;
            $args["count"] = $count;
        }

        $result = Database::singleton()->pselect($query, $args);
        //Objects are easier to work with, imo
        //Cleaner syntax
        for ($i=0; $i<count($result); ++$i) {
            $result[$i] = (object)$result[$i];
        }
        return $result;
    }
    /**
     * Convenience method for fetching details about the acknowledgement.
     *
     * @param object $obj The acknowledgement object, must have `id`
     *
     * @return bool `true` if `$obj` was populated with keys
     *              `affiliationArr`, `degreeArr`, `roleArr`
     */
    public static function fetchDetails($obj)
    {
        if (!is_object($obj) || !isset($obj->id)) {
            return false;
        }
        $obj->affiliationArr
            = AcknowledgementAffiliation::fetchAllOfAcknowledgement(
                $obj->id
            );

        $obj->degreeArr = AcknowledgementDegree::fetchAllOfAcknowledgement(
            $obj->id
        );

        $obj->roleArr = AcknowledgementRole::fetchAllOfAcknowledgement($obj->id);
        return true;
    }
}
?>
