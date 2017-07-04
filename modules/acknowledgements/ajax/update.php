<?php
/**
  * Update a single acknowledgement.
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
    $raw = file_get_contents("php://input");
    parse_str($raw, $_POST);

    //Validate request
if ($_SERVER["REQUEST_METHOD"] != "PUT") {
    http_response_code(405);
    die();
}
if (!isset($_GET["id"])
    || !is_string($_GET["id"])
    || !preg_match("/^\d+$/", $_GET["id"])
) {
    http_response_code(404);
    die();
}

    //Get input
    $id = $_GET["id"];
    //Validate permission
if (!AcknowledgementPermission::canupdate(User::singleton()->userInfo["ID"], $id)) {
    http_response_code(401);
    die();
}
    //Get and validate the rest of the input
    require_once __DIR__ . "/validate_post.php";

    //update
if (!Acknowledgement::update(
    $id,
    $fullName,
    $citationName,
    $startDate,
    $endDate,
    $inStudyAtPresent
)) {
    http_response_code(500);
    die(
        json_encode(
            array("error" => "Could not update acknowledgement")
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
            array("error" => "Could not complete updating affiliations")
        )
    );
}
if (!AcknowledgementDegree::repopulateAllOfAcknowledgement($id, $degreeArr)) {
    http_response_code(500);
    die(
        json_encode(
            array("error" => "Could not complete updating degrees")
        )
    );
}
if (!AcknowledgementRole::repopulateAllOfAcknowledgement($id, $roleArr)) {
    http_response_code(500);
    die(
        json_encode(
            array("error" => "Could not complete updating roles")
        )
    );
}

    //Output
    http_response_code(204);
    die();
?>
