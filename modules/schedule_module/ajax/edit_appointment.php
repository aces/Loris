<?php
/**
 * This file is used by the Schedule Module to edit an already existing appointment
 *
 * PHP Version 5
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

require_once 'validator.php';
require_once 'data_entry.php';

$user = User::singleton();
if (!$user->hasPermission('schedule_module')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$_PUT = [];
parse_str(file_get_contents('php://input', 'r'), $_PUT);

$DB = Database::singleton();

$appointment = $DB->pselectRow(
    "SELECT * FROM appointment
    WHERE AppointmentID = :appointmentId",
    array(
     "appointmentId" => $_GET["AppointmentID"],
    )
);

if (empty($appointment)) {
    http_response_code(404);
    die(json_encode([
        "error" => "Appointment does not exist."
    ]));
}

// If user wants to change value, set new value 
// If user doesn't make a change to a column, don't change the value
$appointment["StartsAt"]          = isset($_PUT["StartsAt"]) ?
    $_PUT["StartsAt"] : 
    $appointment["StartsAt"];

$appointment["AppointmentTypeID"] = isset($_PUT["AppointmentTypeID"]) ?
    $_PUT["AppointmentTypeID"] :
    $appointment["AppointmentTypeID"];

// Check that date/time is valid
if (!isDateValid($appointment["StartsAt"])) {
    http_response_code(400);
    die(json_encode([
        "error" => "Appointment Date and/or Time is invalid"
    ]));
}

// Check if Appointment Type is valid/exists
$appointment_type = $DB->pselectRow(
    "SELECT * FROM appointment_type 
    WHERE AppointmentTypeID = :appointmentTypeId",
    array("appointmentTypeId" => $_PUT["AppointmentTypeID"])
);

if (empty($appointment_type)) {
    http_response_code(400);
    die(json_encode([
        "error" => "Please choose a valid Appointment type."
    ]));
}

$duplicate_check = $DB->pselectRow(
    "
        SELECT 
            * 
        FROM 
            appointment 
        WHERE 
            SessionID = :sessionId
        AND 
            AppointmentTypeID = :appointmentTypeId
        AND 
            StartsAt = :startsAt
    ",
    array(
        "sessionId" => $_appointment["SessionID"],
        "appointmentTypeId" => $_PUT["AppointmentTypeID"],
        "startsAt" => $_PUT["StartsAt"],
        )
);

if (!empty($duplicate_check)) {
    http_response_code(400);
    die(json_encode([
        "error" => "This appointment already exists."
    ]));
}

// Update appointment information
$DB->update(
    "appointment",
    array(
     "StartsAt"    => $appointment["StartsAt"],
     "AppointmentTypeID" => $appointment["AppointmentTypeID"],
    ),
    array(
     "AppointmentId" => $_GET["AppointmentID"],
    )
);


$edit_appointment = $DB->pselectRow(
    "
        SELECT
            appointment.*,
            candidate.PSCID,
            session.CandID,
            session.Visit_label,
            session.CenterID,
            subproject.title,
            (NOW() > appointment.StartsAt) AS started,
            {$dataEntryColumns}
        FROM
            appointment
        JOIN
            appointment_type
        ON
            appointment_type.AppointmentTypeID = appointment.AppointmentTypeID
        JOIN 
            session 
        ON 
            appointment.SessionID = session.ID
        JOIN
            candidate
        ON 
            session.CandID = candidate.CandID
        JOIN
            subproject
        ON
            session.SubprojectID = subproject.SubprojectID
        WHERE
            AppointmentID = :appointmentId
    ",
    array(
     "appointmentId" => $_GET["AppointmentID"],
    )
);

if (empty($edit_appointment)) {
    http_response_code(500);
    die(json_encode([
        "error" => "Updated appointment but could not fetch it."
    ]));
} else {
    echo json_encode($edit_appointment);
}
?>
