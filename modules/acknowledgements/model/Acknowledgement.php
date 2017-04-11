<?php
    class Acknowledgement {
        /*
         * Checks if `$str` is a valid MySQL `DATE`.
         * *Does not* check if it's a valid `DATETIME` or `TIMESTAMP`!
         *
         * @param string $str The string to check
         *
         * @return bool `true` if `$str` is a valid MySQL `DATE`
         */
        public static function IsValidMySQLDate ($str) {
            if (
                is_string($str) &&
                //@see https://dev.mysql.com/doc/refman/5.7/en/datetime.html
                preg_match("/^\d{4}-\d{2}-\d{2}$/", $str) &&
                $str >= "1000-01-01" &&
                $str <= "9999-12-31"
            ) {
                $arr = explode("-", $str);
                //@see http://php.net/manual/en/function.checkdate.php
                return checkdate($arr[1], $arr[2], $arr[0]);
            } else {
                return false;
            }
        }
        public static function FetchValidDateRange () {
            $config = NDB_Config::singleton();
            return (object)array(
                "start" => $config->getSetting("startYear") . "-01-01",
                "end"   => $config->getSetting("endYear")   . "-12-31",
            );
        }
        public static function IsValidStudyDate ($str) {
            if (!self::IsValidMySQLDate($str)) {
                return false;
            }
            $range = self::FetchValidDateRange();
            return $str >= $range->start && $str <= $range->end;
        }
        /*
         * Convenience method to check if start and end dates are valid.
         *
         * @param string $start_date The start date
         * @param string $end_date   The end date
         *
         * @return bool `true` if dates are valid,
         *              and `$end_date >= $start_date`, if applicable
         */
        public static function IsValidStartToEndDate ($start_date, $end_date) {
            if (is_null($start_date)) {
                if (is_null($end_date)) {
                    return true; //It is valid for both to be null
                } else {
                    //Only need to check `$end_date`
                    return self::IsValidStudyDate($end_date);
                }
            } else if (is_null($end_date)) {
                //Only need to check `$start_date`
                return self::IsValidStudyDate($start_date);
            } else {
                return
                    self::IsValidStudyDate($start_date) &&
                    self::IsValidStudyDate($end_date) &&
                    $end_date >= $start_date;
            }
        }
        /*
         * Inserts a new acknowledgement
         *
         * @param int         $center_id     The center id
         * @param string      $full_name     The full name
         * @param string      $citation_name The citation name
         * @param string      $start_date    The start date in MySQL `DATE` format
         * @param string|null $end_date      The end date in MySQL `DATE` format,
         *                                   Must be >= $start_date
         *
         * @param bool $in_study_at_present Is the user part of the study at the moment?
         *
         * @return string|null The numeric `id` on success
         */
        public static function Insert ($center_id, $full_name, $citation_name, $start_date, $end_date, $in_study_at_present) {
            if (!self::IsValidStartToEndDate($start_date, $end_date)) {
                return null;
            }
            $stmt = Database::singleton()->prepare("
                INSERT INTO
                    acknowledgement (center_id, full_name, citation_name, start_date, end_date, in_study_at_present)
                VALUES (
                    :center_id,
                    :full_name,
                    :citation_name,
                    :start_date,
                    :end_date,
                    :in_study_at_present
                )
            ");
            if($stmt->execute(array(
                "center_id"     => $center_id,
                "full_name"     => $full_name,
                "citation_name" => $citation_name,
                "start_date"    => $start_date,
                "end_date"      => $end_date,
                "in_study_at_present" => $in_study_at_present
            ))) {
                return Database::singleton()->_PDO->lastInsertId();
            } else {
                return null;
            }
        }
        /*
         * Updates the acknowledgement.
         * Note that you cannot and should not update the `center_id`
         * of an existing acknowledgement.
         *
         * @param string      $id            The numeric `id`
         * @param string      $full_name     The full name
         * @param string      $citation_name The citation name
         * @param string      $start_date    The start date in MySQL `DATE` format
         * @param string|null $end_date      The end date in MySQL `DATE` format,
         *                                   Must be >= $start_date
         *
         * @param bool $in_study_at_present Is the user part of the study at the moment?
         *
         * @return bool `true` on success
         */
        public static function Update ($id, $full_name, $citation_name, $start_date, $end_date, $in_study_at_present) {
            if (!self::IsValidStartToEndDate($start_date, $end_date)) {
                return false;
            }
            $stmt = Database::singleton()->prepare("
                UPDATE
                    acknowledgement
                SET
                    full_name     = :full_name,
                    citation_name = :citation_name,
                    start_date    = :start_date,
                    end_date      = :end_date,
                    in_study_at_present = :in_study_at_present
                WHERE
                    id = :id
            ");
            return $stmt->execute(array(
                "id"            => $id,
                "full_name"     => $full_name,
                "citation_name" => $citation_name,
                "start_date"    => $start_date,
                "end_date"      => $end_date,
                "in_study_at_present" => $in_study_at_present
            ));
        }
        /*
         * Deletes the acknowledgement.
         *
         * @param string $id The numeric `id`
         *
         * @return bool `true` on success
         */
        public static function Delete ($id) {
            $stmt = Database::singleton()->prepare("
                DELETE FROM
                    acknowledgement
                WHERE
                    id = :id
            ");
            return $stmt->execute(array(
                "id" => $id
            ));
        }
        /*
         * Fetches the acknowledgement.
         *
         * @param string $id The numeric `id`
         *
         * @return object|null The row object if exists
         */
        public static function Fetch ($id) {
            $result = Database::singleton()->pselectRow("
                SELECT
                    *
                FROM
                    acknowledgement
                WHERE
                    id = :id
            ", array(
                "id"=>$id
            ));
            return empty($result) ?
                null : (object)$result;
        }
        /*
         * Fetches all acknowledgements of the center.
         *
         * @param int|null    $center_id The center id; null for all centers
         * @param string|null $start     Used in MySQL's `LIMIT`; numeric
         * @param string|null $count     Used in MySQL's `LIMIT`; numeric
         *                               If `$start` is non-null, `$count`
         *                               must be non-null, too
         *
         * @return array|null Each object-element has keys `id`, `title`;
         *                    `null` on failure
         */
        public static function FetchAllOfCenter ($center_id, $data=array()) {
            $query = "
                SELECT
                    *
                FROM
                    acknowledgement
                WHERE
                    (
                        center_id = :center_id OR
                        :center_id2 IS NULL
                    )
                    [[WHERE]]
                ORDER BY
                    (start_date IS NULL) DESC,
                    start_date ASC,
                    (end_date IS NULL) DESC,
                    end_date ASC,
                    (in_study_at_present IS NULL) DESC,
                    in_study_at_present DESC,
                    citation_name ASC,
                    full_name ASC
                [[LIMIT]]
            ";
            $args = array(
                "center_id"  =>$center_id,
                "center_id2" =>$center_id
            );
            
            //[[WHERE]]
            $where_arr = array();
            if (isset($data["full_name"])) {
                $where_arr[] = "full_name LIKE :full_name";
                $args["full_name"] = "%".$data["full_name"]."%";
            }
            if (isset($data["citation_name"])) {
                $where_arr[] = "citation_name LIKE :citation_name";
                $args["citation_name"] = "%".$data["citation_name"]."%";
            }
            if (isset($data["start_date"])) {
                $where_arr[] = "start_date >= :start_date";
                $args["start_date"] = $data["start_date"];
            }
            if (isset($data["end_date"])) {
                $where_arr[] = "end_date <= :end_date";
                $args["end_date"] = $data["end_date"];
            }
            if (isset($data["filter_in_study_at_present"]) && $data["filter_in_study_at_present"]) {
                if (is_null($data["in_study_at_present"])) {
                    $where_arr[] = "in_study_at_present IS NULL";
                } else {
                    $where_arr[] = "in_study_at_present = :in_study_at_present";
                    $args["in_study_at_present"] = $data["in_study_at_present"];
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
                $query = str_replace("[[LIMIT]]", "LIMIT :start", $query);
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
        /*
         * Convenience method for fetching details about the acknowledgement.
         *
         * @param object $obj The acknowledgement object, must have `id`
         *
         * @return bool `true` if `$obj` was populated with keys
         *              `affiliation_arr`, `degree_arr`, `role_arr`
         */
        public static function FetchDetails ($obj) {
            if (!is_object($obj) || !isset($obj->id)) {
                return false;
            }
            $obj-> affiliation_arr = AcknowledgementAffiliation::FetchAllOfAcknowledgement($obj->id);
            $obj-> degree_arr      = AcknowledgementDegree::FetchAllOfAcknowledgement($obj->id);
            $obj-> role_arr        = AcknowledgementRole::FetchAllOfAcknowledgement($obj->id);
            return true;
        }
    }
?>