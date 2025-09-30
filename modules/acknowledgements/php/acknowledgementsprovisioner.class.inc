<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all modules
 * for the acknowledgements menu page.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\acknowledgements;

/**
 * This class implements a data provisioner to get all modules
 * for the acknowledgements menu page.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class AcknowledgementsProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a AcknowledgementsProvisioner
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct(
            $loris,
            "SELECT
            ordering,
            full_name,
            citation_name,
            affiliations,
            degrees,
            roles,
            start_date,
            end_date,
            present
	    FROM acknowledgements WHERE 1=1
            ORDER BY ordering",
            [],
        );
    }

    /**
     * Returns an instance of a HelpRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new AcknowledgementRow($row);
    }
}
