<?php
/**
  * Hides a single degree for a center.
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
if ($_SERVER["REQUEST_METHOD"] != "DELETE") {
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
    $id   = $_GET["id"];
    $item = AckCenterDegree::fetch($id);
if (is_null($item)) {
    http_response_code(404);
    die();
}
    //Validate permission
if (!AcknowledgementPermission::canAdministerForCenter(
    User::singleton()->userInfo["ID"],
    $item->centerId
)) {
    http_response_code(401);
    die();
}
    //Hide
    $success = AckCenterDegree::update($item->id, $item->title, true);
if (!$success) {
    http_response_code(500);
    die(
        json_encode(
            array("error" => "Could not delete degree")
        )
    );
}

    //Output
    http_response_code(204);
    die();
?>
