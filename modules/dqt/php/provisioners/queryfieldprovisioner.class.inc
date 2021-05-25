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

use \LORIS\Data\DataInstance;
use \LORIS\Data\Provisioners\CouchDBViewProvisioner;
use \LORIS\Data\CouchDBViewQuery;
use \LORIS\Data\CouchDBResultRow;
use \LORIS\LorisInstance as Loris;
use \LORIS\dqt\Models\QueryFieldInstance;
/**
 * Data provisioner for a Category visit
 *
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class QueryFieldProvisioner extends CouchDBViewProvisioner
{
    /**
     * Create a RowProvisioner
     */
    public function __construct(Loris $loris, QueryField $field)
    {
        $startkey = json_encode([
            $categoryname,
            $fieldname,
            $visitlabel
        ]);

        $endkey = json_encode([
            $categoryname,
            $fieldname,
            $visitlabel,
            new \stdClass()
        ]);

        $query = new CouchDBViewQuery(
            'DQG-2.0',
            'search2',
            [
                "reduce" => "false",
                "startkey" => $startkey
                "endkey" => $endkey
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

        return new QueryFieldInstance($row);
    }
}
