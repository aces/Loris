<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\dqt\Provisioners;

use \LORIS\LorisInstance as Loris;
use \LORIS\Data\DataInstance;
use \LORIS\Data\CouchDBViewQuery;
use \LORIS\Data\CouchDBResultRow;
use \LORIS\dqt\Models\QueryField;
use \LORIS\dqt\Provisioners\CouchDBSortedViewProvisioner;
use \LORIS\dqt\Models\DataInstances\SessionInstance;

/**
 * Data provisioner for a Category
 *
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class FilteredSessionsProvisioner extends CouchDBSortedViewProvisioner
{
    /**
     * Create a provisioner that look for a specific field.
     * If visit is null, it will get all visits by using empty string and 
     * empty object in start_key and endkey respectively.
     */
    public function __construct(Loris $loris, QueryField $field)
    {
        $cat        = $field->getCategoryName();
        $name       = $field->getFieldname();
        $startvisit = $field->getVisitLabel() ?? '';
        $endvisit   = $field->getVisitLabel() ?? new \stdClass();
        $query = new CouchDBViewQuery(
            'DQG-2.0',
            'search2',
            [
                "reduce" => "false",
                "startkey" => json_encode([$cat, $name, $startvisit]),
                "endkey" => json_encode([$cat, $name, $endvisit, new \stdClass()])
            ]
        );

        parent::__construct(
            $loris,
            $query
        );
    }

    public function getInstance($row): DataInstance
    {
        if (!$row instanceof CouchDBResultRow) {
            throw new \InvalidArgumentException('TypeError: row must be an instance of CouchDBResultRow.');
        }
        return $row;
    }
}
