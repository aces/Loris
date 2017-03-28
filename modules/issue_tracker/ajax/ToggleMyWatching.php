<?php
/**
 * Issue tracker
 *
 * Toggles the issue-watching flag for a user.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

/**
 * Issue tracker
 *
 * Toggles the issue-watching flag for a user.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
if (!isset($_GET["issue_id"])) {
    http_response_code(404);
    echo json_encode(
        array("error" => "Invalid issue id")
    );
    die();
}
    $issue_id = (int)$_GET["issue_id"];

    $db   =& Database::singleton();
    $user =& User::singleton();

if (is_null($user) || is_null($user->getUsername())) {
    http_response_code(401);
    echo json_encode(
        array("error" => "Please log in")
    );
}

if ($db->pselectOne(
    "
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
    ",
    array(
     "username" => $user->getUsername(),
     "issue_id" => $issue_id,
    )
)) {
    $db->delete(
        "issues_watching",
        array(
         "userID"  => $user->getUsername(),
         "issueID" => $issue_id,
        )
    );
    echo json_encode(
        array("watching" => false)
    );
} else {
    if ($db->pselectOne(
        "
            SELECT
                EXISTS (
                    SELECT
                        *
                    FROM
                        issues
                    WHERE
                        issueID = :issue_id
                )
        ",
        array("issue_id" => $issue_id)
    )) {
        $db->insert(
            "issues_watching",
            array(
             "userID"  => $user->getUsername(),
             "issueID" => $issue_id,
            )
        );
        echo json_encode(
            array("watching" => true)
        );
    } else {
        http_response_code(404);
        echo json_encode(
            array("error" => "Invalid issue id")
        );
    }
}
?>