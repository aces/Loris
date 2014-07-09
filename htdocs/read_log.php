<?php

set_time_limit(0);

$data_source_file = "/data/sandbox/data/logs/.log";

while (true) {
    $last_ajax_call = isset($_GTE['timestamp']) ? (int)$_GET['timestamp'] : null;

    clearstatcache();
   
    $last_change_in_data_file = filemtime($data_source_file);

    if ($last_ajax_call == null || $last_change_in_data_file > $last_ajax_call) {
        if (filesize($data_source_file) == 0) {
            sleep(3);
            continue;
        }
        
        $data = file_get_contents($data_source_file);
        file_put_contents($data_source_file, "");
                
        //$last_change_in_data_file = filemtime($data_source_file);
        
        $result = array(
            'data_from_file' => $data,
            'timestamp' => $last_change_in_data_file
        );
       
        $json = json_encode($result);
        echo $json;
        break;
    } else {
        sleep(3);
        continue;
    }
}
?>
