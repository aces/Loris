<?php declare(strict_types=1);
namespace LORIS\dictionary;
use \LORIS\Data\Dictionary\Category;
use \LORIS\Data\Dictionary\DictionaryItem;

/**
 * A DataDictRow represents a row in the datadict menu table, which
 * is a DictionaryItem with the category and overridden Description
 * added.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataDictRow implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\AccessibleResource
{
    protected \Module $itemmodule;
    protected Category $itemcategory;
    protected DictionaryItem $item;
    protected string $desc;
    protected string $status;
    protected ?array $visits;

    /**
     * Construct a DataDictRow
     *
     * @param \Module        $itemmodule The module that the item is from
     * @param Category       $cat        The way the module is categorized in the
     *                                   item
     * @param DictionaryItem $item       The DictionaryItem for this row
     * @param string         $desc       The (possibly overridden) description
     * @param string         $descstatus The status of the description override
     * @param ?string[]      $visits     List of visits for the item.
     */
    public function __construct(
        \Module $itemmodule,
        Category $cat,
        DictionaryItem $item,
        string $desc,
        string $descstatus,
        ?array $visits,
    ) {
        $this->itemmodule   = $itemmodule;
        $this->itemcategory = $cat;
        $this->item         = $item;
        $this->desc         = $desc;
        $this->status       = $descstatus;
        $this->visits       = $visits;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $scope = $this->getScope();
        $val   = [
            'module'             => $this->itemmodule->getName(),
            'category'           => $this->itemcategory->getName(),
            'field'              => $this->getFieldName(),
            'description'        => $this->desc,
            'description_status' => $this->status,
            'datascope'          => $scope,
            'type'               => $this->getDataType(),
            'cardinality'        => $this->getCardinality(),
        ];

        $itype = $this->item->getDataType();
        if ($itype instanceof \LORIS\Data\Types\Enumeration) {
            $val['options'] = $itype->getOptions();
        }
        if ($scope->__toString() == "session") {
            $val['visits'] = $this->visits;
        }

        return $val;
    }

    /**
     * Implement the AccessibleResource interface by proxying to
     * the underlying DictionaryItem.
     *
     * @param \User $user The user whose access should be checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user) : bool
    {
        return $this->item->isAccessibleBy($user);
    }

    /**
     * Return the module category to which the DictionaryItem belongs
     *
     * @return Category
     */
    public function getCategory() : Category
    {
        return $this->itemcategory;
    }

    /**
     * Return the field name for this row
     *
     * @return string
     */
    public function getFieldName() : string
    {
        return $this->item->getName();
    }

    /**
     * Return the (possibly overridden) description for this row
     *
     * @return string
     */
    public function getDescription() : string
    {
        return $this->desc;
    }

    /**
     * Return the data Scope for this row.
     *
     * @return \LORIS\Data\Scope
     */
    public function getScope() : \LORIS\Data\Scope
    {
        return $this->item->getScope();
    }

    /**
     * Return the data type for this DictionaryItem
     *
     * @return \LORIS\Data\Type
     */
    public function getDataType() : \LORIS\Data\Type
    {
        return $this->item->getDataType();

    }

    /**
     * Return the data Cardinality for this item
     *
     * @return \LORIS\Data\Cardinality
     */
    public function getCardinality() : \LORIS\Data\Cardinality
    {
        return $this->item->getCardinality();
    }

    /**
     * Return a list of visits for this item if the item
     * is session scoped.
     *
     * @return ?string[]
     */
    public function getVisits() : ?array
    {
        return $this->visits;
    }
}
