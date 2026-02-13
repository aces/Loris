<?php declare(strict_types=1);

/**
 * This class implements a data Instance which represents a single
 * module in the acknowledgements menu table.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\acknowledgements;

/**
 * AcknowledgementRow represents a row in the acknowledgements menu table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class AcknowledgementRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new HelpRow
     *
     * @param array $row The row
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Serializes the row into an array format compatible with json_encode().
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }

    public function isAccessibleBy(\User $user): bool
    {
        return true;
    }
}
