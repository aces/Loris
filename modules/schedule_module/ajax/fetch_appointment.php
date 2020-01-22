<?php
/**
 * This file is used by the Schedule Module to fetch a single appointment, given an AppointmentID
 *
 * PHP Version 5
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

require_once 'data_entry.php';

$user = User::singleton();
if (!$user->hasPermission('schedule_module')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$DB = Database::singleton();

// Check if appointment exists
$appointment = $DB->pselectRow(
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

if (empty($appointment)) {
    http_response_code(404);
    die(json_encode([
        "error" => "The Appointment does not exist."
    ]));
} else {
    echo json_encode($appointment);
}
?>
