<?php
/**
 * New_profile
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\new_profile;
/**
 * New_profile
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
        $values = json_decode(file_get_contents('php://input'), true);
        // get data as array tpye  array(5) {  ["dateTaken"]=> "2018-01-01"...
        // create the candidate
        $DB        = \Database::singleton();
        $user   =& \User::singleton();
        $config =& \NDB_Config::singleton();
        $site_arr  = $user->getData('CenterIDs');
        $num_sites = count($site_arr);
        if ($num_sites >1) {
            $candID = \Candidate::createNew(
                $values['site'],
                $values['dateTaken'],
                $values['edcDateTaken'] ?? null,
                $values['gender'],
                $values['pscid'] ?? null
            );
        } else {
            $centerIDs = $user->getData('CenterIDs');
            $centerID  = $centerIDs[0];
            $candID    = \Candidate::createNew(
                $centerID,
                $values['dateTaken'],
                $values['edcDateTaken'] ?? null,
                $values['gender'],
                $values['pscid'] ?? null
            );
        }
        // get the candidate
        $candidate =& \Candidate::singleton($candID);
        // setup the project for candidate
        if (isset($values['project'])) {
            $candidate->setData('ProjectID', $values['project']);
        }
        $result = array();
        $result['candID'] = $candID;
        $result['pscid']  = $candidate->getPSCID();
        echo json_encode($result);













