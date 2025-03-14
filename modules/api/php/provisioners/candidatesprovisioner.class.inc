<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get the candidate information
 * of all active candidates accessible to a given user.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Provisioners;

use \LORIS\Data\Provisioners\DBRowProvisioner;
use \LORIS\api\Models\CandidatesRow;
/**
 * This class implements a data provisioner to get the candidate information
 * of all active candidates accessible to a given user.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidatesProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for candidates/
     * endpoint.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     */
    function __construct(
        protected \LORIS\LorisInstance $loris
    ) {
        parent::__construct(
            $this->loris,
            '
             SELECT
               c.CandID as CandID,
               p.Name as ProjectName,
               c.RegistrationProjectID as ProjectID,
               c.PSCID as PSCID,
               c.RegistrationCenterID as CenterID,
               s.Name as SiteName,
               c.EDC as EDC,
               c.DoB as DoB,
               c.Sex as Sex
             FROM
               candidate c
             JOIN psc s
               ON (s.CenterID = c.RegistrationCenterID)
             LEFT JOIN Project p
               ON (c.RegistrationProjectID = p.ProjectID)
             WHERE c.Active=\'Y\'
             ORDER BY c.CandID
            ',
            []
        );
    }

    /**
     * Returns an instance of a CandidatesRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new CandidatesRow($row);
    }
}

