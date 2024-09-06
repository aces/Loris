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
		$stmt = $DB->prepare("SELECT COUNT('x') FROM ($query)");
		$stmt->execute($this->params);
		return $stmt->fetch();
	}
    }

    public function getIterator() : \Traversable
    {
        $this->stmt->execute($this->params);
	return $this->stmt;
    }
}
