#!/usr/bin/env php
<?php declare(strict_types=1);
require_once __DIR__ . "/../generic_includes.php";

echo
"\nThis script deletes duplicate rows in publication_users_edit_perm_rel
to make sure the patch '2020-01-07-publication_users_edit_perm_rel_pk.sql'
will execute successfully.\n\n";

echo "Searching for duplicates...\n\n";

$query = "SELECT *, COUNT(*) as Count
FROM publication_users_edit_perm_rel
GROUP BY
    PublicationID,
    UserID
HAVING
    (COUNT(PublicationID) > 1) AND
    (COUNT(UserID) > 1);";

$result = $DB->pselect($query, []);

if (count($result) > 0) {
    echo "Deleting duplicates: \n";
} else {
    echo "No duplicate found. \n";
}

foreach ($result as $row) {
    foreach ($row as $key => $value) {
        echo $key . ':' . $value . '    ';
    }

    $query = "DELETE
        FROM publication_users_edit_perm_rel
        WHERE PublicationID = $row[PublicationID]
        AND UserID = $row[UserID]
        LIMIT " . ($row['Count'] - 1) . ";";

    $DB->run($query);

    echo "\n";
}

echo "\nYou can now apply the patch
'2020-01-07-publication_users_edit_perm_rel_pk.sql'\n";
