#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This tool verifies that the data contained in the LORIS database is well-formed
 * and contains no major issues. For example, it checks that tables referenced
 * in one part of the database exist elsewhere.
 */
require_once 'generic_includes.php';

$helper = new OutputWrapper();

// Verifies that instruments registered in the test_names table have
// corresponding per-instrument tables containing the data.
$instrument_arr = $DB->pselectCol("SELECT Test_name FROM test_names", []);
$check_arr      = [];

$helper->printSuccess('Getting data from `test_names` table...');
$instruments       = array_filter(
    $instrument_arr,
    [$DB, 'tableExists']
);
$numberOfTestNames = count($instrument_arr);
$numberOfTestNamesWithTables = count($instruments);

$helper->printSuccess("Looking for orphaned instrument/flag");
foreach ($instruments as $instrument) {
    $helper->printLine("Checking instrument `$instrument`...");

    $orphan_flag_arr = $DB->pselect(
        "
        SELECT
            flag.*
        FROM
            flag
        LEFT JOIN
            {$instrument}
        ON
            {$instrument}.CommentID = flag.CommentID
        WHERE
            Test_name = :instrument AND
            {$instrument}.CommentID IS NULL
    ",
        [
            "instrument" => $instrument
        ]
    );

    $flag_str = $instrument . " flag";
    foreach ($orphan_flag_arr as $orphan_flag) {
        $comment_id = $orphan_flag["CommentID"];
        $helper->printWarning("orphan flag {$flag_str}:{$comment_id}");
    }
    $orphan_instrument_arr = $DB->pselect(
        "
        SELECT
            {$instrument}.*
        FROM
            {$instrument}
        LEFT JOIN
            flag
        ON
            {$instrument}.CommentID = flag.CommentID
        WHERE
            flag.CommentID IS NULL
    ",
        []
    );

    foreach ($orphan_instrument_arr as $orphan_instrument) {
        $comment_id = $orphan_instrument["CommentID"];
        $helper->printWarning("orphan instrument {$instrument}:{$comment_id}");
    }
}

$helper->printSuccess("Checking for duplicate flags in a session");
$duplicate_flag_arr = $DB->pselect(
    "
    SELECT
        SessionID,Test_name,CommentID
    FROM
        flag
    WHERE
        (
            flag.CommentID NOT LIKE 'DDE_%' AND
            (
                SELECT
                    COUNT(*)
                FROM
                    flag test
                WHERE
                    test.CommentID NOT LIKE 'DDE_%' AND
                    flag.SessionID = test.SessionID AND
                    flag.Test_name = test.Test_name
            ) > 1
        ) OR
        (
            flag.CommentID LIKE 'DDE_%' AND
            (
                SELECT
                    COUNT(*)
                FROM
                    flag test
                WHERE
                    test.CommentID LIKE 'DDE_%' AND
                    flag.SessionID = test.SessionID AND
                    flag.Test_name = test.Test_name
            ) > 1
        )
",
    []
);
foreach ($duplicate_flag_arr as $duplicate_flag) {
    $helper->printError(
        sprintf(
            "Duplicate flag. SessionID: `%s`. Test Name: `%s`. CommentID: `%s`",
            $duplicate_flag["SessionID"],
            $duplicate_flag["Test_name"],
            $duplicate_flag["CommentID"]
        )
    );
}
