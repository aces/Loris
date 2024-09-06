<?php declare(strict_types=1);
namespace LORIS\Database;

class Query implements \Countable, \IteratorAggregate
{
    protected \PDOStatement $stmt;

    public function __construct(
        protected \PDO $DB,
        protected string $query,
        protected array $params = [],
        protected bool $buffered = true
    ) {
        $this->stmt = $DB->prepare($query);
    }

    public function count(): int
    {
        // PDOStatement->rowCount only works for buffered connections
        if ($this->buffered == true) {
            $this->stmt->execute($this->params);
            return $this->stmt->rowCount();
        } else {
            $stmt = $this->DB->prepare("SELECT COUNT('x') FROM ({$this->query})");
            $stmt->execute($this->params);
            return $stmt->fetch();
        }
    }

    public function getFirstRow() : array
    {
         $rows = $this->getIterator();
         assert($rows instanceof \PDOStatement);
         $val = $rows->fetch();
         $rows->closeCursor();
         return $val;
    }

    public function getIterator() : \Traversable
    {
        $this->stmt->execute($this->params);
        return $this->stmt;
    }
}
