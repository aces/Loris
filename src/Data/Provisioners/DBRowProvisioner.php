<?php
/**
 * File defines a DBRowProvisioner, which is a type of provisioner that
 * gets data from an SQL database
 */
namespace LORIS\Data\Provisioners;

abstract class DBRowProvisioner extends \LORIS\Data\ProvisionerInstance
{
    private $iteratorCache = null;
    protected $query;
    protected $params;
    function __construct($query, $params)
    {
        $this->query  = $query;
        $this->params = $params;
    }

    public abstract function getInstance($row) : \LORIS\Data\Instance;

    function getAllInstances() : \Traversable
    {
        $DB      = \Database::singleton();
        $stmt    = $DB->prepare($this->query);
        $results = $stmt->execute($this->params);

        if ($results === false) {
            throw new \Exception("Invalid SQL statement: " . $this->query);
        }

        $iterator = new class($stmt, $this) extends \IteratorIterator {
        protected $outer;
        public function __construct($rows, &$self)
        {
            parent::__construct($rows);
            $this->outer = &$self;
        }

        public function current()
        {
            $row = parent::current();
            return $this->outer->getInstance($row);
        }
        };
        return $iterator;
    }
}

