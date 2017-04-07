<?php
    class AcknowledgementDegree {
        public static function Exists ($acknowledgement_id, $degree_id) {
            $result = Database::singleton()->pselectOne("
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
            ", array(
                "acknowledgement_id" => $acknowledgement_id,
                "degree_id"     => $degree_id
            ));
            return ($result === "1");
        }
        public static function HasSameCenterId ($acknowledgement_id, $degree_id) {
            $result = Database::singleton()->pselectOne("
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
            ", array(
                "acknowledgement_id" => $acknowledgement_id,
                "degree_id"     => $degree_id
            ));
            return ($result === "1");
        }
        public static function InsertIfNotExists ($acknowledgement_id, $degree_id) {
            if (self::Exists($acknowledgement_id, $degree_id)) {
                return true;
            }
            if (!self::HasSameCenterId($acknowledgement_id, $degree_id)) {
                return false;
            }
            
            $stmt = Database::singleton()->prepare("
                INSERT INTO
                    acknowledgement_degree (acknowledgement_id, degree_id)
                VALUES (
                    :acknowledgement_id,
                    :degree_id
                )
            ");
            return $stmt->execute(array(
                "acknowledgement_id" => $acknowledgement_id,
                "degree_id"     => $degree_id
            ));
        }
        public static function DeleteIfExists ($acknowledgement_id, $degree_id) {
            $stmt = Database::singleton()->prepare("
                DELETE FROM
                    acknowledgement_degree
                WHERE
                    acknowledgement_id = :acknowledgement_id AND
                    degree_id     = :degree_id
            ");
            return $stmt->execute(array(
                "acknowledgement_id" => $acknowledgement_id,
                "degree_id"     => $degree_id
            ));
        }
        public static function DeleteAllOfAcknowledgement ($acknowledgement_id) {
            $stmt = Database::singleton()->prepare("
                DELETE FROM
                    acknowledgement_degree
                WHERE
                    acknowledgement_id = :acknowledgement_id
            ");
            return $stmt->execute(array(
                "acknowledgement_id" => $acknowledgement_id
            ));
        }
        public static function FetchAllOfAcknowledgement ($acknowledgement_id) {
            $result = Database::singleton()->pselect("
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
            ", array(
                "acknowledgement_id" =>$acknowledgement_id
            ));
            //Objects are easier to work with, imo
            //Cleaner syntax
            for ($i=0; $i<count($result); ++$i) {
                $result[$i] = (object)$result[$i];
            }
            return $result;
        }
        public static function RepopulateAllOfAcknowledgement ($acknowledgement_id, $id_arr) {
            if (!is_array($id_arr)) {
                return false;
            }
            foreach ($id_arr as $id) {
                if (!is_string($id) || !preg_match("/^\d+$/", $id)) {
                    return false;
                }
                if (!self::HasSameCenterId($acknowledgement_id, $id)) {
                    return false;
                }
            }
            if (!self::DeleteAllOfAcknowledgement($acknowledgement_id)) {
                return false;
            }
            foreach ($id_arr as $id) {
                if (!self::InsertIfNotExists($acknowledgement_id, $id)) {
                    return false;
                }
            }
            return true;
        }
    }
?>