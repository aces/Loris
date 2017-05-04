<?php
/**
 * Used to create a new entry on a specific thread via the bvl feedback
 * panel.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
 header("content-type:application/json");
 ini_set('default_charset', 'utf-8');
 $DB =& Database::singleton();

   $headers = ['Time','User','Field','Old Value','New Value'];
   
            $history = $DB->pselect(
                'SELECT  changeDate, userID, col, old, new 
                 FROM final_radiological_review_history
                WHERE CommentID= :primKey ORDER BY changeDate DESC',
                array('primKey' => '300022MTL02222211468524343')
            );
            $data = [];
            foreach ($history as $history_item) {

                   $log = [];
                   $log[] = $history_item['changeDate'];
                   $log[] = $history_item['userID'];
                   $log[] = $history_item['col'];
                   $log[] = $history_item['old'];
                   $log[] = $history_item['new'];

                   $data[] = $log;
            }
   
   $result = ['Headers'=>$headers,'Data'=>$data];

   print json_encode($result);
  




?>
