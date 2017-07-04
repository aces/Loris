<?php
/**
  * Fetch all centers the user can view acknowledgements for.
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

    //Validate request
if ($_SERVER["REQUEST_METHOD"] != "GET") {
    http_response_code(405);
    die();
}
    //fetch
    $result = AcknowledgementPermission::fetchAllViewableCenter(
        User::singleton()->userInfo["ID"]
    );
    //Validate/Process fetched
    if (is_null($result)) {
        http_response_code(404);
        die();
    }
    //Output
    die(
        json_encode(
            ["arr" => $result],
            JSON_PRETTY_PRINT
        )
    );
?>
