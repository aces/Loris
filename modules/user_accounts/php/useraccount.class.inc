<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * user in the user_accounts menu table.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\user_accounts;

/**
 * A User represents a row in the user_accounts menu table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class UserAccount implements \LORIS\Data\DataInstance
{
    protected $DBRow;

     /**
      * Create a new ModuleRow Instance.
      *
      * @param array $row The ModuleRow Instance
      */
    public function __construct(array $row)
    {
        $row['centerIds'] = explode(',', $row['centerIds']);
        $this->DBRow      = $row;
    }

    /**
     * Returns the CenterIDs for this instance, for
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return array The CenterIDs
     */
    public function getCenterIds() : array
    {
            return $this->DBRow['centerIds'];
    }

     /**
      * Implements \LORIS\Data\DataInstance interface for this row.
      *
      * @return string the instance data.
      */
    public function toJSON(): string
    {
        return json_encode($this->DBRow);
    }
}
