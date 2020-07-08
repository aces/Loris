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

$columns = array(
    'full_name'     => 'Full Name',
    'citation_name' => 'Citation Name',
    'title'         => 'Title',
    'affiliations'  => 'Affiliations',
    'degrees'       => 'Degrees',
    'roles'         => 'Roles',
    'start_date'    => 'Start Date',
    'end_date'      => 'End Date',
    'present'       => 'Present?',
);

$keysAsString   = implode(', ', array_keys($columns));
$valuesAsString = implode('","', array_values($columns));
$valuesAsStringWithQuotes = '"' . $valuesAsString . '"';

$results = $db->pselect(
    "SELECT " . $keysAsString .
    " FROM acknowledgements
    WHERE start_date <= :publication_date
    ORDER BY ordering ASC",
    array('publication_date' => $publication_date)
);
echo "<html>";
echo "<table border='1'>";
echo "<tr>";
foreach ($columns as $k => $v) {
     echo "<td>" . $v . "</td>";
}
echo "</tr>";
foreach ($results as $k => $v) {
    echo "<tr>";
    foreach ($v as $key => $value) {
        echo "<td>" . $value . "</td>";
    }
    echo "</tr>";
}
echo "</table>";

echo "<br>";
echo "CSV:";
echo "<br>";
echo $valuesAsStringWithQuotes;
echo "<br>";
foreach ($results as $k => $v) {
    $result = implode('","', array_values($v));
    echo '"' . $result . '"';
    echo "<br>";
}


echo "</html>";


