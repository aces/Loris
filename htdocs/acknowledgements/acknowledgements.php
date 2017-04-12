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

/**
 * Converts an array of associative arrays to a string representation
 * using values of a given key.
 *
 * @param array  $arr       The array of associative arrays to work on
 * @param string $key       The key to use
 * @param string $separator The text that separates each item
 *
 * @return string
 */
function Helper_arrayToStringOnKey($arr, $key, $separator)
{
    $result = array();
    foreach ($arr as $row) {
        $result[] = $row->$key;
    }
    for ($i=0; $i<count($result); ++$i) {
        $num        = $i+1;
        $cur        = $result[$i];
        $result[$i] = "{$num}. {$cur}";
    }
    return implode($separator, $result);
}
/**
 * Outputs the acknowledgements as html
 *
 * @param array $arr The array of acknowledgements
 *
 * @return void
 */
function Helper_printAcknowledgementsHTML($arr)
{
    foreach ($arr as $row) {
        $row->affiliation_str = Helper_arrayToStringOnKey(
            $row->affiliation_arr,
            "title",
            "<br/>"
        );
        $row->degree_str      = Helper_arrayToStringOnKey(
            $row->degree_arr,
            "title",
            "<br/>"
        );
        $row->role_str        = Helper_arrayToStringOnKey(
            $row->role_arr,
            "title",
            "<br/>"
        );
        $row->in_study_at_present_str = "-";

        if (!is_null($row->in_study_at_present)) {
            $row->in_study_at_present_str = $row->in_study_at_present ?
                "Yes" : "No";
        }
    }

    //Output template using Smarty
    $factory = NDB_Factory::singleton();
    $config  = $factory->config();
    $paths   = $config->getSetting("paths");

    $smarty = new Smarty_neurodb;
    $smarty->addTemplateDir($paths["base"] . "/modules/acknowledgements/templates");
    $smarty->assign(
        array(
         "arr"       => $arr,
         "query_str" => $_SERVER["QUERY_STRING"],
        )
    );
    $smarty->display("htdocs_acknowledgements.tpl");
}
/**
 * Outputs the acknowledgements as a csv download
 *
 * @param array $arr The array of acknowledgements
 *
 * @return void
 */
function Helper_sendAcknowledgementsCSV($arr)
{
    ob_start();
    $f = fopen("php://output", "w");
    //http://php.net/manual/en/function.fputcsv.php#118252
    fputs($f, chr(0xEF) . chr(0xBB) . chr(0xBF));

    fputcsv(
        $f,
        array(
         "Full Name",
         "Citation Name",
         "Affiliations",
         "Degrees",
         "Roles",
         "Present?",
        )
    );
    foreach ($arr as $row) {
        fputcsv(
            $f,
            array(
             $row->full_name,
             $row->citation_name,
             Helper_arrayToStringOnKey($row->affiliation_arr, "title", "\n"),
             Helper_arrayToStringOnKey($row->degree_arr, "title", "\n"),
             Helper_arrayToStringOnKey($row->role_arr, "title", "\n"),
             is_null($row->in_study_at_present) ?
                "-" :
                ($row->in_study_at_present ? "Yes" : "No"),
            )
        );
    }
    fclose($f);
    $csv = ob_get_clean();

    //Taken from:
    //http://stackoverflow.com/questions/8485886/force-file-download-with-php-using-
    //header
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
register_shutdown_function(
    function () {
        $json = ob_get_clean();
        if (http_response_code() == 200) {
            $json = json_decode($json);
            if (isset($_GET["csv"])
                && is_string($_GET["csv"])
                && $_GET["csv"] === "true"
            ) {
                Helper_sendAcknowledgementsCSV($json->arr);
            } else {
                Helper_printAcknowledgementsHTML($json->arr);
            }
        } else {
            if ($json == "") {
                echo "Could not load acknowledgements";
            } else {
                $json = json_decode($json);
                echo $json->error;
            }
        }
    }
);

$skip_header           = true;
$allow_center_null     = true;
$skip_permission_check = true;
require_once __DIR__ ."/../../modules/acknowledgements/ajax/fetch_all_of_center.php";
?>