<?php
/**
  * Includes all necessary model classes.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    require_once __DIR__ . "/AckCenterAffiliation.php";
    require_once __DIR__ . "/AckCenterDegree.php";
    require_once __DIR__ . "/AckCenterRole.php";
    require_once __DIR__ . "/Acknowledgement.php";
    require_once __DIR__ . "/AcknowledgementAffiliation.php";
    require_once __DIR__ . "/AcknowledgementDegree.php";
    require_once __DIR__ . "/AcknowledgementRole.php";

    //Helper class to make it easier to refactor when multi-site permissions
    //finally make it in.
    //Even without multi-site permissions, it's a good idea to have all
    //permission checks in one place for a module
    require_once __DIR__ . "/AcknowledgementPermission.php";
?>
