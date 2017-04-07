<?php
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
    function validate_string($var, $name, $min_length, $max_length) {
        if (!is_string($var)) {
            http_response_code(400);
            die(json_encode(array(
                "error" => "{$name} has to be a string"
            )));
        }
        if (strlen($var) < $min_length) {
            http_response_code(400);
            die(json_encode(array(
                "error" => "{$name} must have {$min_length} characters, at least"
            )));
        }
        if (strlen($var) > $max_length) {
            http_response_code(400);
            die(json_encode(array(
                "error" => "{$name} must have {$max_length} characters, at most"
            )));
        }
    }
    validate_string($full_name, "Full name", 0, 255);
    validate_string($citation_name, "Citation name", 0, 255);
    
    if (!Acknowledgement::IsValidStartToEndDate($start_date, $end_date)) {
        http_response_code(400);
        die(json_encode(array(
            "error" => "Start date is required. End date, if filled, must be at or after start date."
        )));
    }
    
    function validate_numeric_array($arr, $name) {
        if (!is_array($arr)) {
            http_response_code(400);
            die(json_encode(array(
                "error" => "{$name} be an array"
            )));
        }
        foreach ($arr as $raw) {
            if (!is_string($raw) || !preg_match("/^\d+$/", $raw)) {
                http_response_code(400);
                die(json_encode(array(
                    "error" => "{$name} must have valid elements"
                )));
            }
        }
    }
    validate_numeric_array($affiliation_arr, "Affiliations");
    validate_numeric_array($degree_arr, "Degrees");
    validate_numeric_array($role_arr, "Roles");
?>