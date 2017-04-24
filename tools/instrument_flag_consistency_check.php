<?php
    function pad_or_trunc ($str, $len) {
        if (strlen($str) > $len) {
            return substr($str, 0, $len-1) . ".";
        } else if (strlen($str) == $len) {
            return $str;
        } else {
            return str_pad($str, $len);
        }
    }
    
    require_once __DIR__ . "/../vendor/autoload.php";
    $client = new NDB_Client();
    $client->makeCommandLine();
    $client->initialize(__DIR__ . "/../project/config.xml");
    $DB = Database::singleton();
    
    $instrument_arr = $DB->pselect("
        SELECT
            Test_name
        FROM
            test_names
    ", array());
    
    $check_arr = array();
    echo "\n== Checking if instrument tables exist ==\n";
    foreach ($instrument_arr as $instrument) {
        $name = $instrument["Test_name"];
        $exists = $DB->tableExists($name);
        echo ($exists ?
            "(true)  - " :
            "(false) - "
        );
        echo "{$name}\n";
        
        if ($exists) {
            $check_arr[] = $name;
        }
    }
    
    echo "\n== Checking for orphaned instrument/flag ==\n";
    foreach ($check_arr as $check) {
        echo "Checking {$check}...\n";
        
        $orphan_flag_arr = $DB->pselect("
            SELECT
                flag.*
            FROM
                flag
            LEFT JOIN
                {$check}
            ON
                {$check}.CommentID = flag.CommentID
            WHERE
                Test_name = :check AND
                {$check}.CommentID IS NULL
        ", array(
            "check" => $check
        ));
        
        $flag_str = pad_or_trunc($check, 5) . " flag";
        foreach ($orphan_flag_arr as $orphan_flag) {
            $comment_id = $orphan_flag["CommentID"];
            echo "Warning, orphan {$flag_str}:{$comment_id}\n";
        }
        $orphan_instrument_arr = $DB->pselect("
            SELECT
                {$check}.*
            FROM
                {$check}
            LEFT JOIN
                flag
            ON
                {$check}.CommentID = flag.CommentID
            WHERE
                flag.CommentID IS NULL
        ", array());
        
        $check_str = pad_or_trunc($check, 10);
        foreach ($orphan_instrument_arr as $orphan_instrument) {
            $comment_id = $orphan_instrument["CommentID"];
            echo "Warning, orphan {$check_str}:{$comment_id}\n";
        }
        
        echo "Finished checking {$check}...\n\n";
    }
    
    echo "\n== Checking for duplicate flags in a session ==\n";
    $duplicate_flag_arr = $DB->pselect("
        SELECT
            *
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
    ", array());
    foreach ($duplicate_flag_arr as $duplicate_flag) {
        $session_id = pad_or_trunc($duplicate_flag["SessionID"], 10);
        $test_name  = pad_or_trunc($duplicate_flag["Test_name"], 10);
        $comment_id = $duplicate_flag["CommentID"];
        echo "Warning:{$session_id} {$test_name} {$comment_id}\n";
    }
    
    echo "\n== Finished checks ==\n";
?>