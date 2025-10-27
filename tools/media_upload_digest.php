<?php declare(strict_types=1);

/**
 * This script is used to send out an email digest of
 * recent file uploads related to Media.
 * To run this script you need to supply two arguments;
 * the timespan and the amount of time.
 * These arguments are used to determine the start
 * date of the digest query.
 *
 *   Run php media_upload_digest.php [-days|-months|-years] [#] [-email (opt)]
 */
require_once 'generic_includes.php';

if (!isset($argv[1])
    || $argv[1] != '-years' && $argv[1] != '-months' && $argv[1] != '-days'
) {
    print "First argument must specify timespan either -years, -months, or -days\n";
    exit;
}
if ($argv[1] === '-years') {
    $timespan = 'year';
} else if ($argv[1] === '-months') {
    $timespan = 'month';
} else if ($argv[1] === '-days') {
    $timespan = 'days';
}

if (!isset($argv[2]) || !is_numeric($argv[2])) {
    print "Second argument must specify a number\n";
    exit;
} else {
    $num = $argv[2];
}

$send_emails = false;
if (isset($argv[3]) && $argv[3] === '-email') {
    $send_emails = true;
}

$startDate = date('Y-m-d H:i:s', strtotime("-$num $timespan"));

// Selects file information for files uploaded since the startDate
$allUploadedFiles = $DB->pselect(
    "SELECT PSCID, file_name, last_modified, uploaded_by, s.ProjectID, p.Alias
    FROM media m 
    JOIN session s ON (m.session_id=s.ID)
    JOIN candidate c ON (s.CandidateID=c.ID)
    JOIN Project p ON (s.ProjectID=p.ProjectID)
    WHERE hide_file <> 1 
    AND last_modified > :startDate",
    ['startDate' => $startDate]
);

//separate into an array with key as projectID and value as array of files
$filesByProject = [];
foreach ($allUploadedFiles as $entry) {
    if (!array_key_exists($entry['ProjectID'], $filesByProject)) {
        $filesByProject[$entry['ProjectID']] = [];
    }
    array_push($filesByProject[$entry['ProjectID']], $entry);
}

// Get the userIDs and emails of users who
// have notifications enabled for media uploads
$users_query = "
    SELECT DISTINCT u.email, u.ID
    FROM users u
    WHERE u.ID IN (
    SELECT unr.user_id
    FROM notification_modules nm
    JOIN users_notifications_rel unr ON unr.module_id = nm.id
    JOIN notification_services ns ON ns.id = unr.service_id
    WHERE nm.module_name = 'media'
        AND nm.operation_type = 'digest'
        AND ns.service = 'email_text'
    )
";

$users = $DB->pselectColWithIndexKey($users_query, [], 'ID');

if ($send_emails) {
    foreach ($users AS $userID => $email) {
        $userInfo           = getUserInfo($userID, $filesByProject, $DB, true);
        $userProjectAliases = $userInfo['userProjectAliases'];

        // send email to user
        if (!empty($userInfo['userFiles'])) {
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            Email::send(
                $email,
                'media_upload_digest.tpl',
                [
                    'entries'   => $userInfo['userFiles'],
                    'startDate' => $startDate,
                    'project'   => $userProjectAliases,
                    'count'     => count($userInfo['userFiles']),
                    'url'       => $baseURL
                ],
                '',
                '',
                '',
                '',
                'text/html'
            );
            print_r(
                "\nEmail notification sent to user
                $email for project(s) $userProjectAliases \n"
            );
        } else {
            print_r(
                "\nNo new files have been uploaded for project(s)" .
                " $userProjectAliases since: $startDate.\nUser" .
                " $email will not be notified.\n"
            );
        }
    }
} else {
    print_r(
        "\nEmails have not been sent. If you would like to send notifications to" .
        " the following users, re-run the script with \"-email.\"\n"
    );
    foreach ($users AS $userID => $email) {
        $userInfo           = getUserInfo($userID, $filesByProject, $DB, false);
        $userProjectAliases = $userInfo['userProjectAliases'];
        print_r(
            "\nUser $email will be notified for project(s): $userProjectAliases \n"
        );
    }
}

/**
 * Returns an array containing the user's files,
 * and the names of the projects the user is involved with.
 * If $getFiles is false, the user's files will not be returned.
 *
 * @param string $userID         the user's id
 * @param array  $filesByProject files as an array of each project
 * @param object $DB             database object
 * @param bool   $getFiles       a flag to sort out the user's files.
 *
 * @return array
 **/
function getUserInfo($userID, $filesByProject, $DB, $getFiles)
{
    $userProjects = $DB->pselectColWithIndexKey(
        "SELECT DISTINCT upr.ProjectID, p.Alias
        FROM user_project_rel upr
        JOIN Project p ON p.ProjectID = upr.ProjectID
        WHERE upr.UserID = :userID",
        ['userID' => $userID],
        'ProjectID'
    );

    $userFiles = [];
    if ($getFiles) {
        // get all files for the user's projects
        foreach ($userProjects as $projectID => $projectAlias) {
            if (array_key_exists($projectID, $filesByProject)) {
                $userFiles = array_merge($userFiles, $filesByProject[$projectID]);
            }
        }

        // sort files by last modified date
        usort(
            $userFiles,
            function ($a, $b) {
                return $a['last_modified'] <=> $b['last_modified'];
            }
        );
    }

    // Get the names of the projects as a string
    $userProjectAliases = preg_replace(
        '/,([^,]*)$/',
        ' and$1',
        implode(', ', $userProjects)
    );

    return [
        'userFiles'          => $userFiles,
        'userProjectAliases' => $userProjectAliases
    ];
}
