<?php
/**
  * Fetch all affiliations of a center.
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
if (!isset($_GET["centerId"])
    || !is_string($_GET["centerId"])
    || !preg_match("/^\d+$/", $_GET["centerId"])
) {
    http_response_code(404);
    die();
}
    //Get input
    $centerId = $_GET["centerId"];
    //Validate permission
if (!AcknowledgementPermission::canViewForCenter(
    User::singleton()->userInfo["ID"],
    $centerId
)) {
    http_response_code(401);
    die();
}
    //fetch
    $result = AckCenterAffiliation::fetchAllOfCenter($centerId, null);
    //Validate/Process fetched
if (is_null($result)) {
    http_response_code(500);
    die();
}

    //Output
    die(
        json_encode(
            array("arr" => $result),
            JSON_PRETTY_PRINT
        )
    );
?>
