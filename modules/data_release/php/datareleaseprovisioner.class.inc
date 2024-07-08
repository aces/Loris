<?php declare(strict_types=1);
/**
 * This class implements a data provisioner to get all data released files
 * for the data_release menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Rolando Acosta <rolando.acosta@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\data_release;

/**
 * This class implements a data provisioner to get all data released files
 * for the data_release menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Rolando Acosta <rolando.acosta@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

class DataReleaseProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a DataReleaseProvisioner, which gets releases for the
     * data release menu table.
     */
    function __construct()
    {
        $user  =& \User::singleton();
        $query = "
            SELECT
                file_name AS fileName,
                IF(version is null or version ='','Unversioned', version) AS version,
                upload_date AS uploadDate,
                dr.id as dataReleaseID
            FROM data_release dr";

        if (!$user->hasPermission("superuser")) {
            $query .= "
	        INNER JOIN
                    data_release_permissions drp
                ON
                    (dr.id=drp.data_release_id)
                WHERE
                    drp.UserID=".$user->getID();
        }

        $query .= " ORDER BY uploadDate";

        parent::__construct($query, []);
    }

    /**
     * Returns an instance of a DataReleaseRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new DataReleaseRow($row);
    }
}
