<?php
require_once __DIR__ . "/../generic_includes.php";
$info = <<<INFO
This script deletes occurrences of plaintext passwords that were stored in the
`history` table.

This script will also expire all current passwords for LORIS users. 

The plaintext passwords appeared due to a bug in LORIS. As these passwords
have potentially been viewed by administrators or could be read in the event
of a data breach, we have chosen to reject them in this way.

INFO;

echo $info;

// Query DB for burned passwords. The bug caused passwords to be stored on 
// update so we'll limit the query to that. Additionally we will filter out
// results from the `new` data that are password hashes i.e. those that begin
// with the $ character.
$sql = "select new as password from history where col = 'Password_hash' AND type='U' AND new NOT LIKE '\$%';";
$result = $DB->pselectCol($sql, array());

// Expire all passwords. Must first fetch all user IDs from database as the
// LORIS DB update function requires a WHERE statement.
$result = $DB->pselectCol('select ID from users where ID > 0', array());
foreach ($result as $id) {
    $DB->update(
        'users', 
        array('Password_expiry' => '1990-01-01'), 
        array('ID' => $id)
    );
}

// Delete passwords from history table
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
