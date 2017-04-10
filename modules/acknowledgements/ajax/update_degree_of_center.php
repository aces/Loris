<?php
/**
  * Update a single degree.
  *
  * @category acknowledgements
  * @package  Loris
  * @author   anyhowstep <justin.ng.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
    header("Content-Type: application/json");
    require_once(__DIR__ . "/../model/require_once.php");
    require_once(__DIR__ . "/validation.php");
    $raw = file_get_contents("php://input");
    parse_str($raw, $_POST);
    
    //Validate request
    if ($_SERVER["REQUEST_METHOD"] != "PUT") {
        http_response_code(405);
        die();
    }
    if (!isset($_GET["id"]) || !is_string($_GET["id"]) || !preg_match("/^\d+$/", $_GET["id"])) {
        http_response_code(404);
        die();
    }
    
    //Get input
    $id = $_GET["id"];
    //Fetch item
    $item = AckCenterDegree::Fetch($id);
    //Validate fetched
    if (is_null($item) || $item->hidden) {
        http_response_code(404);
        die();
    }
    //Validate permission
    if (!AcknowledgementPermission::CanAdministerForCenter(User::singleton()->userInfo["ID"], $item->center_id)) {
        http_response_code(401);
        die();
    }
    //Get and validate the rest of the input
    $title = isset($_POST["title"]) ? $_POST["title"] : null;
    
    validate_string($title, "Title", 1, 255);
    
    //Update
    if (!AckCenterDegree::Update($id, $title, $item->hidden)) {
        http_response_code(500);
        die(json_encode(array(
            "error" => "Could not update degree"
        )));
    }
    
    //Output
    http_response_code(204);
    die();
?>