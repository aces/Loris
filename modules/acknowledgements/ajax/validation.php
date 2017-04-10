<?php
    require_once(__DIR__ . "/../model/require_once.php");
    
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
    function validate_start_end_date ($start_date, $end_date) {
        if (!Acknowledgement::IsValidStartToEndDate($start_date, $end_date)) {
            http_response_code(400);
            if (
                !is_null($start_date) &&
                !is_null($end_date) &&
                $end_date < $start_date
            ) {
                die(json_encode(array(
                    "error" => "End date must be at or after start date"
                )));
            }
            $range = Acknowledgement::FetchValidDateRange();
            if (!is_null($start_date)) {
                die(json_encode(array(
                    "error" => "Start date must be between {$range->start} and {$range->end}"
                )));
            }
            if (!is_null($end_date)) {
                die(json_encode(array(
                    "error" => "End date must be between {$range->start} and {$range->end}"
                )));
            }
            //I am only human, this ensures the script terminates, at least,
            //even if the message is cryptic.
            die(json_encode(array(
                "error" => "There was a problem with either your start or end date"
            )));
        }
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
?>