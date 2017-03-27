<?php
    if (!isset($_GET["issue_id"])) {
        http_response_code(404);
        echo json_encode(array(
            "error"=>"Invalid issue id"
        ));
        die();
    }
    $issue_id = (int)$_GET["issue_id"];
    
    $db   =& Database::singleton();
    $user =& User::singleton();
    
    if (is_null($user) || is_null($user->getUsername())) {
        http_response_code(401);
        echo json_encode(array(
            "error"=>"Please log in"
        ));
    }
    
    if ($db->pselectOne("
        SELECT
            EXISTS (
                SELECT
                    *
                FROM
                    issues_watching
                WHERE
                    issueID = :issue_id AND
                    userID = :username
            )
    ", array(
        "username"=>$user->getUsername(),
        "issue_id"=>$issue_id
    ))) {
        $stmt = $db->prepare("
            DELETE FROM
                issues_watching
            WHERE
                issueID = :issue_id AND
                userID = :username
        ");
        $db->execute($stmt, array(
            "username"=>$user->getUsername(),
            "issue_id"=>$issue_id
        ));
        echo json_encode(array(
            "watching"=>false
        ));
    } else {
        //Try to watch?
        //I just realized the issues_watching table doesn't have an FK on the issueID column... wtf?
        //Oh, well.
        if ($db->pselectOne("
            SELECT
                EXISTS (
                    SELECT
                        *
                    FROM
                        issues
                    WHERE
                        issueID = :issue_id
                )
        ", array(
            "issue_id"=>$issue_id
        ))) {
            $stmt = $db->prepare("
                INSERT INTO
                    issues_watching (userID, issueID)
                VALUES (
                    :username,
                    :issue_id
                )
            ");
            $db->execute($stmt, array(
                "username"=>$user->getUsername(),
                "issue_id"=>$issue_id
            ));
            echo json_encode(array(
                "watching"=>true
            ));
        } else {
            http_response_code(404);
            echo json_encode(array(
                "error"=>"Invalid issue id"
            ));
        }
    }
?>