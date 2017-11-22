<?php
/**
 * Validates if DCCID and PSCID, submitted from Open Profile
 * form (candidate_list module), are valid.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_List
 * @author   Karolina Marasinska <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

$user =& User::singleton();
if (!($user->hasPermission('access_all_profiles')
    || ($user->hasStudySite() && $user->hasPermission('data_entry')))
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$found = Candidate::candidateExists($_GET['CandID'], $_GET['PSCID']);

if ($found) {
    echo 1;
} else {
    echo 0;
}
