<?php

require_once 'generic_includes.php';

$cutoffDate = '1019-01-01';

$query = "SELECT c.PSCID, s.Visit_label, i.height_feet
    from candidate c
    INNER JOIN session s ON c.CandID = s.CandID
    INNER JOIN flag f ON f.SessionID = s.ID
    INNER JOIN bmi i ON i.CommentID = f.CommentID
WHERE DATE(i.Date_taken) < '$cutoffDate'";

$params = array();

$result = $DB->pselect($query, $params);
print_r($result);
