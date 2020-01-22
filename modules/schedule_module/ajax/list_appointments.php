<?php
/**
 * This file is used by the Schedule Module to list all appointments, and for filtering (selection, tabs)
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

$conditions = array("TRUE");

$queryValues = array();

// Filter by Visit label
if (isset($_GET["VisitLabel"])) {

    // Check for valid visit label
    $visit = $DB->pselectRow(
        "
            SELECT
                *
            FROM
                Visit_Windows
            WHERE
                Visit_label = :visitLabel
        ",
        array("visitLabel" => $_GET["VisitLabel"])
    );

    if (empty($visit)) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Visit label."
        ]));
    }

    // If filtering for visit label, add boolean
    array_push($conditions, "Visit_label = :visitLabel");

    $queryValues["visitLabel"] = $_GET["VisitLabel"];
}

// Filter by dataEntryStatus
if (isset($_GET["dataEntryStatus"])) {

    array_push($conditions, "{$dataEntryStatusExpression} = :dataEntryStatus");

    $queryValues["dataEntryStatus"] = $_GET["dataEntryStatus"];
}

// Filter by Site (Center ID)
if (isset($_GET["CenterID"])) {

    // Check for valid site
    $site = $DB->pselectRow(
        "
            SELECT
                *
            FROM
                psc
            WHERE
                CenterID = :centerId
        ",
        array("centerId" => $_GET["CenterID"])
    );

    if (empty($site)) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Site."
        ]));
    }

    // If filtering for site, add boolean
    array_push($conditions, "CenterID = :centerId");

    $queryValues["centerId"] = $_GET["CenterID"];
}

// Filter by Appointment Type
if (isset($_GET["AppointmentTypeID"])) {

    // Check for valid appointment type
    $appt_type = $DB->pselectRow(
        "
            SELECT
                *
            FROM
                appointment_type
            WHERE
                AppointmentTypeID = :appointmentTypeId
        ",
        array("appointmentTypeId" => $_GET["AppointmentTypeID"])
    );

    if (empty($appt_type)) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Appointment Type."
        ]));
    }

    array_push($conditions, "AppointmentTypeID = :appointmentTypeId");

    $queryValues["appointmentTypeId"] = $_GET["AppointmentTypeID"];
}

// Filter by DCCID
if (isset($_GET["CandID"])) {

    array_push($conditions, "CandID = :candId");

    $queryValues["candId"] = $_GET["CandID"];
}

// Filter by PSCID
if (isset($_GET["PSCID"])) {

    array_push($conditions, "PSCID = :pscId");

    $queryValues["pscId"] = $_GET["PSCID"];
}

// Filter by Datetime
if (isset($_GET["StartsAt"])) {

    if (!isDateValid($_GET["StartsAt"])) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Appointment Date and/or Time."
        ]));
    }

    array_push($conditions, "StartsAt = :startsAt");

    $queryValues["startsAt"] = $_GET["StartsAt"];
}

// Filter by Date
if (isset($_GET["StartDate"])) {

    if (!isDateValid($_GET["StartDate"], 'Y-m-d')) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Appointment Date."
        ]));
    }

    array_push($conditions, "StartsAt >= :startsAtMin");
    array_push($conditions, "StartsAt < :startsAtMax");

    $startsAtMin = $_GET["StartDate"] . " 00:00:00";
    $startsAtMax = date(
        "Y-m-d",
        strtotime(
            "+1 day",
            strtotime($startsAtMin)
        )
    );
    $queryValues["startsAtMin"] = $startsAtMin;
    $queryValues["startsAtMax"] = $startsAtMax;
}

// Filter by Time
if (isset($_GET["StartTime"])) {

    if (!isDateValid($_GET["StartTime"], 'H:i')) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Appointment Time."
        ]));
    }

    array_push($conditions, "TIME(StartsAt) >= :startsAtTimeMin");
    array_push($conditions, "(
        :startsAtTimeMin = '23:59:00' OR
        TIME(StartsAt) < :startsAtTimeMax
    )");

    $startsAtTimeMin = $_GET["StartTime"] . ":00";
    $startsAtTimeMax = date(
        "H:i:s",
        strtotime(
            "+1 minute",
            strtotime($startsAtTimeMin)
        )
    );
    $queryValues["startsAtTimeMin"] = $startsAtTimeMin;
    $queryValues["startsAtTimeMax"] = $startsAtTimeMax;
}

// List appointments that occur on or after StartDateMin
if (isset($_GET["StartDateMin"])) {

    if (!isDateValid($_GET["StartDateMin"], 'Y-m-d')) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Minimum Start Date."
        ]));
    }

    array_push($conditions, "StartsAt >= :startsAtMin");

    $startsAtMin = $_GET["StartDateMin"] . " 00:00:00";

    $queryValues["startsAtMin"] = $startsAtMin;
}

// List appointments that occur on or before StartDateMax
if (isset($_GET["StartDateMax"])) {

    if (!isDateValid($_GET["StartDateMax"], 'Y-m-d')) {
        http_response_code(400);
        die(json_encode([
            "error" => "Invalid Maximum Start Date."
        ]));
    }

    array_push($conditions, "StartsAt < :startsAtMax");

    $startsAtMax = date(
        "Y-m-d",
        strtotime(
            "+1 day",
            strtotime($_GET["StartDateMax"] . " 00:00:00")
        )
    );

    $queryValues["startsAtMax"] = $startsAtMax;
}

// Filter by Project
if (isset($_GET["ProjectID"])) {
    $arr = $_GET["ProjectID"];
    if (!is_array($arr)) {
        $arr = [$arr];
    }

    if (count($arr) == 0) {
        $arr = [-1];
    }

    $projectIdList = implode(
        ",",
        array_map(
            function ($v) {
                global $DB;
                return $DB->quote($v);
            },
            $arr
        )
    );

    array_push($conditions, "ProjectID IN({$projectIdList})");
}

// Filter by Subproject
if (isset($_GET["SubprojectID"])) {
    $arr = $_GET["SubprojectID"];
    if (!is_array($arr)) {
        $arr = [$arr];
    }

    if (count($arr) == 0) {
        $arr = [-1];
    }

    $subprojectIdList = implode(
        ",",
        array_map(
            function ($v) {
                global $DB;
                return $DB->quote($v);
            },
            $arr
        )
    );

    array_push($conditions, "SubprojectID IN({$subprojectIdList})");
}

// Join the conditions
$conditionStr = join(" AND ", $conditions);

$page = isset($_GET["page"]) ? intval($_GET["page"]) : 0;
if ($page < 0) {
    $page = 0;
}
$itemsPerPage = isset($_GET["itemsPerPage"]) ? intval($_GET["itemsPerPage"]) : 20;
if ($itemsPerPage < 1) {
    $itemsPerPage = 1;
}

$start = $page * $itemsPerPage;
$count = $itemsPerPage;

$sortOrder = isset($_GET["sortOrder"]) ? strtoupper($_GET["sortOrder"]) : "ASC";
if ($sortOrder != "ASC" && $sortOrder != "DESC") {
    $sortOrder = "ASC";
}

$sortColumn = isset($_GET["sortColumn"]) ? $_GET["sortColumn"] : "PSCID";

$columns = [
    "PSCID",
    "CandID",
    "Visit_label",
    "CenterID",
    "title",
    "StartsAt",
    "AppointmentTypeName",
    "Name",
    "dataEntryStatus",
];

if (!in_array($sortColumn, $columns)) {
    $sortColumn = "PSCID";
}

// Selects all appointments if not filtering, selects all appointments
$subQueryBody = "
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
JOIN
    psc
ON
    session.CenterID = psc.CenterID
";
$subQuery = "
SELECT
    appointment.AppointmentID,
    appointment.SessionID,
    appointment.AppointmentTypeID,
    appointment.StartsAt,
    candidate.PSCID,
    session.CandID,
    session.Visit_label,
    session.CenterID,
    session.SubprojectID,
    candidate.RegistrationProjectID,
    subproject.title,
    (NOW() > appointment.StartsAt) AS started,
    appointment_type.Name AS AppointmentTypeName,
    psc.Name,
    {$dataEntryColumns}
{$subQueryBody}
";
$appointments = $DB->pselect(
    "
        SELECT
            *,
            {$dataEntryStatusExpression} AS dataEntryStatus
        FROM
            ({$subQuery}) AS subQuery
        WHERE
            {$conditionStr}
        ORDER BY
            {$sortColumn} {$sortOrder},
            PSCID ASC,
            StartsAt DESC,
            Visit_label ASC
        LIMIT
            {$start}, {$count}
    ",
    $queryValues
);

$itemsFound = $DB->pselectOne(
    "
        SELECT
            COUNT(*)
        FROM
            ({$subQuery}) AS subQuery
        WHERE
            {$conditionStr}
    ",
    $queryValues
);

echo json_encode([
    "data" => $appointments,
    "meta" => [
        "page" => $page,
        "itemsPerPage" => $itemsPerPage,
        "itemsFound" => $itemsFound,
        "pagesFound" => floor($itemsFound / $itemsPerPage) + (
            ($itemsFound % $itemsPerPage == 0) ?
                0 :
                1
        )
    ]
]);
?>
