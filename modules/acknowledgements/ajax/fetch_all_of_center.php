<?php
/**
  * Fetch all acknowledgements of a center.
  *
  * @category acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    header("Content-Type: application/json");
    require_once(__DIR__ . "/../model/require_once.php");
    require_once(__DIR__ . "/validation.php");
    
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
    //Fetch and validate the rest of the input
    $full_name     = isset($_GET["full_name"])     ? $_GET["full_name"]     : null;
    $citation_name = isset($_GET["citation_name"]) ? $_GET["citation_name"] : null;
    $start_date    = isset($_GET["start_date"])    ? $_GET["start_date"]    : null;
    $end_date      = isset($_GET["end_date"])      ? $_GET["end_date"]      : null;
    
    if (!is_null($full_name)) {
        validate_string($full_name, "Full name", 0, 255);
    }
    if (!is_null($citation_name)) {
        validate_string($citation_name, "Citation name", 0, 255);
    }
    validate_start_end_date($start_date, $end_date);
    
    //Possible user-input to filtering mappings
    // + "1"  => WHERE present
    // + "0"  => WHERE NOT present
    // + ""   => WHERE present IS NULL //Also matches *any* other user-input-string
    // + null => WHERE TRUE //Does not bother filtering
    $filter_in_study_at_present = isset($_GET["in_study_at_present"]);
    $in_study_at_present        = null;
    if ($filter_in_study_at_present) {
        validate_string($_GET["in_study_at_present"], "Present", 0, 1);
        
        $in_study_at_present = $_GET["in_study_at_present"];
        if ($in_study_at_present === "1") {
            $in_study_at_present = true;
        } else if ($in_study_at_present === "0") {
            $in_study_at_present = false;
        } else {
            $in_study_at_present = null;
        }
    }
    //Fetch
    $result = Acknowledgement::FetchAllOfCenter($center_id, array(
        "full_name"     => $full_name,
        "citation_name" => $citation_name,
        "start_date"    => $start_date,
        "end_date"      => $end_date,
        "filter_in_study_at_present" => $filter_in_study_at_present,
        "in_study_at_present"        => $in_study_at_present
    ));
    //Validate/Process fetched
    if (is_null($result)) {
        http_response_code(500);
        die();
    }
    foreach ($result as $row) {
        if (!Acknowledgement::FetchDetails($row)) {
            http_response_code(500);
            die();
        }
    }
    
    //Output
    die(json_encode(array(
        "arr"=>$result
    ), JSON_PRETTY_PRINT));
?>