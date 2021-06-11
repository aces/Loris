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
use \LORIS\LorisInstance as Loris;
use \LORIS\dqt\Models\DataInstances\CategoriesInstance;
/**
 * Data provisioner for Categories
 *
 * PHP version 7
 *
 * @category DQT
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class CategoriesProvisioner extends CouchDBViewProvisioner
{
    /**
     * Create a RowProvisioner
     */
    public function __construct(Loris $loris)
    {
        $query = new CouchDBViewQuery(
            'DQG-2.0',
            'datadictionary',
            [
                "reduce" => "true",
                'group_level' => 1,
            ]
        );

        parent::__construct(
            $loris,
            $query
        );
    }

    public function getInstance($row): DataInstance
    {
        $name = $row->getKey()[0];

        return new CategoriesInstance($name);
    }
}
