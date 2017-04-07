<?php
/**
  * Delete a single acknowledgement.
  *
  * @category acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    header("Content-Type: application/json");
    require_once(__DIR__ . "/../model/require_once.php");
    
    //Validate request
    if ($_SERVER["REQUEST_METHOD"] != "DELETE") {
        http_response_code(405);
        die();
    }
    if (!isset($_GET["id"]) || !is_string($_GET["id"]) || !preg_match("/^\d+$/", $_GET["id"])) {
        http_response_code(404);
        die();
    }
    
    //Get input
    $id = $_GET["id"];
    //Validate permission
    if (!AcknowledgementPermission::CanDelete(User::singleton()->userInfo["ID"], $id)) {
        http_response_code(401);
        die();
    }
    //Delete
    if (!Acknowledgement::Delete($id)) {
        http_response_code(500);
        die(json_encode(array(
            "error" => "Could not delete acknowledgement"
        )));
    }
    
    //Output
    http_response_code(204);
    die();
?>