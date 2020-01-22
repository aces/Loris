<?php
/**
 * This file is used by the Schedule Module to delete an existing appointment
 *
 * PHP Version 5
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

$user = User::singleton();
if (!$user->hasPermission('schedule_module')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$DB = Database::singleton();

// Get appointment by its ID, if exists
$DB->delete(
    "appointment",
    array(
     "AppointmentID" => $_GET["AppointmentID"],
    )
);

if ($DB->getAffected() != 1) {
    http_response_code(404);
    die(json_encode([
        "error" => "Appointment does not exist."
    ]));
} else {
    http_response_code(204);
}
?>
