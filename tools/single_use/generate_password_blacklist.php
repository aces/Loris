<?php
require_once __DIR__ . "/../generic_includes.php";
$info = <<<INFO
This script queries the database for plaintext passwords that were stored
in the `history` table. It inserts hashed versions of these passwords into
a table in the database. This "blacklist" will be analyzed
upon password changes. If a user tries to use a password that appears in the
list of hashes, it will be rejected.

This script will also expire all current passwords for LORIS users so that
exposed passwords cannot be used again.

Instructions:
- Run `2018-10-22-CreatePasswordBlacklistTable.sql`. This SQL file will
create the table containing the blacklist entries.
- Run this script to populate the table with the plaintext passwords in 
the `history` table.

The plaintext passwords appeared due to a bug in LORIS. As these passwords
have potentially been viewed by administrators or could be read in the event
of a data breach, we have chosen to reject them in this way.



INFO;

echo $info;
$answers = array('y', 'N');
$defaultAnswer = 'N';
echo writeQuestion('Continue?', $answers);
if (readAnswer($answers, $defaultAnswer) !== 'y') {
    exit;
}

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
$sql = "select new as password from history where col = 'Password_hash' AND type='U' AND new NOT LIKE '\$%';";
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

// Function exists because array_map doesn't support multiple arguments.
function hash_password($password): string
{
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Prompts a user with a question and acceptable responses.
 *
 * @param string $question Prompt to display to user
 * @param array  $answers  List of acceptable answers to prompt
 *
 * @return void
 */
function writeQuestion($question, $answers) : void
{
    echo $question . ' (' . implode('/', $answers) . '): ' . PHP_EOL;
}
/**
 * Gets user input from STDIN and checks if it matches a valye in
 * $possibleAnswers.  If not, the default answer is used.  Inteded to follow
 * function writeQuestion
 *
 * @param array $possibleAnswers Possible answers to a prompt
 * @param array $defaultAnswer   Response if user entered invalid response
 *
 * @return string The user input representing their answer or the default answer
 */
function readAnswer($possibleAnswers, $defaultAnswer) : string
{
    $in     = fopen('php://stdin', 'rw+');
    $answer = trim(fgets($in));
    if (!in_array($answer, $possibleAnswers, true)) {
        return $defaultAnswer;
    }
    return $answer;
}
