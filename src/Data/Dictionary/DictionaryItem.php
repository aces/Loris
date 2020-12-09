<?php
declare(strict_types=1);
namespace LORIS\Data\Dictionary;

use \LORIS\Data\Scope;
use \LORIS\Data\Type;
use \LORIS\Data\Cardinality;

/**
 * A DictionaryItem represents a description of a type of data
 * managed by LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DictionaryItem implements \LORIS\StudyEntities\AccessibleResource
{
    protected $name;
    protected $description;
    protected $scope;
    protected $type;

    /**
     * Construct a DictionaryItem with the given parameters
     *
     * @param string      $name  The field name of the dictionary item
     * @param string      $desc  The dictionary item's description
     * @param Scope       $scope The scope to which this DictionaryItem
     *                           applies
     * @param Type        $t     The data type of this dictionary item
     * @param Cardinality $c     The data cardinality
     */
    public function __construct(
        string $name,
        string $desc,
        Scope $scope,
        Type $t,
        Cardinality $c
    ) {
        $this->name        = $name;
        $this->description = $desc;
        $this->scope       = $scope;
        $this->type         = $t;
        $this->cardinality = $c;
    }

    /**
     * Return the field name of this DictionaryItem
     *
     * @return string
     */
    public function getName() : string
    {
        return $this->name;
    }

    /**
     * Return a human readable description of this DictionaryItem.
     *
     * @return string
     */
    public function getDescription() : string
    {
        return $this->description;
    }

    /**
     * Return the data scope at which the data for this DictionaryItem
     * applies.
     *
     * @return Scope
     */
    public function getScope() : Scope
    {
        return $this->scope;
    }

    /**
     * Return the data type for the data which this DictionaryItem
     * describes.
     *
     * @return \LORIS\Data\Type
     */
    public function getDataType() : \LORIS\Data\Type
    {
        return $this->type;
    }

    /**
     * Return the data cardinality of this DictionaryItem. ie. for
     * each entity of type Scope how many pieces of data should
     * exist for this DictionaryItem.
     *
     * @return \LORIS\Data\Cardinality
     */
    public function getCardinality() : \LORIS\Data\Cardinality
    {
        return $this->cardinality;
    }

    /**
     * The DictionaryItem instance implements the AccessibleResource
     * interface in order to make it possible to restrict items per
     * user. However, by default DictionaryItems are accessible by
     * all users. In order to restrict access to certain items, a
     * module would need to extend this class and override the
     * isAccessibleBy method with its prefered business logic.
     *
     * @param \User $user The user whose access should be
     *                    validated
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        return true;
    }
}
