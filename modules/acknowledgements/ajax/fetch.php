<?php
/**
  * Fetch a single acknowledgement.
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
    //Validate permission
if (!AcknowledgementPermission::canView(User::singleton()->userInfo["ID"], $id)) {
    http_response_code(401);
    die();
}
    //fetch
    $obj = Acknowledgement::fetch($id);
    //Validate/Process fetched
if (is_null($obj)) {
    http_response_code(404);
    die();

}
if (!Acknowledgement::fetchDetails($obj)) {
    http_response_code(500);
    die();

}
    //Output
    die(json_encode($obj, JSON_PRETTY_PRINT));
?>
