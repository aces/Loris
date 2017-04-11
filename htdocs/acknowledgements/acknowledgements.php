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

require_once(__DIR__ . "/../../vendor/autoload.php");

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$config = NDB_Config::singleton();
$db     = Database::singleton();

function array_to_str_on_key ($arr, $key) {
    $result = array();
    foreach ($arr as $row) {
        $result[] = $row->$key;
    }
    return implode(", ", $result);
}
function print_acknowledgements_html($arr) {
    ?>
        <style>
            tr {
                font-family:verdana;
            }
            tr:nth-child(even) {
                background-color:#CCCCCC;
            }
            tr:nth-child(odd) {
                background-color:#DDDDDD;
            }
            .date {
                white-space:nowrap;
            }
        </style>
        <a href="/acknowledgements/acknowledgements.php?<?php echo htmlspecialchars($_SERVER["QUERY_STRING"]); ?>&csv=true">
            Download CSV
        </a>
        <table border="0" cellpadding="5">
            <tr>
                <th>Full Name</th>
                <th>Citation Name</th>
                <th>Affiliations</th>
                <th>Degrees</th>
                <th>Roles</th>
                <th>Present?</th>
            </tr>
            <?php foreach ($arr as $row): ?>
                <tr>
                    <td><?php echo htmlspecialchars($row->full_name); ?></td>
                    <td><?php echo htmlspecialchars($row->citation_name); ?></td>
                    <td><?php echo htmlspecialchars(array_to_str_on_key($row->affiliation_arr, "title")); ?></td>
                    <td><?php echo htmlspecialchars(array_to_str_on_key($row->degree_arr, "title")); ?></td>
                    <td><?php echo htmlspecialchars(array_to_str_on_key($row->role_arr, "title")); ?></td>
                    <td><?php
                        if (is_null($row->in_study_at_present)) {
                            echo "-";
                        } else {
                            echo $row->in_study_at_present ? "Yes" : "No";
                        }
                    ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php
}
function send_acknowledgements_csv ($arr) {
    ob_start();
    $f = fopen("php://output", "w");
    fputcsv($f, array(
        "Full Name",
        "Citation Name",
        "Affiliations",
        "Degrees",
        "Roles",
        "Present?"
    ));
    foreach ($arr as $row) {
        fputcsv($f, array(
            $row->full_name,
            $row->citation_name,
            array_to_str_on_key($row->affiliation_arr, "title"),
            array_to_str_on_key($row->degree_arr, "title"),
            array_to_str_on_key($row->role_arr, "title"),
            is_null($row->in_study_at_present) ?
                "-" :
                ($row->in_study_at_present ? "Yes" : "No")
        ));
    }
    fclose($f);
    $csv = ob_get_clean();
    
    //Taken from http://stackoverflow.com/questions/8485886/force-file-download-with-php-using-header
    $quoted = sprintf('"%s"', addcslashes("acknowledgements.csv", '"\\'));
    $size   = strlen($csv);

    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=' . $quoted); 
    header('Content-Transfer-Encoding: binary');
    header('Connection: Keep-Alive');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . $size);
    
    echo $csv;
}
/*
    This is what will happen:
    01) We will capture all output
    02) We will register a function to be called when die() is called
    03) We will set some global variables that affect how the file in 04 behaves
    04) We include a file that is currently used for ajax calls to fetch data
    05) The file will process the user's input and output its message in a die() call
    06) Our function from 02 will be called
    07) We get the output and output html/csv
*/
ob_start();
register_shutdown_function(function () {
    $json = ob_get_clean();
    
    if (http_response_code() == 200) {
        $json = json_decode($json);
        if (isset($_GET["csv"]) && is_string($_GET["csv"]) && $_GET["csv"] === "true") {
            send_acknowledgements_csv($json->arr);
        } else {
            print_acknowledgements_html($json->arr);
        }
    } else {
        if ($json == "") {
            echo "Could not load acknowledgements";
        } else {
            $json = json_decode($json);
            echo $json->error;
        }
    }
});

$skip_header = true;
$allow_center_null = true;
$skip_permission_check = true;
require_once(__DIR__ . "/../../modules/acknowledgements/ajax/fetch_all_of_center.php");
?>