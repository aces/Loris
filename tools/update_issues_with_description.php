#!/usr/bin/php
<?php
/**
 * The script update_issues_with_description.php copies the first comment
 * by timestamp (dateAdded) in issues_comments table to the description
 * field of the issues table matching based on the issueID
 *
 * Usage: php update_issues_with_description.php
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/generic_includes.php";

set_include_path(
    get_include_path().":".
    __DIR__."/../project/libraries:".
    __DIR__."/../php/libraries:"
);

require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB = \NDB_Factory::singleton()->database();

$allIssueIDsWithComments = $DB->pselectCol(
    "SELECT issueID FROM issues_comments",
    []
);

foreach ($allIssueIDsWithComments as $issueID) {
    $existingDescription = $DB->pselectOne(
        "SELECT `description` FROM issues WHERE issueID=:issue_id",
        ["issue_id" => $issueID]
    );
    if (!$existingDescription) {
        $comments    = $DB->pselect(
            "SELECT issueComment
            FROM issues_comments ic
            WHERE ic.issueID = :issue_id
            ORDER BY ic.dateAdded ASC
            LIMIT 1",
            ['issue_id' => $issueID]
        );
        $description = $comments ? $comments[0]['issueComment'] : null;
        if ($description !== null) {
            $DB->update(
                "issues",
                ["description" => $description],
                ["issueID" => $issueID]
            );
        }
    }
}

echo "\n Description field migration completed\n";
