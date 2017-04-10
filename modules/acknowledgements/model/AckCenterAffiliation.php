<?php
    class AckCenterAffiliation {
        /*
         * Fetches the affiliation.
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
                    ack_center_affiliation
                WHERE
                    id = :id
            ", array(
                "id"=>$id
            ));
            return empty($result) ?
                null : (object)$result;
        }
        /*
         * Fetches the affiliation.
         *
         * @param int    $center_id The center id
         * @param string $title     The title
         *
         * @return object|null The row object if exists
         */
        public static function FetchByTitle ($center_id, $title) {
            $result = Database::singleton()->pselectRow("
                SELECT
                    *
                FROM
                    ack_center_affiliation
                WHERE
                    center_id = :center_id AND
                    title = :title
            ", array(
                "center_id" => $center_id,
                "title"     => $title
            ));
            return empty($result) ?
                null : (object)$result;
        }
        /*
         * Inserts an affiliation to the center.
         * Affiliations cannot share the same name within a center.
         *
         * @param int    $center_id The center id
         * @param string $title     The title
         *
         * @return string|null The numeric `id` on success
         */
        public static function Insert ($center_id, $title) {
            //Does it exist?
            $item = self::FetchByTitle($center_id, $title);
            if (!is_null($item)) {
                if ($item->hidden) {
                    //Unhide it
                    if (self::Update($item->id, $item->title, false)) {
                        return $item->id;
                    } else {
                        return null;
                    }
                    
                } else {
                    return null;
                }
            }
            
            $stmt = Database::singleton()->prepare("
                INSERT INTO
                    ack_center_affiliation (center_id, title)
                VALUES (
                    :center_id, :title
                )
            ");
            if ($stmt->execute(array(
                "center_id" => $center_id,
                "title"     => $title
            ))) {
                return Database::singleton()->_PDO->lastInsertId();
            } else {
                return null;
            }
        }
        /*
         * Updates the affiliation of the center.
         * Note that you cannot and should not update the `center_id`
         * of an existing affiliation.
         *
         * @param string $title  The title
         * @param bool   $hidden Is this hidden?
         *
         * @return bool `true` on success
         */
        public static function Update ($id, $title, $hidden) {
            $stmt = Database::singleton()->prepare("
                UPDATE
                    ack_center_affiliation
                SET
                    title  = :title,
                    hidden = :hidden
                WHERE
                    id = :id
            ");
            return $stmt->execute(array(
                "id"     => $id,
                "title"  => $title,
                "hidden" => $hidden
            ));
        }
        /*
         * Fetches all affiliations of the center.
         *
         * @param int       $center_id The center id
         * @param bool|null $hidden    If `null`, fetches all, regardless of
         *                             `hidden`. If `true`, fetches all hidden.
         *                             If `false`, fetches all not hidden.
         *
         * @return array Each object-element has keys `id`, `title`
         */
        public static function FetchAllOfCenter ($center_id, $hidden=false) {
            $result = Database::singleton()->pselect("
                SELECT
                    *
                FROM
                    ack_center_affiliation
                WHERE
                    center_id = :center_id AND
                    (
                        (:hidden IS NULL) OR
                        hidden = :hidden2
                    )
                ORDER BY
                    title ASC
            ", array(
                "center_id" =>$center_id,
                "hidden"    =>$hidden,
                "hidden2"   =>$hidden
            ));
            //Objects are easier to work with, imo
            //Cleaner syntax
            for ($i=0; $i<count($result); ++$i) {
                $result[$i] = (object)$result[$i];
            }
            return $result;
        }
    }
?>