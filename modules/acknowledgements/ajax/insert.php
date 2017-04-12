<?php
/**
  * Insert a single acknowledgement.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    header("Content-Type: application/json");
    require_once __DIR__ . "/../model/require_once.php";

    //Validate request
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    die();
}
if (!isset($_POST["center_id"])
    || !is_string($_POST["center_id"])
    || !preg_match("/^\d+$/", $_POST["center_id"])
) {
    http_response_code(404);
    die();
}

    //Get input
    $center_id = $_POST["center_id"];
    //Validate permission
if (!AcknowledgementPermission::caninsertForCenter(
    User::singleton()->userInfo["ID"],
    $center_id
)) {
    http_response_code(401);
    die();
}
    //Get and validate the rest of the input
    require_once __DIR__ . "/validate_post.php";

    //insert
    $id = Acknowledgement::insert(
        $center_id,
        $full_name,
        $citation_name,
        $start_date,
        $end_date,
        $in_study_at_present
    );
    if (is_null($id)) {
        http_response_code(500);
        die(
            json_encode(
                array("error" => "Could not insert acknowledgement")
            )
        );
    }
    if (!AcknowledgementAffiliation::repopulateAllOfAcknowledgement(
        $id,
        $affiliation_arr
    )) {
        http_response_code(500);
        die(
            json_encode(
                array(
                 "id"    => $id,
                 "error" => "Could not complete inserting affiliations",
                )
            )
        );
    }
    if (!AcknowledgementDegree::repopulateAllOfAcknowledgement($id, $degree_arr)) {
        http_response_code(500);
        die(
            json_encode(
                array(
                 "id"    => $id,
                 "error" => "Could not complete inserting degrees",
                )
            )
        );
    }
    if (!AcknowledgementRole::repopulateAllOfAcknowledgement($id, $role_arr)) {
        http_response_code(500);
        die(
            json_encode(
                array(
                 "id"    => $id,
                 "error" => "Could not complete inserting roles",
                )
            )
        );
    }

    //Output
    die(
        json_encode(
            array("id" => $id),
            JSON_PRETTY_PRINT
        )
    );
?>
