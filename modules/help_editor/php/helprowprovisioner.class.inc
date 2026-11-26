<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all possible rows
 * for the help editor menu page.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Admin
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\help_editor;

/**
 * This class implements a data provisioner to get all possible rows
 * for the help editory menu page.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Admin
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class HelpRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a HelpRowProvisioner, which gets rows for the help_editory
     * menu table.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct(
            $loris,
            "SELECT h.helpID as helpID,
                    h.topic as Topic,
		    h.content as Content,
                    t.Full_name
	     FROM help h
             JOIN test_names t
                ON h.hash = MD5(t.Test_name)
             WHERE h.hash IS NOT NULL
             AND h.topic IS NOT NULL
             ORDER BY h.helpID",
            []
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
            return new HelpRow($row);
    }
}
