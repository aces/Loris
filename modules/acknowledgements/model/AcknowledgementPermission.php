<?php
    class AcknowledgementPermission {
        /*
         * Used internally so, when the great refactoring comes,
         * we may be spared from disaster.
         *
         * @param int $user_id The user id
         *
         * @return string|null The username on success
         */
        private static function UserId2Username ($user_id) {
            //The great prophets of ages past decided UserID meant Username
            //and ID meant User Id
            $result = Database::singleton()->pselectOne("
                SELECT
                    UserID
                FROM
                    users
                WHERE
                    ID = :user_id
            ", array(
                "user_id"=>$user_id
            ));
            return is_string($result) ?
                $result : null;
        }
        /*
         * Checks if the user can view acknowledgements
         * of at least one center
         *
         * @param int $user_id The user id
         *
         * @return bool `true` if the user has the permission
         */
        public static function CanViewForAtLeastOneCenter ($user_id) {
            return count(self::FetchAllViewableCenter($user_id)) > 0;
        }
        /*
         * Checks if the user can view a specific acknowledgement
         *
         * @param int $user_id            The user id
         * @param int $acknowledgement_id The acknowledgement id
         *                       //Unused at the moment, anticipating refactor
         *
         * @return bool `true` if the user has the permission
         */
        public static function CanView ($user_id, $acknowledgement_id) {
            $username = self::UserId2Username($user_id);
            if (is_null($username)) {
                return false;
            }
            $user = User::factory($username);
            return $user->hasPermission("acknowledgements_view");
        }
        /*
         * Checks if the user can view acknowledgements for a given center
         *
         * @param int $user_id   The user id
         * @param int $center_id The center id
         *
         * @return bool `true` if the user has the permission
         */
        public static function CanViewForCenter ($user_id, $center_id) {
            $username = self::UserId2Username($user_id);
            if (is_null($username)) {
                return false;
            }
            $user = User::factory($username);
            return
                $user->hasPermission("acknowledgements_view") &&
                in_array($center_id, $user->getCenterID());
        }
        /*
         * Fetches all centers the user can view acknowledgements for
         *
         * @param int $user_id The user id
         *
         * @return array|null On success, each object-element has keys `id`, `name`
         */
        public static function FetchAllViewableCenter ($user_id) {
            $username = self::UserId2Username($user_id);
            if (is_null($username)) {
                return null;
            }
            $user = User::factory($username);
            $center_id_arr   = $user->getCenterID();
            $viewable_id_arr = array();
            foreach ($center_id_arr as $center_id) {
                if (self::CanViewForCenter($user_id, $center_id)) {
                    $viewable_id_arr[] = $center_id;
                }
            }
            if (count($viewable_id_arr) == 0) {
                return array();
            }
            $in_str = implode(", ", $viewable_id_arr);
            $result = Database::singleton()->pselect("
                SELECT
                    CenterID AS id,
                    Name AS name
                FROM
                    psc
                WHERE
                    CenterID IN ($in_str)
            ");
            
            //Objects are easier to work with, imo
            //Cleaner syntax
            for ($i=0; $i<count($result); ++$i) {
                $result[$i] = (object)$result[$i];
            }
            return $result;
        }
        /*
         * Checks if the user can insert acknowledgements for a given center
         *
         * @param int $user_id   The user id
         * @param int $center_id The center id
         *
         * @return bool `true` if the user has the permission
         */
        public static function CanInsertForCenter ($user_id, $center_id) {
            $username = self::UserId2Username($user_id);
            if (is_null($username)) {
                return false;
            }
            $user = User::factory($username);
            return
                $user->hasPermission("acknowledgements_edit") &&
                in_array($center_id, $user->getCenterID());
        }
        /*
         * Checks if the user can update a specific acknowledgement
         *
         * @param int $user_id            The user id
         * @param int $acknowledgement_id The acknowledgement id
         *                                //Unused at the moment,
         *                                //anticipating refactor
         *
         * @return bool `true` if the user has the permission
         */
        public static function CanUpdate ($user_id, $acknowledgement_id) {
            $username = self::UserId2Username($user_id);
            if (is_null($username)) {
                return false;
            }
            $user = User::factory($username);
            return $user->hasPermission("acknowledgements_edit");
        }
        /*
         * Checks if the user can delete a specific acknowledgement
         *
         * @param int $user_id            The user id
         * @param int $acknowledgement_id The acknowledgement id
         *                                //Unused at the moment,
         *                                //anticipating refactor
         *
         * @return bool `true` if the user has the permission
         */
        public static function CanDelete ($user_id, $acknowledgement_id) {
            //CanDelete() is a synonym for CanUpdate() for now
            //May have different permissions in the future?
            return self::CanUpdate($user_id, $acknowledgement_id);
        }
    }
?>