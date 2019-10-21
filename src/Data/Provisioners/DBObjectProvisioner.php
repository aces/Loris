<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\Data\Provisioners;

/**
 * A DBObjectProvisioner is an instance of ProvisionerInstance which
 * takes an SQL query and the bind parameters to go with it, and
 * executes it against the LORIS database.
 *
 * It also sets the fetch mode to PDO:FETCH_CLASS makes the statement
 * return an instance of a given class name for each row.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class DBObjectProvisioner extends \LORIS\Data\ProvisionerInstance
{
    private $query;
    private $params;
    private $classname;

    /**
     * Constructor
     *
     * @param string $query     The SQL query to prepare and run
     * @param array  $params    The prepared statement bind parameters
     * @param string $classname The class name of the returned objects
     */
    public function __construct(string $query, array $params, string $classname)
    {
        $this->query  = $query;
        $this->params = $params;
        if (!class_exists($classname)) {
            throw new \NotFound($classname . ' not found.');
        }
        $this->classname = $classname;
    }

    /**
     * GetAllInstances implements the abstract method from
     * ProvisionerInstance by executing the query with PDO Fetch class
     * option.
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $DB   = (\NDB_Factory::singleton())->database();
        $stmt = $DB->prepare($this->query);
        $stmt->setFetchMode(\PDO::FETCH_CLASS, $this->classname);
        $stmt->execute($this->params);
        return $stmt;
    }
}
