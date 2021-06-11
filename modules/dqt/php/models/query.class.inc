<?php declare(strict_types=1);
namespace LORIS\dqt\Models;
use \LORIS\LorisInstance as Loris;

class Query implements \JsonSerializable
{
    public function __construct(
        ?integer $query_id,
        ?string $name,
        ?string $creatorusername,
        ?integer $creationtimestamp,
        QueryFields $fields,
        QueryFilters $filters,
        ?bool $shared
    ) {
        $this->_id        = $query_id;
        $this->_name      = $name;
        $this->_creator   = $creatorusername;
        $this->_timestamp = $creationtimestamp;
        $this->_fields    = $fields;
        $this->_filters   = $filters;
        $this->_shared    = $shared;
    }

    public function execute(Loris $loris, \User $user): \Traversable
    {
        // Get the sessions that match the filters
        $sessions = $this->_filters->getFilteredSessions($loris, $user);

        // Get the fields values for the matching sessions
        $results = $this->_fields->getSelectedFields($loris, $user, $sessions);

        return $results;
    }

    public function getId(): ?string
    {
        return $this->_id;
    }

    public function withId(string $id): Query
    {
        $new = clone($this);
        $new->_id = $id;
        return $new;
    }

    public function withName(?string $name): Query
    {
        $new = clone($this);
        $new->_name = $name;
        return $new;
    }

    public function withCreator(string $username): Query
    {
        $new = clone($this);
        $new->_creator = $username;
        return $new;
    }

    public function withTimestamp(string $timestamp): Query
    {
        $new = clone($this);
        $new->_timestamp = $timestamp;
        return $new;
    }

    public function withShared(?bool $shared=false): Query
    {
        $new = clone($this);
        $new->_shared = $shared;
        return $new;
    }

    public function jsonSerialize()
    {
        return [
            'id'                 => $this->_id,
            'name'               => $this->_name,
            'creator'            => $this->_creator,
            'creation_timestamp' => $this->_timestamp,
            'fields'             => $this->_fields,
            'filters'            => $this->_filters,
            'shared'             => $this->_shared
        ];
    }
}
