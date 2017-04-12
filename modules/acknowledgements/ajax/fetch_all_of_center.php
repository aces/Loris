<?php
/**
  * Fetch all acknowledgements of a center.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
if (is_null($skip_header)) {
    header("Content-Type: application/json");
}
    require_once __DIR__ . "/../model/require_once.php";
    require_once __DIR__ . "/validation.php";

    //Validate request
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    http_response_code(405);
    die();
}
if (!isset($_GET["centerId"])
    || !is_string($_GET["centerId"])
    || !preg_match("/^\d+$/", $_GET["centerId"])
) {
    if (!$allow_center_null || isset($_GET["centerId"])) {
        http_response_code(404);
        die();
    }
}
    //Get input
    $centerId = $_GET["centerId"];
    //Validate permission
if (!$skip_permission_check && !AcknowledgementPermission::canViewForCenter(
    User::singleton()->userInfo["ID"],
    $centerId
)) {
    http_response_code(401);
    die();
}
    //fetch and validate the rest of the input
    $fullName     = isset($_GET["fullName"])     ? $_GET["fullName"]     : null;
    $citationName = isset($_GET["citationName"]) ? $_GET["citationName"] : null;
    $startDate    = isset($_GET["startDate"])    ? $_GET["startDate"]    : null;
    $endDate      = isset($_GET["endDate"])      ? $_GET["endDate"]      : null;

if (!is_null($fullName)) {
    Helper_validateString($fullName, "Full name", 0, 255);
}
if (!is_null($citationName)) {
    Helper_validateString($citationName, "Citation name", 0, 255);
}
    Helper_validateStartEndDate($startDate, $endDate);

    //Possible user-input to filtering mappings
    // + "1"  => WHERE present
    // + "0"  => WHERE NOT present
    // + ""   => WHERE present IS NULL //Also matches *any* other user-input-string
    // + null => WHERE TRUE //Does not bother filtering
    $filter_inStudyAtPresent = isset($_GET["inStudyAtPresent"]);
    $inStudyAtPresent        = null;
if ($filter_inStudyAtPresent) {
    Helper_validateString($_GET["inStudyAtPresent"], "Present", 0, 1);

    $inStudyAtPresent = $_GET["inStudyAtPresent"];
    if ($inStudyAtPresent === "1") {
        $inStudyAtPresent = true;
    } else if ($inStudyAtPresent === "0") {
        $inStudyAtPresent = false;
    } else {
        $inStudyAtPresent = null;
    }
}
    //fetch
    $result = Acknowledgement::fetchAllOfCenter(
        $centerId,
        array(
         "fullName"                => $fullName,
         "citationName"            => $citationName,
         "startDate"               => $startDate,
         "endDate"                 => $endDate,
         "filter_inStudyAtPresent" => $filter_inStudyAtPresent,
         "inStudyAtPresent"        => $inStudyAtPresent,
        )
    );
    //Validate/Process fetched
    if (is_null($result)) {
        http_response_code(500);
        die();
    }
    foreach ($result as $row) {
        if (!Acknowledgement::fetchDetails($row)) {
            http_response_code(500);
            die();
        }
    }

    //Output
    die(
        json_encode(
            array("arr" => $result),
            JSON_PRETTY_PRINT
        )
    );
?>
