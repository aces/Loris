<?php
declare(strict_types=1);
namespace LORIS\instruments;

use \LORIS\Data\Scope;
use \LORIS\Data\Type;
use \LORIS\Data\Cardinality;

/**
 * A DictionaryItem represents a description of a type of data
 * managed by LORIS. An Instrument DictionaryItem differs slightly
 * from the parent, in that it also has a fieldname property to
 * get the name of the field without the "testname_" prefix that
 * is added to the name in order to ensure that the name is unique
 * across instruments for the QueryEngine.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DictionaryItem extends \LORIS\Data\Dictionary\DictionaryItem
{
    /**
     * Construct a DictionaryItem with the given parameters
     *
     * @param string      $name      The field name of the dictionary item
     * @param string      $desc      The dictionary item's description
     * @param Scope       $scope     The scope to which this DictionaryItem
     *                               applies
     * @param Type        $t         The data type of this dictionary item
     * @param Cardinality $c         The data cardinality
     * @param string      $fieldname The non-prefixed field name
     */
    public function __construct(
        string $name,
        string $desc,
        Scope $scope,
        Type $t,
        Cardinality $c,
        public readonly string $fieldname,
    ) {
        parent::__construct($name, $desc, $scope, $t, $c);
    }
}
