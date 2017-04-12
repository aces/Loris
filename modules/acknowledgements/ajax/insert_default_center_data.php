<?php
/**
  * Insert default affiliation, degree, role, data for a center.
  *
  * PHP Version 5
  *
  * @category Acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    header("Content-Type: application/json");
    require_once __DIR__ . "/../model/require_once.php";
    require_once __DIR__ . "/validation.php";

    //Validate request
if ($_SERVER["REQUEST_METHOD"] != "PUT") {
    http_response_code(405);
    die();
}
if (!isset($_GET["centerId"])
    || !is_string($_GET["centerId"])
    || !preg_match("/^\d+$/", $_GET["centerId"])
) {
    http_response_code(404);
    die();
}

    //Get input
    $centerId = $_GET["centerId"];
    //Validate permission
if (!AcknowledgementPermission::canAdministerForCenter(
    User::singleton()->userInfo["ID"],
    $centerId
)) {
    http_response_code(401);
    die();
}

    //Default data
    $degreeArr = array(
                  "Bachelor's",
                  "Master's",
                  "MD",
                  "PhD",
                  "Postdoctoral",
                  "Registered Nurse",
                 );
    $roleArr   = array(
                  "Clinical Evaluation",
                  "Consultant",
                  "Data Analysis",
                  "Data Entry",
                  "Database Management",
                  "Database Programming",
                  "Genetic Analysis and Biochemical Assays",
                  "Imaging Processing and Evaluation",
                  "Interview Data Collection",
                  "Investigator",
                  "LP/CSF Collection",
                  "MRI Acquisition",
                  "Project Administration",
                  "Randomization and Pharmacy Allocation",
                 );
    //insert
    foreach ($degreeArr as $str) {
        $item = AckCenterDegree::fetchByTitle($centerId, $str);
        if (!is_null($item)) {
            if ($item->hidden) {
                //Unhide it
                if (AckCenterDegree::update($item->id, $item->title, false)) {
                    continue;
                } else {
                    http_response_code(500);
                    die(
                        json_encode(
                            array("error" => "Could not insert degree '$str'")
                        )
                    );
                }
            } else {
                continue;
            }
        }
        if (is_null(AckCenterDegree::insert($centerId, $str))) {
            http_response_code(500);
            die(
                json_encode(
                    array("error" => "Could not insert degree '$str'")
                )
            );
        }
    }
    foreach ($roleArr as $str) {
        $item = AckCenterRole::fetchByTitle($centerId, $str);
        if (!is_null($item)) {
            if ($item->hidden) {
                //Unhide it
                if (AckCenterRole::update($item->id, $item->title, false)) {
                    continue;
                } else {
                    http_response_code(500);
                    die(
                        json_encode(
                            array("error" => "Could not insert role '$str'")
                        )
                    );
                }
            } else {
                continue;
            }
        }
        if (is_null(AckCenterRole::insert($centerId, $str))) {
            http_response_code(500);
            die(
                json_encode(
                    array("error" => "Could not insert role '$str'")
                )
            );
        }
    }

    //Output
    http_response_code(204);
?>
