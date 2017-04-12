<?php
/**
  * Validates some post data.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    require_once __DIR__ . "/validation.php";

    $full_name     = isset($_POST["full_name"])     ? $_POST["full_name"]     : "";
    $citation_name = isset($_POST["citation_name"]) ? $_POST["citation_name"] : "";
    $start_date    = isset($_POST["start_date"])    ? $_POST["start_date"]    : null;
    $end_date      = isset($_POST["end_date"])      ? $_POST["end_date"]      : null;

    $in_study_at_present = isset($_POST["in_study_at_present"]) ?
        ($_POST["in_study_at_present"] === "1") :
        null;

    $affiliation_arr = isset($_POST["affiliation_arr"]) ?
        $_POST["affiliation_arr"] : array();
    $degree_arr      = isset($_POST["degree_arr"])
        ? $_POST["degree_arr"] : array();
    $role_arr        = isset($_POST["role_arr"]) ?
        $_POST["role_arr"] : array();

    //Validate input
    Helper_validateString($full_name, "Full name", 0, 255);
    Helper_validateString($citation_name, "Citation name", 0, 255);

    Helper_validateStartEndDate($start_date, $end_date);

    Helper_validateNumericArray($affiliation_arr, "Affiliations");
    Helper_validateNumericArray($degree_arr, "Degrees");
    Helper_validateNumericArray($role_arr, "Roles");
?>