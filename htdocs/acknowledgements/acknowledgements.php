<?php

/**
 * Publicly available generator for acknowledgements
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Behavioral
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../vendor/autoload.php";
require_once "../../php/libraries/NDB_Client.class.inc";
require_once "../../php/libraries/NDB_Config.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$config = NDB_Config::singleton();
$db     = Database::singleton();

$publication_date = $_GET["date"];
$results          = $db->pselect(
    "SELECT *
     FROM acknowledgements
     WHERE start_date <= :publication_date",
    array('publication_date' => $publication_date)
);
echo "<html>";
echo "<table border='1'>";
echo "<tr>" .
         "<td>Full Name</td>" .
         "<td>Citation Name</td>" .
         "<td>Title</td>" .
         "<td>Start Date</td>" .
         "<td>End Date</td>" .
     "</tr>";
foreach ($results as $k => $v) {
    echo "<tr>";
    foreach ($v as $key => $value) {
        echo "<td>" . $value . "</td>";
    }
    echo "</tr>";
}
echo "</table>";
echo "</html>";

?>
