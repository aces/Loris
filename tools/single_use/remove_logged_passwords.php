<?php declare(strict_types=1);
error_reporting(E_ALL);
require_once __DIR__ . "/../generic_includes.php";
$info = <<<INFO
This script deletes occurrences of plaintext passwords that were stored in the
`history` table.

The plaintext passwords appeared due to a bug in LORIS. As these passwords
have potentially been viewed by administrators or could be read in the event
of a data breach, we have chosen to delete them from the history table.
Additionally, users with potentially exposed passwords will be forced to
change their passwords.


INFO;

echo $info;

// Query DB for burned passwords. The bug caused passwords to be stored on 
// update so we'll limit the query to that. Additionally we will filter out
// results from the `new` data that are password hashes i.e. those that begin
// with the $ character.
$sql = "select h.userID,
    h.changeDate,
    u.Email,
    u.Active 
    FROM history h
    INNER JOIN users u ON h.userID = u.UserID
    where h.col = 'Password_hash' 
    AND h.type='U' 
    AND h.new NOT LIKE '\$%';";
$result = $DB->pselect($sql, array());

// Reduce the result to one entry per user with the most recent date changed.
foreach($result as $row) {
    $compromised[$row['userID']] = array(
        'date' => $row['changeDate'],
        'email' => $row['Email'],
        'active' => $row['Active']
    );
}

// Set up output
$report = array();
$report[] = "The following users' passwords may have been exposed: ";
$entry = <<<REPORT
\tUsername: %s
\tEmail: %s
\tDate of Password Change: %s
\tActive? %s
REPORT;

// Add the user's details to the report for output to the user.
// Also, trigger a password reset for that user.
foreach($compromised as $username => $details) {
    $report[] = sprintf(
        $entry,
        $username,
        $details['email'],
        $details['date'],
        $details['active']
    );

    // password reset
    $DB->update(
        'users', 
        array('Password_expiry' => '1990-01-01'), 
        array('UserID' => $username)
    );
}

echo implode("\n", $report) . "\n\n";
echo "These users should be contacted and informed of the potential password "
    . "exposure and encouraged to change their passwords in other software if "
    . "their LORIS password is also used elsewhere.\n";

exit;

// Delete all passwords from history table.
$DB->delete(
    'history', array(
        'col' => 'Password_hash',
        'tbl' => 'users'
    )
);
$DB->delete(
    'history', array(
        'col' => 'Password_md5',
        'tbl' => 'users'
    )
);
