<?php
/**
  * Fetch all affiliations of a center.
  *
  * @category acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    header("Content-Type: application/json");
    require_once(__DIR__ . "/../model/require_once.php");
    
    //Validate request
    if ($_SERVER["REQUEST_METHOD"] != "GET") {
        http_response_code(405);
        die();
    }
    if (!isset($_GET["center_id"]) || !is_string($_GET["center_id"]) || !preg_match("/^\d+$/", $_GET["center_id"])) {
        http_response_code(404);
        die();
    }
    //Get input
    $center_id = $_GET["center_id"];
    //Validate permission
    if (!AcknowledgementPermission::CanViewForCenter(User::singleton()->userInfo["ID"], $center_id)) {
        http_response_code(401);
        die();
    }
    //Fetch
    $result = AckCenterAffiliation::FetchAllOfCenter($center_id);
    //Validate/Process fetched
    if (is_null($result)) {
        http_response_code(500);
        die();
    }
    
    //Output
    die(json_encode(array(
        "arr"=>$result
    ), JSON_PRETTY_PRINT));
?>