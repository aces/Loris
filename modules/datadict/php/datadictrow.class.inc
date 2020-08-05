<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * row in the datadict menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\datadict;

/**
 * A DataDictRow represents a row in the datadict menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DataDictRow implements \LORIS\Data\DataInstance, \LORIS\StudyEntities\AccessibleResource
{
    protected $DBRow;

    /**
     * Create a new DataDictRow
     *
     * @param array $row The row (in the same format as \Database::pselectRow
     *                   returns
     */
    public function __construct(\LORIS\Data\Dictionary\DictionaryItem $item, array $row)
    {
        $this->item = $item;
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

    public function isAccessibleBy(\User $user) : bool {
        return $this->item->isAccessibleBy($user);
    }

    public function getCategory() : string {
        return $this->DBRow['category'];
    }

    public function getFieldName() : string {
        return $this->DBRow['field'];
    }
    public function getDescription() : string {
        return $this->DBRow['description'];
    }
    public function getScope() : \LORIS\Data\Scope {
        return $this->DBRow['datascope'];
    }
    public function getDataType() :  \LORIS\Data\Type{
        return $this->DBRow['type'];
    }
    public function getCardinality() : \LORIS\Data\Cardinality {
        return $this->DBRow['cardinality'];
    }

}
