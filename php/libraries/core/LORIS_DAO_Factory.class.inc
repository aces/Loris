<?php
/**
 * This file contains a centralized way of accessing DAOs
 *
 * PHP Version 7
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\Core;

use \LORIS\Models\Candidate_DAO;
use \LORIS\Models\User_DAO;
/**
 * A class for accessing DAOs
 *
 * @category Core
 * @package  Loris
 * @author   xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LORIS_DAO_Factory
{
    private function __construct()
    {
    }

    /**
     * Get a Candidate DAO
     * @return Candidate_DAO
     */
    public static function getCandidateDAO()
    {
        return new Candidate_DAO();
    }
}
