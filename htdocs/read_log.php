<?php

header("Cache-Control: no-store, no-cache, must-revalidate");
$data_source_file = "/data/.log";

while (true) {
    clearstatcache();
    if (file_get_contents($data_source_file) == '') {
        sleep(1);
        continue;
    }
    $file = fopen($data_source_file, "r+");
    flock($file, LOCK_EX); 
    $data = file_get_contents($data_source_file);
    ftruncate($file, 0);
    flock($file, LOCK_UN);
    fclose($file);
            
             
    echo $data;
    ob_flush();
    flush();
    break;
                
  
}
?>
