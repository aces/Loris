<?php
/**
  * Helper validation functions for AJAX endpoints.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    require_once __DIR__ . "/../model/require_once.php";

/**
 * This function was made because PHPCS keeps complaining about
 * Strings being too long...
 * Spits out a JSON error message
 *
 * @param int    $code The http response code
 * @param string $str  The error message
 *
 * @return void
 */
function Helper_error($code, $str)
{
    http_response_code($code);
    die(
        json_encode(
            array("error" => $str)
        )
    );
}
/**
 * Validates a string's min and max length
 *
 * @param string $var        The variable to check
 * @param string $name       The name of the variable to display to the user
 * @param int    $min_length The minimum length
 * @param int    $max_length The maximum length
 *
 * @return void
 */
function Helper_validateString($var, $name, $min_length, $max_length)
{
    if (!is_string($var)) {
        Helper_error(400, "{$name} has to be a string");
    }
    if (strlen($var) < $min_length) {
        Helper_error(400, "{$name} must have {$min_length} characters, at least");
    }
    if (strlen($var) > $max_length) {
        Helper_error(400, "{$name} must have {$max_length} characters, at most");
    }
}
/**
 * Validates a start and end date
 *
 * @param string $start_date The start date
 * @param string $end_date   The end date
 *
 * @return void
 */
function Helper_validateStartEndDate($start_date, $end_date)
{
    if (!Acknowledgement::isValidStartToEndDate($start_date, $end_date)) {
        if (!is_null($start_date)
            && !is_null($end_date)
            && $end_date < $start_date
        ) {
            Helper_error(400, "End date must be at or after start date");
        }
        $range = Acknowledgement::fetchValidDateRange();
        if (!is_null($start_date)) {
            Helper_error(
                400,
                "Start date must be between {$range->start} and {$range->end}"
            );
        }
        if (!is_null($end_date)) {
            Helper_error(
                400,
                "End date must be between {$range->start} and {$range->end}"
            );
        }
        //I am only human, this ensures the script terminates, at least,
        //even if the message is cryptic.
        Helper_error(400, "There was a problem with either your start or end date");
    }
}
/**
 * Validates an array, checking if all elements are numeric
 *
 * @param string $arr  The array to check
 * @param string $name The name of the variable to display to the user
 *
 * @return void
 */
function Helper_validateNumericArray($arr, $name)
{
    if (!is_array($arr)) {
        Helper_error(400, "{$name} be an array");
    }
    foreach ($arr as $raw) {
        if (!is_string($raw) || !preg_match("/^\d+$/", $raw)) {
            Helper_error(400, "{$name} must have valid elements");
        }
    }
}
?>
