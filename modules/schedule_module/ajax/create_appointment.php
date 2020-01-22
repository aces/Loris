<?php
/**
 * This file is used by the Schedule Module to create a new appointment
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

$DB = Database::singleton();

$emptyFields = [];

foreach ([
    "SessionID" => "Session ID",
    "StartsAt" => "Appointment Date/Time",
    "AppointmentTypeID" => "Appointment Type",

] as $key => $humanReadableKey) {
    if (!isset($_POST[$key]) || strlen($_POST[$key]) == 0) {
        array_push(
            $emptyFields,
            $humanReadableKey
        );
    }
}

if (count($emptyFields) == 1) {
    http_response_code(400);
    die(json_encode([
        "error" => "The following field is empty: " . $emptyFields[0]
    ]));
}

if (count($emptyFields) > 0) {
    http_response_code(400);
    die(json_encode([
        "error" => "The following fields are empty: " . implode(
            $emptyFields,
            ", "
        )
    ]));
}

// Check if session exists
$session = $DB->pselectRow(
    "
        SELECT 
            * 
        FROM 
            session
        WHERE 
            ID = :sessionId
    ",
    array(
        "sessionId" => $_POST["SessionID"],
    )
);

if (empty($session)) {
    http_response_code(400);
    die(json_encode([
        "error" => "Session does not exist."
    ]));
}

// Check if Appointment Type is valid/exists
$appointment_type = $DB->pselectRow(
    "
        SELECT 
            * 
        FROM 
            appointment_type 
        WHERE 
            AppointmentTypeID = :appointmentTypeId
    ",
    array("appointmentTypeId" => $_POST["AppointmentTypeID"])
);

if (empty($appointment_type)) {
    http_response_code(400);
    die(json_encode([
        "error" => "Appointment Type does not exist."
    ]));
}

// Checks that Date and Time are valid
if (!isDateValid($_POST["StartsAt"])) {
    http_response_code(400);
    die(json_encode([
        "error" => "Appointment Date and/or Time is invalid."
    ]));
}

// Check db for exact same appointment
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
        "sessionId" => $_POST["SessionID"],
        "appointmentTypeId" => $_POST["AppointmentTypeID"],
        "startsAt" => $_POST["StartsAt"],
        )
);

if (!empty($duplicate_check)) {
    http_response_code(400);
    die(json_encode([
        "error" => "This appointment already exists."
    ]));
}

// Insert appointment information
$DB->insert(
    "appointment",
    array(
        "SessionId" => $_POST["SessionID"],
        "AppointmentTypeId" => $_POST["AppointmentTypeID"],
        "StartsAt" => $_POST["StartsAt"],     
    )
);
// Get the most recent appointment
$newest_appointment = $DB->pselectRow(
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
        "appointmentId" => $DB->getLastInsertId(),
    )
);
// This should not ever happen
if (empty($newest_appointment)) {
    http_response_code(500);
    die(json_encode([
        "error" => "Appointment was created but could not be fetched."
    ]));
} else {
    echo json_encode($newest_appointment);
}
?>
