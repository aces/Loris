<?php
/**
  * Insert a single affiliation for a center.
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
    require_once __DIR__ . "/validation.php";

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
if (!AcknowledgementPermission::canAdministerForCenter(
    User::singleton()->userInfo["ID"],
    $centerId
)) {
    http_response_code(401);
    die();
}
    //Get and validate the rest of the input
    $title = isset($_POST["title"]) ? $_POST["title"] : null;

    Helper_validateString($title, "Title", 1, 255);

    //insert
    $id = AckCenterAffiliation::insert($centerId, $title);
if (is_null($id)) {
    http_response_code(500);
    die(
        json_encode(
            array("error" => "Could not insert affiliation '$title'")
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
