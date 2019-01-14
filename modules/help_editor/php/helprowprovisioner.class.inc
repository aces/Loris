<?php
/**
 * This file implements a data provisioner to get all possible rows
 * for the help editor menu page.
 *
 * PHP Version 7
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
 * PHP Version 7
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
     */
    function __construct()
    {
        parent::__construct(
            "SELECT helpChild.helpID as helpID,
                    helpChild.topic as Topic,
                    helpChild.parentID as Parent_ID,
                    helpParent.parentID as ParentTopic_ID,
                    helpParent.topic as Parent_Topic,
                    helpChild.content as Content
             FROM help helpChild
             LEFT JOIN help helpParent
               ON (helpChild.parentID = helpParent.helpID)
             WHERE helpChild.hash IS NOT NULL
             AND helpChild.topic IS NOT NULL
             ORDER BY helpChild.helpID",
            array()
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
