<?php
/**
  * Validates some post data.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    require_once __DIR__ . "/validation.php";

    $fullName     = isset($_POST["fullName"])     ? $_POST["fullName"]     : "";
    $citationName = isset($_POST["citationName"]) ? $_POST["citationName"] : "";
    $startDate    = isset($_POST["startDate"])    ? $_POST["startDate"]    : null;
    $endDate      = isset($_POST["endDate"])      ? $_POST["endDate"]      : null;

    $inStudyAtPresent = isset($_POST["inStudyAtPresent"]) ?
        ($_POST["inStudyAtPresent"] === "1") :
        null;

    $affiliationArr = isset($_POST["affiliationArr"]) ?
        $_POST["affiliationArr"] : array();
    $degreeArr      = isset($_POST["degreeArr"])
        ? $_POST["degreeArr"] : array();
    $roleArr        = isset($_POST["roleArr"]) ?
        $_POST["roleArr"] : array();

    //Validate input
    Helper_validateString($fullName, "Full name", 0, 255);
    Helper_validateString($citationName, "Citation name", 0, 255);

    Helper_validateStartEndDate($startDate, $endDate);

    Helper_validateNumericArray($affiliationArr, "Affiliations");
    Helper_validateNumericArray($degreeArr, "Degrees");
    Helper_validateNumericArray($roleArr, "Roles");
?>