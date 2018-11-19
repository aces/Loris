#!/usr/bin/env php
/** This script queries the database for plaintext passwords that were stored
 * in the `history` table. It creates a text file containing the hashed versions
 * of these plaintext passwords. This text file or "blacklist" will be analyzed
 * upon password changes. If a user tries to use a password that appears in the
 * list of hashes in this text file, it will be rejected.
 *
 * SQL:
 * - This script should be run AFTER 
 * `2018-10-22-CreatePasswordBlacklistTable.sql` OR
 * before upgrading to 20.1 from 20.0 OR 20.0.x to 21. This SQL file will
 * create the table containing the blacklist entries.
 *
 * - This script should be run BEFORE `2018-10-22-ExpireAllPasswords.sql` OR
 * before upgrading to 20.1 from 20.0 OR 20.0.x to 21. This SQL file will
 * delete the password entries which prevents the blacklist from being
 * generated.
 *
 * The plaintext passwords appeared due to a bug in LORIS. As these passwords
 * have potentially been viewed by administrators or could be read in the event
 * of a data breach, we have chosen to reject them in this way.
 */
<?php
require_once 'generic_includes.php';
sleep(5);

/* This script will write the password blacklist to a table in the DB. Fail if
 * the user has not applied the patch yet.
 */
try {
    $sql = "SELECT 1 FROM password_blacklist LIMIT 1;";
    $DB->pselectOne($sql, array());
} catch (\DatabaseException $e) {
    die(
        '`password_blacklist` table not found. Please run SQL patch ' .
        '`2018-10-22-CreatePasswordBlacklistTable.sql` or the appropriate ' .
        'release patch.' .
        PHP_EOL
    );
}

// Query DB for burned passwords. The bug caused passwords to be stored on 
// update so we'll limit the query to that. Additionally we will filter out
// results from the `new` data that are password hashes i.e. those that begin
// with the $ character.
$sql = "select new as password from history where col like '%hash%' AND type='U' AND new NOT LIKE '\$%';";
$result = $DB->pselectCol($sql, array());

// Hash all the passwords.
$password_hashes = array_map(
    'hash_password',
    array_values($result)
);
// Add hashes to blacklist table.
foreach ($password_hashes as $password_hash) {
    $DB->insert('password_blacklist', array('password_hash' => $password_hash));
}

// Function exists because array_map doesn't support multiple arguments.
function hash_password($password): string
{
    return password_hash($password, PASSWORD_DEFAULT);
}
