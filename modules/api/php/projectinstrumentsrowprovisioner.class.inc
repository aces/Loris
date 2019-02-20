<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the projects/$projectname/instruments endpoint.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api;

use \LORIS\Data\Provisioners\DBRowProvisioner;
/**
 * This class implements a data provisioner to get all possible rows
 * for the projects/$projectname/instruments endpoint
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectInstrumentsRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for projects/$projectname/instruments
     * endpoint.
     */
    function __construct()
    {
        parent::__construct(
            '
             SELECT
               tn.Test_name as shortname,
               tn.Full_name as fullname,
               sg.Subgroup_name as subgroupname
             FROM
               test_names tn
             LEFT JOIN test_subgroups sg
               ON (tn.Sub_group=sg.ID)
            ',
            array()
        );
    }

    /**
     * Returns an instance of a ProjectInstrumentsRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new ProjectInstrumentsRow($row);
    }
}

