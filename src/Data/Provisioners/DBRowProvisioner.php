<?php
/**
 * File defines a DBRowProvisioner, which is a type of provisioner that
 * gets data from an SQL database
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Provisioners;

use \LORIS\Data\DataInstance;

/**
 * A DBRowProvisioner is an instance of ProvisionerInstance which
 * takes an SQL query and the bind parameters to go with it, and
 * executes it against the LORIS database.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class DBRowProvisioner extends \LORIS\Data\ProvisionerInstance
{
    protected $query;
    protected $params;

    /**
     * Construct a DB Row provisioner from the given SQL query and
     * bind parameters.
     *
     * @param string $query  The SQL query to prepare and run
     * @param array  $params The prepared statement bind parameters
     */
    public function __construct(string $query, array $params)
    {
        $this->query  = $query;
        $this->params = $params;
    }

    /**
     * Convert a single row from the query to a DataInstance suitable for use
     * by filters and mappers.
     *
     * This must be implemented by users of this class in order to convert
     * the database row to a suitable DataInstance model.
     *
     * @param array $row The database row returned from the PDO
     *
     * @return DataInstance The row converted to a DataInstance
     */
    abstract public function getInstance($row) : DataInstance;

    /**
     * GetAllInstances implements the abstract method from
     * ProvisionerInstance by executing the query, and calling getInstance
     * on the result to convert it from a PHP array to a DataInstance
     * model.
     *
     * This is lazily evaluated, such that only one row of the Traversable
     * is handled at a time.
     *
     * getAllInstances prepares a new query for each call to ensure that
     * the cursor used by the PDO does not conflict with multiple calls
     * to the function, and to make the code more deterministic.
     *
     * @return \Traversable which returns DataInstance for row when traversed.
     */
    public function getAllInstances() : \Traversable
    {
        $DB      = (\NDB_Factory::singleton())->database();
        $stmt    = $DB->prepare($this->query);
        $results = $stmt->execute($this->params);

        if ($results === false) {
            throw new \Exception("Invalid SQL statement: " . $this->query);
        }

        // Wrap an \IteratorIterator to convert from a PDOStatement row to
        // a DataInstance.
        $iterator = new class($stmt, $this) extends \IteratorIterator {
            protected $outer;
            /**
         * Constructor creates a closure over the PDO statement and outer class
         * in order to have access to getInstance()
         *
         * @param \PDOStatement    $rows The PDOStatement being traversed.
         * @param DBRowProvisioner $self The outer class being closed over.
         */
            public function __construct($rows, &$self)
            {
                parent::__construct($rows);
                $this->outer = &$self;
            }

            /**
         * Override IteratorIterator to call the closure's getInstance
         *
         * @return DataInstance
         */
            public function current()
            {
                $row = parent::current();
                return $this->outer->getInstance($row);
            }
        };
        return $iterator;
    }
}
