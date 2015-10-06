<?php
/**
 * User: Stella
 * Date: 15-08-15
 *
 * Project Statistics - Updating Counts From Each LORIS
 */

set_include_path(get_include_path().":../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
require_once"Utility.class.inc";
require_once"Database.class.inc";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize('../project/config.xml');

$db =& Database::singleton();
$config = NDB_Config::singleton();

$date = date("m_d_Y");
$output_file = "project_statistics_$date.csv";
$fp = fopen($output_file, 'w');
echo "PROJECT STATISTICS SCRIPT - $date\n\n";
echo "Data can be found in $output_file.\n\n";

$headers = array(
    'Project',
    'Number of Scanning - Visits',
    'Number of Sites',
    'Variable Count',
    'Number of instruments',
    'total number of visits (for all candidates)',
    'number of candidates',
    'GB of imaging data (raw and processed)',
    '# of scans'
);



$projectname = $config->getSetting('project');

// Where project's statistics will be stored
$project_statistics = array();

// Number of Scanning - Visits
$number_scanning_visits = $db->pselect("select count(*) from session where Scan_done='Y'", array());

// Number of Sites
$number_sites = $db->pselect("select count(*), Name from psc WHERE CenterID <>1", array());

// Variable Count
$variable_count = $db->pselect("select count(*) from parameter_type where queryable='1' and Name not like '%_status'", array());

// Number of instruments
$number_instruments = $db->pselect("select count(*) from test_names", array());

// Total number of visits (for all candidates)
$number_visits = $db->pselect("select count(*) from session where Active='Y' AND Current_stage <> 'Not Started'", array());

// Number of candidates
$number_candidates = $db->pselect("SELECT count(*) FROM candidate c WHERE c.Active = 'Y' and c.CenterID <> 1 and pscid <> 'scanner'", array());

// GB of imaging data (raw and processed)
$dir = $config->getSetting("UploadDir");

$handle = fopen ('php://stdin', 'r');
$dir_name = "/data/$projectname/data";
if(file_exists($dir_name)) {
    exec("cd /data/$projectname/data;du -h .");
    $gb_imaging_data = fgets($handle);
} else {
    $gb_imaging_data = NULL;
}
fclose($handle);

// # of scans
$number_scans = $db->pselect("select count(*) from files", array());


$queries = compact(
    $number_scanning_visits, $number_sites,
    $variable_count, $number_instruments,
    $number_visits, $number_candidates, $number_scans
);

// Extracts data from each query and puts into $project_statistics array


$project_statistics[$headers[0]] = $projectname;
$i = 1;
while ($i < 9) {
    foreach ($queries as $query) {
        if ($i != 7) {
            foreach ($query as $j => $row) {
                foreach ($row as $k => $count) {
                    $project_statistics[$headers[$i]] = $count;
                }
                $i++;
//                break;
                continue;
            }

        } elseif ($i == 7) {
            $project_statistics[$headers[$i]] = $gb_imaging_data;
            $i++;
        }
    }
}



// If query is blank, populate csv with "Unknown"
foreach($headers as $header) {
    if($project_statistics[$header] == NULL) {
        $project_statistics[$header] = "Unknown";
    }
}

// Adds headers and project statistics into csv file
fputcsv($fp, $headers);

fputcsv($fp, $project_statistics);

echo "File writing for $projectname complete.\n\n";

fclose($fp);


//$file_type = "text/csv";
//$file_size = filesize($output_file);
//$handle = fopen($output_file, "r");
//$content = fread($handle, $file_size);
//fclose($handle);
//
//$content = chunk_split(base64_encode($content));
//
//$to = "stellajhlee@hotmail.com";
//$subject = "Project Statistics";
//
//$message = "<html>
//<head>
//  <title>Project Statistics</title>
//</head>
//<body><table><tr><td>MAKE</td></tr></table></body></html>";
//
//$uid = md5(uniqid(time()));
//
//#$header = "From: ".$from_name." <".$from_mail.">\r\n";
//#$header .= "Reply-To: ".$replyto."\r\n";
//$header .= "MIME-Version: 1.0\r\n";
//$header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";
//$header .= "This is a multi-part message in MIME format.\r\n";
//$header .= "--".$uid."\r\n";
//$header .= "Content-type:text/html; charset=iso-8859-1\r\n";
//$header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
//$header .= $message."\r\n\r\n";
//$header .= "--".$uid."\r\n";
//$header .= "Content-Type: text/csv; name=\"".$output_file."\"\r\n"; // use diff. tyoes here
//$header .= "Content-Transfer-Encoding: base64\r\n";
//$header .= "Content-Disposition: attachment; filename=\"".$output_file."\"\r\n\r\n";
//$header .= $content."\r\n\r\n";
//$header .= "--".$uid."--";
//
//mail($to, $subject, $message, $header);


?>

