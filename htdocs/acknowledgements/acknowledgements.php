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

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$config = NDB_Config::singleton();
$db     = Database::singleton();

$publication_date = $_GET["date"];
$results          = $db->pselect(
    "SELECT full_name, citation_name,
            title, affiliations, degrees, 
            roles, start_date, end_date
     FROM acknowledgements
     WHERE start_date <= :publication_date
     ORDER BY ordering ASC",
    array('publication_date' => $publication_date)
);
echo "<html>";
echo "<table border='1'>";
echo "<tr>" .
         "<td>Full Name</td>" .
         "<td>Citation Name</td>" .
         "<td>Title</td>" .
         "<td>Affiliations</td>" .
         "<td>Degrees</td>" .
         "<td>Roles</td>" .
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
