#!/usr/bin/env php
<?php
require_once 'generic_includes.php';

// Query DB for burned passwords. The bug caused passwords to be stored on 
// update so we'll limit the query to that. Additionally we will filter out
// results from the `new` data that are password hashes i.e. those that begin
// with the $ character.
$sql = "select new as password from history where col like '%hash%' AND type='U' AND new NOT LIKE '\$%';";
$result = $DB->pselect($sql, array());

$passwords = array();
foreach($result as $key => $value) {
    array_push($passwords, ($value['password']));
}

$base = \NDB_Config::singleton()->getSetting('paths')['base'];
$dest = "$base/project/password_blacklist.lst";
// Write result to file
file_put_contents(
    $dest,
    // Hash each password and join the result with new lines
    implode(
        "\n", 
        array_map(
            'hash_password',
            $passwords
        )
    ),
    FILE_APPEND
);

/* Function exists because array_map doesn't support multiple arguments */
function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}
?>
