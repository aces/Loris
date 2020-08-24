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

namespace LORIS\dictionary;

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
    /**
     * Create a new DataDictRow
     *
     * @param array $row The row (in the same format as \Database::pselectRow
     *                   returns
     */
    public function __construct(
        \Module $itemmodule,
        \LORIS\Data\Dictionary\Category $cat,
        \LORIS\Data\Dictionary\DictionaryItem $item,
        string $desc,
        string $descstatus
    ) {
        $this->itemmodule = $itemmodule;
        $this->itemcategory = $cat;
        $this->item = $item;
        $this->desc = $desc;
        $this->status = $descstatus;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $val = [
                    'module'        => $this->itemmodule->getName(),
                    'category'     => $this->itemcategory->getName(),
                    'field'              => $this->getFieldName(),
                    'description'        => $this->desc,
                    'description_status' => $this->status,
                    'datascope' => $this->getScope(),
                    'type' => $this->getScope(),
                    'cardinality' => $this->getCardinality(),
        ];

        $itype = $this->item->getDataType();
        if ($itype instanceof \LORIS\Data\Types\Enumeration) {
            $val['options'] = $itype->getOptions();
        }


        return $val;
    }

    public function isAccessibleBy(\User $user) : bool {
        return $this->item->isAccessibleBy($user);
    }

    public function getCategory() : string {
        return $this->item->getName();
    }

    public function getFieldName() : string {
        return $this->item->getName();
    }

    public function getDescription() : string {
        return $this->DBRow['description'];
    }
    public function getScope() : \LORIS\Data\Scope {
        return $this->item->getScope();
    }

    public function getDataType() :  \LORIS\Data\Type {
        return $this->item->getDataType();

    }
    public function getCardinality() : \LORIS\Data\Cardinality {
        return $this->item->getCardinality();
    }

}
