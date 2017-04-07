<?php
    require_once(__DIR__ . "/AckCenterAffiliation.php");
    require_once(__DIR__ . "/AckCenterDegree.php");
    require_once(__DIR__ . "/AckCenterRole.php");
    require_once(__DIR__ . "/Acknowledgement.php");
    require_once(__DIR__ . "/AcknowledgementAffiliation.php");
    require_once(__DIR__ . "/AcknowledgementDegree.php");
    require_once(__DIR__ . "/AcknowledgementRole.php");

    //Helper class to make it easier to refactor when multi-site permissions finally make it in.
    //Even without multi-site permissions, it's a good idea to have all permission checks
    //in one place for a module
    require_once(__DIR__ . "/AcknowledgementPermission.php");
?>