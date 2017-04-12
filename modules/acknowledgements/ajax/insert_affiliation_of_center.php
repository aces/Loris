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
if (!AcknowledgementPermission::canAdministerForCenter(
    User::singleton()->userInfo["ID"],
    $center_id
)) {
    http_response_code(401);
    die();
}
    //Get and validate the rest of the input
    $title = isset($_POST["title"]) ? $_POST["title"] : null;

    Helper_validateString($title, "Title", 1, 255);

    //insert
    $id = AckCenterAffiliation::insert($center_id, $title);
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
