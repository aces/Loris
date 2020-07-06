<?php
/**
 * This class implements a data Instance which represents a single
 * row in the help editor menu table.
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
 * A HelpRow represents a row in the Help Editor menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Admin
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class HelpRow implements \JsonSerializable
{
    protected $DBRow;

    /**
     * Create a new HelpRow
     *
     * @param array $row The row (in the same format as \Database::pselectRow returns
     *                   returns
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Implements \JsonSerializable interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }
}
