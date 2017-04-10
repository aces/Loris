<?php
    require_once(__DIR__ . "/validation.php");
    
    $full_name     = isset($_POST["full_name"])     ? $_POST["full_name"]     : "";
    $citation_name = isset($_POST["citation_name"]) ? $_POST["citation_name"] : "";
    $start_date    = isset($_POST["start_date"])    ? $_POST["start_date"]    : null;
    $end_date      = isset($_POST["end_date"])      ? $_POST["end_date"]      : null;
    
    $in_study_at_present = isset($_POST["in_study_at_present"]) ?
        ($_POST["in_study_at_present"] === "1") :
        null;
    
    $affiliation_arr = isset($_POST["affiliation_arr"])  ? $_POST["affiliation_arr"]  : array();
    $degree_arr      = isset($_POST["degree_arr"])       ? $_POST["degree_arr"]       : array();
    $role_arr        = isset($_POST["role_arr"])         ? $_POST["role_arr"]         : array();
    
    //Validate input
    validate_string($full_name, "Full name", 0, 255);
    validate_string($citation_name, "Citation name", 0, 255);
    
    validate_start_end_date($start_date, $end_date);
    
    validate_numeric_array($affiliation_arr, "Affiliations");
    validate_numeric_array($degree_arr, "Degrees");
    validate_numeric_array($role_arr, "Roles");
?>