<?php
namespace LORIS\redcap;

/**
 * An REDCap row represents a row in the REDCap menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class RedcapRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    protected $CenterIDs;

    /**
     * Create a new redcap row
     *
     * @param array $row The row (in the same format as \Database::pselectRow
     *  returns.)
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }
}