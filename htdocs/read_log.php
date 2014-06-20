<?php
/**
    Ajax Streaming 
*/
//('../php/libraries/NDB_Menu_Filter_mri_upload.class.inc');
//require_once ('../php/libraries/Log.class.inc'); 
header('Content-Type: text/octet-stream');
header('Cache-Control: no-cache');
/**
    
*/
function send_message($message)
{
//    $d = array('message' => $message);
  //  echo json_encode($d) . PHP_EOL;
      echo $message;
      ob_flush();
      flush();
}

// need a better way to get the file name,
// not to call this function every second.
// 
function getLogName() {
    $today= getdate();
    $date = sprintf(
        "%04d-%02d-%02d", $today['year'],
        $today['mon'], $today['mday']
    ); 
    $log = "/data/sandbox/data/logs/MRI_upload" . "." . $date . ".log";
    return $log;
}

$logfile = getLogName(); 
$now = time();

if (file_exists($logfile)) {
    $file = fopen($logfile,"r");
    $read = fread($file, filesize($logfile));
    fclose($file); 

    $lines = explode("\n", $read);
    $first = strpos($lines[0], '[') + 1;
    $timeString = substr($lines[0], $first, strpos($lines[0], ']')-$first);

    $now = time();

    $time = strtotime($timeString);
    send_message(filemtime($logfile) . " " . filesize($logfile) . " " . $now . "EXISTS"); 
}
else {
    send_message($now);
}

?>