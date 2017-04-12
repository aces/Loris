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
if (!isset($_POST["centerId"])
    || !is_string($_POST["centerId"])
    || !preg_match("/^\d+$/", $_POST["centerId"])
) {
    http_response_code(404);
    die();
}

    //Get input
    $centerId = $_POST["centerId"];
    //Validate permission
if (!AcknowledgementPermission::caninsertForCenter(
    User::singleton()->userInfo["ID"],
    $centerId
)) {
    http_response_code(401);
    die();
}
    //Get and validate the rest of the input
    require_once __DIR__ . "/validate_post.php";

    //insert
    $id = Acknowledgement::insert(
        $centerId,
        $fullName,
        $citationName,
        $startDate,
        $endDate,
        $inStudyAtPresent
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
        $affiliationArr
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
    if (!AcknowledgementDegree::repopulateAllOfAcknowledgement($id, $degreeArr)) {
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
    if (!AcknowledgementRole::repopulateAllOfAcknowledgement($id, $roleArr)) {
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
