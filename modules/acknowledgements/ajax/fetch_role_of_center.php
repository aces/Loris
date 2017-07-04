<?php
/**
  * Fetch a single role.
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
if ($_SERVER["REQUEST_METHOD"] != "GET") {
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
    //fetch
    $item = AckCenterRole::fetch($id);
    //Validate/Process fetched
if (is_null($item)) {
    http_response_code(404);
    die();
}
    //Validate permission
if (!AcknowledgementPermission::canViewForCenter(
    User::singleton()->userInfo["ID"],
    $item->centerId
)) {
    http_response_code(401);
    die();
}
    //Output
    die(json_encode($item, JSON_PRETTY_PRINT));
?>
