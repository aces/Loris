<?php

declare(strict_types=1);

namespace LORIS\Database;

class Query implements \Countable, \IteratorAggregate
{
    protected \PDOStatement $stmt;
    private bool $executed;

    public function __construct(
        protected \PDO $DB,
        protected string $query,
        protected array $params = [],
        protected bool $buffered = true
    ) {
        $this->stmt     = $DB->prepare($query);
        $this->executed = false;
    }

    public function count(): int
    {
        // PDOStatement->rowCount only works for buffered connections
        if ($this->buffered == true) {
            if ($this->executed === false) {
                $this->stmt->execute($this->params);
                $this->executed = true;
            }
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
         return $rows->fetch();
    }

    public function getIterator() : \Traversable
    {
        if ($this->executed === false) {
            $this->stmt->execute($this->params);
            $this->executed = true;
        }
        return $this->stmt;
    }
}
